<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="750">
      <v-card
        style="overflow: hidden !important"
        class="align-center card-style justify-center pa-8"
      >
        <v-card
          :disabled="disabled"
          height="50%"
          class="elevation-0 d-flex align-center pa-5 card-style2"
        >
          <v-form v-model="valid">
            <v-row class="justify-center">
              <v-col cols="12" :md="role == 'all' ? 12 : 12">
                <amp-select text="نقش" :items="roles" v-model="role" />
              </v-col>

              <v-col
                cols="12"
                md="6"
                v-if="
                  role != 'all' &&
                  role != this.$store.state.auth.role.oprator_id ||
                  $checkRole(this.$store.state.auth.role.admin_id)
                  ||
                  ($checkRole(this.$store.state.auth.role.superviser_id) &&  role == this.$store.state.auth.role.oprator_id )
                "
              >
                <UserSelectForm
                  :disabled="!Boolean(role)"
                  text="انتخاب کاربر"
                  v-model="user"
                  :url="url_users"
                  :rules="Boolean(role) ? 'require' : ''"
                  :role-id="[role]"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
                v-if="role == this.$store.state.auth.role.oprator_id &&
                 !$checkRole(this.$store.state.auth.role.superviser_id)
                 &&   !$checkRole(this.$store.state.auth.role.admin_id)
                 "
              >
                <UserSelectForm
                  text="انتخاب سرپرست مربوطه"
                  v-model="supervizor"
                  url="user/list-employee"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                v-if="role == this.$store.state.auth.role.oprator_id &&
                 !$checkRole(this.$store.state.auth.role.superviser_id)
                 &&   !$checkRole(this.$store.state.auth.role.admin_id)
                 "
              >
                <amp-select
                  :disabled="Boolean(supervizor.length == 0)"
                  text="انتخاب فروشنده"
                  v-model="selected_operator"
                  rules="require"
                  :items="operator_list"
                />
              </v-col>
              <v-col cols="12" md="6">
                <amp-jdate
                  text="تاریخ شروع"
                  :is-number="true"
                  v-model="start_date"
                />
              </v-col>
              <v-col cols="12" md="6">
                <amp-jdate
                  text="تاریخ پایان"
                  :is-number="true"
                  v-model="end_date"
                />
              </v-col>
              <v-col cols="12" md="12">
                <amp-autocomplete
                  rules="require"
                  text=" وضعیت"
                  chips
                  multiple
                  v-model="status"
                  :items="$store.state.static.status_message"
                />
              </v-col>

              <v-col cols="12" md="6" class="mt-8">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  @click="getExcelFile"
                  :disabled="status.length == 0 || !valid"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <div class="text-center mt-4">
          <v-progress-circular
            v-if="disabled"
            class="pa-5"
            :rotate="360"
            :size="130"
            :width="13"
            :value="value"
            color="#13945f"
          >
            <div v-if="!loading">
              <v-icon
                v-if="total_data.length == total_length"
                size="45"
                color="#13945f"
              >
                task_alt
              </v-icon>
              <div v-else>
                <small class="grey--text"> بارگیری اکسل</small>
                <br />
                <v-icon color="black" size="22"> download </v-icon>
                <br />
                <small class="black--text">
                  {{ status_request }}
                </small>
              </div>
            </div>
            <div v-if="loading">
              <small class="grey--text"> در حال آماده سازی برای بارگیری </small>
              <br />
              <v-icon color="black" small> hourglass_top </v-icon>
            </div>
          </v-progress-circular>
          <v-col cols="12" class="text-center">
            <v-btn @click="closeDialog" color="black" text>
              بستن / انصراف
            </v-btn>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      disabled: false,
      page_number: 1,
      total_length: "0",
      value: 0,
      end: false,
      last_page: 10000000,
      total_data: [],
      selected_operator: "",
      supervizor: [],
      operator_list: [],
      user: [],
      roles: [],
      role: "all",
      valid: true,
      start_date: "",
      url_users: "",
      end_date: "",
      set_filters: {},
      status: [],
      excel_hed: [
        {
          text: "زمان ثبت",
          filterType: "date",
          filterCol: "created_at",
          value: (body) => {
            if (body.created_at) {
              return this.$toJalali(body.created_at);
            }
            return "";
          },
        },
        { text: "نام کاربر", value: "user_first_name" },
        { text: "نام خانوادگی", value: "user_last_name" },
        {
          text: "شماره ارسال کننده",
          type: "phone",
          filterCol: "user_username",
          value: "user_username",
        },
        {
          text: "گیرنده",
          value: "receptor",
        },
        {
          text: "شناسه پیام",
          value: "messageid",
        },
        {
          text: "مرحله",
          value: "step",
        },
        {
          text: "وضعیت",
          value: "status",
        },
        {
          text: "پیام",
          value: "message",
        },
      ],
    };
  },
  beforeMount() {
    if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.url_users = "user/searchByRole";
    } else {
      this.url_users = "user/list-employee";
    }
    this.roles = [
      {
        text: "همه",
        key: "all",
        value: "all",
      },
      {
        text: "سرپرست  ",
        key: "supervisor",
        value: this.$store.state.auth.role.superviser_id,
      },
      {
        text: "فروشنده",
        key: "oprator",
        value: this.$store.state.auth.role.oprator_id,
      },
    ];
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.roles = [
      {
        text: "همه",
        key: "all",
        value: "all",
      },

      {
        text: "فروشنده",
        key: "oprator",
        value: this.$store.state.auth.role.oprator_id,
      },
    ];
    }
  },
  watch: {
    total_data: {
      deep: true,
      handler() {
        this.value = (this.total_data.length * 100) / this.total_length;
      },
    },
    supervizor: {
      deep: true,
      handler() {
        this.listOperator();
      },
    },
    role() {
      if (this.role == "all") {
        this.user = [];
      }
    },
  },
  computed: {
    status_request() {
      return `
 ${this.total_length} / ${this.total_data.length}
  `;
    },
  },
  methods: {
    getExcelFile() {
      this.setCustomFilter();
      this.disabled = true;
      if (Boolean(this.end)) {
        return;
      }

      if (this.last_page < this.page_number) {
        this.total_data.length = this.total_length;
        this.value = 100;
        let name = "";
        let file_name = "";
      


        if (this.role != "all" && this.user.length >0) {
          name =
            this.user[0].first_name && this.user[0].last_name
              ? this.user[0].first_name + " " + this.user[0].last_name
              : this.user[0].username;
        }else if (Boolean(this.selected_operator)) {
        let find = this.operator_list.find((x)=>this.selected_operator == x.value )
        if (Boolean(find)) {
          name = find.text
        }
        }

        if (Boolean(name)) {
          file_name = ` ( ${name} )  پیام های  دریافتی `;
        } else {
          file_name = "پیام های  دریافتی";
        }
        
        this.$exportCSV(this.excel_hed, this.total_data, file_name);
        this.disabled = false;
        this.last_page = 10000000;
        this.page_number = 1;
        return;
      }

      this.$reqApi("/message", {
        paginate: true,
        row_number: 346,
        paginate_num: 346,
        page: this.page_number,
        filters: this.set_filters,
      })
        .then((res) => {
          this.last_page = res.model.last_page;

          if (res.model.total == 0) {
            this.$toast.info("با توجه به فیلتر های اعمال شده دیتایی ثبت نشده");
            this.disabled = false;
            return;
          }
          this.total_length = res.model.total;
          if (res.model.data.length > 0) {
            this.getSortData(res.model.data);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getSortData(data) {
      return new Promise((resolve, reject) => {
        let done_messages = [];

        try {
          for (let i = 0; i < data.length; i++) {
            const x = data[i];

            done_messages.push({
              user_first_name: x.user_first_name,
              user_last_name: x.user_last_name,
              receptor: x.receptor,
              status: this.$getItemEnum(
                this.$store.state.static.status_message,
                x.status
              ),
              messageid: x.messageid,
              step: this.$getItemEnum(
                this.$store.state.static.step_message,
                x.step
              ),
              user_username: this.$showUsername(x.user_username),
              message: x.message,
            });
          }
        } catch (error) {}

        resolve(done_messages);
      })
        .then((response) => {
          this.total_data = [...this.total_data, ...response];
          this.page_number++;
          this.getExcelFile();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.end = true;
      this.$emit("closeDialog");
    },
    setCustomFilter() {
      let filter = {};
      let key = "=";
      let value = "";

      if (this.user.length > 0 && Boolean(this.role) && this.role != "all") {
        let find = this.roles.find((f) => f.value == this.role);
        if (Boolean(find)) {
          if (find.key == "supervisor") {
            filter["supervisor_id"] = this.user[0].id;
          } else {
            filter["operator_id"] = this.user[0].id;
          }
        }
      }
      if (Boolean(this.selected_operator)) {
        filter["operator_id"] = this.selected_operator;
      }
      if (this.status.length == 1) {
        key = "=";
        value = this.status[0];
      } else if (this.status.length > 1) {
        key = "in";
        value = [];
        value = this.status;
      }
      filter["status"] = {
        op: key,
        value: value,
      };
      if (Boolean(this.start_date) && !Boolean(this.end_date)) {
        filter["created_at"] = {
          op: ">=",
          value: this.start_date,
        };
      } else if (Boolean(this.start_date) && Boolean(this.end_date)) {
        filter["created_at"] = {
          op: "between",
          from: this.start_date + " 00:00:00",
          to: this.end_date + " 23:59:59",
        };
      } else if (Boolean(this.end_date)) {
        filter["created_at"] = {
          op: "<=",
          value: this.end_date,
        };
      }
      this.set_filters = filter;
    },
    listOperator() {
      if (this.supervizor.length > 0) {
        this.$reqApi("user/list-operator", {
          supervisor_id: this.supervizor[0].id,
        })
          .then((res) => {
            let sub_users = [];
            for (let i = 0; i < res.length; i++) {
              const x = res[i];
              let name =
                Boolean(x.first_name) && Boolean(x.last_name)
                  ? `${x.first_name} ${x.last_name} | ${x.username}`
                  : x.username;
              sub_users.push({
                text: name,
                value: x.id,
              });
            }
            this.operator_list = sub_users;
          })
          .catch((err) => {});
      }
    },
  },
};
</script>
<style scoped>
.card-style {
  background-color: #ffffff !important;
}
.card-style2 {
  background-color: #ffffff !important;
  border: 8px double rgba(0, 0, 0, 0.158);
  border-radius: 8px !important;
}
</style>

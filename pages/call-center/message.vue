<template>
  <v-row>
    <v-col cols="12" md="12" v-if="is_super_admin">
      <v-row
        class="d-flex justify-center my-4"
        cols="12"
        md="6"
        v-if="$store.state.auth.role.is_admin"
      >
        <v-col cols="12" md="5">
          <v-card class="elevation-5 pa-5 text-center">
            <span style="font-size: 15px; color: #ca7214">
              لطفا سرپرست و اپراتور مد نظر را انتخاب کنید
            </span>
            <v-card-text class="d-flex justify-space-around align-center pa-3">
              <v-card width="400" class="elevation-0">
                <UserSelectForm
                  text="انتخاب سرپرست"
                  v-model="selected_superviser_id"
                  :url="superviser_list"
                  rules="require"
                  :role-id="[$store.state.auth.role.superviser_id]"
                />
              </v-card>
              <v-card width="400" class="elevation-0">
                <UserSelectForm
                  :rootBody="{ superviser_id: selected_superviser_id }"
                  text="انتخاب اپراتور"
                  v-model="selected_operator_id"
                  :url="operator_list"
                  rules="require"
                  :role-id="[$store.state.auth.role.oprator_id]"
                />
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-card :disabled="checkSelectedUserForSuperAdmin" class="elevation-0">
        <v-tabs v-model="tab" class="ma-3 center-div" color="white">
          <v-tab v-for="(item, index) in items_tab" :key="item" color="white">
            <v-chip dark color="primary" class="white--text" :outlined="tab != index">
              {{ item }}
            </v-chip>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item class="">
            <v-card v-if="selected_superviser_id.length > 0">
              <BaseTable
                :headers="headers"
                :url="addmin_calcenter"
                :rootBody="{ superviser_id: selected_superviser_id }"
              />
            </v-card>
          </v-tab-item>
          <v-tab-item class="">
            <v-card v-if="selected_operator_id.length > 0">
              <BaseTable
                :headers="headers"
                :rootBody="{ operator_id: selected_operator_id }"
                :url="operator_url"
              />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>

    <v-col cols="12" md="12">
      <v-row class="d-flx justify-center">
        <v-col cols="12" md="5" v-if="is_admin" class="mt-2">
          <DistributeOperator
            :url="superviser_distribute"
            title="تخصیص دستی پیام (به مرکز تماس)"
            :userListUrl="superviser_list"
            icon="send"
          />
        </v-col>
        <!-- <v-col cols="12" md="6" v-if="is_admin" class="mt-2">
            <UserCreate
              :url="insert_superviser"
              title="ایجاد سوپروایزر"
              icon="account_circle"
            />
          </v-col> -->
        <v-col cols="12" md="6">
          <v-row class="pa-5 center-div">
            <v-col cols="12" md="3" class="ma-2" v-if="is_superviser">
              <v-btn class="success" @click="manualDistribute">
                <span>تخصیص دستی</span>
                <v-icon class="mx-2">checklist_rtl</v-icon>
              </v-btn>
              <DialogUserSelect
                :UserDialog="dialog_user_manual"
                title="انتخاب اپراتور"
                :listUrl="operator_list"
                @selectUser="setManualDistribute"
                @reload="reload"
                @clearVModel="clearVModel"
                @close="dialog_user_manual = !dialog_user_manual"
              />
            </v-col>
            <v-col cols="12" md="4" class="ma-2 center-div">
              <v-btn
                v-if="check_role_btn"
                dark
                class="primary"
                @click="percentDistribute(url_auto_admin)"
              >
                <span>تخصیص خودکار</span>
                <v-icon class="mx-2">storage</v-icon>
              </v-btn>
              <v-btn
                v-if="is_superviser"
                dark
                class="primary"
                @click="AuotoDistributeOperator"
              >
                <span>تخصیص خودکار</span>
                <v-icon class="mx-2">storage</v-icon>
              </v-btn>
              <DialogUserSelect
                :UserDialog="dialog_serperviser"
                :title="title_dialog"
                :helper_text="helper_text"
                :listUrl="users_list"
                v-if="dialog_serperviser"
                @reload="reload"
                :url_auto="url_auto"
                @selectUser="setPrcentDistrubute"
                @close="dialog_serperviser = false"
              />
            </v-col>
            <v-col cols="12" md="4" class="ma-2">
              <v-btn
                v-if="check_role_btn"
                class="blue"
                dark
                @click="percentDistribute(url_history)"
              >
                <span> تخصیص بر اساس سابقه فروش</span>
                <v-icon class="mx-2">storefront</v-icon>
              </v-btn>
              <DialogUserSelect
                :url_auto="url_auto"
                :UserDialog="dialog_serperviser"
                :title="title_dialog"
                :listUrl="users_list"
                v-if="dialog_serperviser"
                @reload="reload"
                @selectUser="setPrcentDistrubute"
                @close="dialog_serperviser = false"
              />
              <v-btn v-if="is_superviser" dark class="blue" @click="BySellPercent">
                <span> تخصیص بر اساس سابقه فروش</span>

                <v-icon class="mx-2">storefront</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-col>

    <v-row cols="12" class="center-div" v-if="is_superviser">
      <v-chip
        dark
        label
        class="ma-2 px-3"
        color="primary"
        v-for="item in items"
        :key="item.key"
        @click="tab = item.key"
        :outlined="tab != item.key"
      >
        {{ item.text }}
      </v-chip>
    </v-row>
    <v-row class="center-div" v-if="check_role_btn">
      <v-chip
        dark
        label
        class="ma-2 px-3"
        color="primary"
        v-for="item in items_add_cla"
        :key="item.key"
        @click="tab_add_cal = item.key"
        :outlined="tab_add_cal != item.key"
      >
        {{ item.text }}
      </v-chip>
    </v-row>

    <v-col cols="12" md="12" v-if="url && !is_super_admin">
      <BaseTable
        :headers="headers"
        :url="url"
        :filters="filters"
        :autoUpdate="autoUpdate"
        :autoDelete="autoDelete"
        :BTNactions="btnActions"
        v-model="selected_item"
        ref="refMessage"
      />
    </v-col>

    <ChangeStatus
      v-if="dialog_change_status.show"
      :dialog_change_status="dialog_change_status"
      :messageInfo="message_info"
      :userInfo="user_info"
      @relod="reload"
    />
    <Customer
      v-if="dialog_customer.show"
      :DialogCustomer="dialog_customer"
      :customer="customer"
    />
    <DialogFile
      v-if="dialog_file.show"
      :opratorId="oprator_id"
      :DialogFile="dialog_file"
    />
  </v-row>
</template>
<script>
import DistributeOperator from "@/components/CallCenter/DistributeSuperviser.vue";
import DialogUserSelect from "~/components/CallCenter/DialogUserSelect.vue";
import ChangeStatus from "~/components/CallCenter/ChangeStatus.vue";
import Customer from "~/components/CallCenter/Customer.vue";
import UserCreate from "~/components/CallCenter/UserCreate.vue";
import UserSelectForm from "@/components/User/UserSelectForm.vue";
export default {
  components: {
    DistributeOperator,
    DialogUserSelect,
    UserCreate,
    UserSelectForm,
    ChangeStatus,
    Customer,
  },
  data() {
    return {
      tab: "all",
      items: [
        { text: "همه", key: "all" },
        { text: "درصف تخصیص", key: "active" },
        { text: "تخصیص داده شده", key: "in_active" },
      ],
      tab_add_cal: "all",
      items_add_cla: [
        { text: "همه", key: "all" },
        { text: "درصف تخصیص", key: "active" },
        { text: "تخصیص داده شده", key: "in_active" },
      ],
      check_role_btn: false,
      url_auto: "",
      url_auto_admin: "/call-center/distribute-operator",
      url_history: "/call-center/distribute-by-sell-percent",
      btnActions: [],
      title: "پیام های دریافتی",
      url: "",
      autoDelete: "",
      autoUpdate: "",
      message_info: {},
      customer: {},
      user_info: {},
      createUrl: "",
      tab: null,
      dialog_user_manual: false,
      dialog_change_status: { show: false, items: null },
      dialog_customer: { show: false, items: null },
      dialog_file: { show: false, items: null },
      filters: {},
      dialog_serperviser: false,
      is_super_admin: false,
      is_superviser: false,
      is_admin: false,
      selected_item: [],
      title_dialog: "",
      helper_text: "",
      is_operator: false,
      items_tab: ["پیام های دریافتی  سرپرست", "پیام های دریافتی اپراتور"],
      headers: [],
      addmin_calcenter: "/recived-message",
      superviser_url: "/call-center/superviser-messages",
      operator_url: "/call-center/operators-messages",
      superviser_distribute: "/call-center/distribute-superviser",
      operator_distribute: "/call-center/distribute-operator ",
      operator_distribute_manul: "/call-center/distribute-operator-manual ",
      operator_distrubute_by_sell_percent: "/call-center/distribute-by-sell-percent ",
      selected_operator_id: "",
      selected_superviser_id: "",
      users_list: "",
      superviser_list: "/call-center/superviser-list",
      operator_list: "/call-center/operator-list",
      insert_operator: "/call-center/insert-operator",
      insert_superviser: "/call-center/insert-superviser",
    };
  },
  watch: {
    tab() {
      if (this.tab == "all") {
        this.filters = {};
      }
      if (this.tab == "in_active") {
        this.filters = {
          operator_id: {
            op: "!=",
            value: null,
          },
        };
      }
      if (this.tab == "active") {
        this.filters = {
          operator_id: {
            op: "=",
            value: null,
          },
        };
      }
    },
    tab_add_cal() {
      if (this.tab_add_cal == "all") {
        this.filters = {};
      }
      if (this.tab_add_cal == "in_active") {
        this.filters = {
          superviser_id: {
            op: "!=",
            value: null,
          },
        };
      }
      if (this.tab_add_cal == "active") {
        this.filters = {
          superviser_id: {
            op: "=",
            value: null,
          },
        };
      }
    },
  },
  beforeMount() {
    if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.check_role_btn = true;
    }
    this.headers = [
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
      {
        text: "نام سرپرست مرکز تماس",
        value: (body) => {
          if (body.superviser) {
            if (body.superviser.first_name) {
              return body.superviser.first_name;
            } else {
              return body.superviser.username;
            }
          } else {
            return "---";
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (body.superviser) {
            if (body.superviser.last_name) {
              return body.superviser.last_name;
            }
          } else {
            return "---";
          }
        },
      },
      { text: "ارسال کننده", value: "sender" },
      { text: "گیرنده", value: "receptor" },

      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.message_status,
      },
      {
        text: "نام اوپراتور مرکز تماس",
        value: (body) => {
          if (body.operator) {
            if (body.operator.first_name) {
              return body.operator.first_name;
            } else {
              return body.operator.username;
            }
          } else {
            return "---";
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (body.operator) {
            if (body.operator.last_name) {
              return body.operator.last_name;
            }
          } else {
            return "---";
          }
        },
      },
      {
        filterable: false,
        type: "tooltip",
        function: (body) => {
          let text = "";
          if (body.message) {
            text = "پیام : " + body.message;
          }
          return text;
        },
        value: (body) => {
          if (!Boolean(body.message)) {
            return "";
          }
          if (typeof body.message == "string") {
            if (body.message) {
              return `<i aria-hidden="true" class=" gray--text v-icon notranslate pr-16 mr-5 material-icons" style="font-size: 20px;">mark_email</i>`;
            }
          }
        },
      },
    ];
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      let headers = this.headers;
      headers.splice(1, 2);
      this.headers = headers;
    }
    if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      let headers = this.headers;
      headers.splice(1, 2);
      headers.splice(4, 2);

      this.headers = headers;
    }

    this.$store.dispatch("setPageTitle", this.title);
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.is_superviser = true;

      this.headers.unshift({
        text: "",
        width: "10px",
        type: "checkbox",
        disableSort: true,
        filterable: false,

        show_box: (body) => {
          if (body.status == "new") {
            return true;
          } else {
            return false;
          }
        },
      });

      this.url = this.superviser_url;
    } else if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      this.is_operator = true;
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.is_super_admin = true;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.url = this.addmin_calcenter;
      this.is_admin = true;
    }
    this.btnActions = [
      {
        icon: "published_with_changes",
        color: "orange",
        text: "برسی ",
        fun: (body) => {
          this.dialog_change_status.show = true;
          this.message_info = body;
          this.user_info = body.user;
        },
        show_fun: (body) => {
          if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        icon: "assignment_ind",
        color: "info",
        text: "اطلاعات مشتری",
        fun: (body) => {
          this.dialog_customer.show = true;
          this.customer = body.user;
        },
        // show_fun: (body) => {
        //   if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // },
      },
    ];
  },
  computed: {
    checkSelectedUserForSuperAdmin() {
      if (
        this.selected_operator_id.length > 0 &&
        this.selected_superviser_id.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    manualDistribute() {
      if (this.selected_item.length < 1) {
        this.$toast.error("موردی انتخاب نشده است");
        return;
      }
      this.dialog_user_manual = true;
    },
    setManualDistribute(event) {
      if (!event[0]) {
        this.$toast.error("اپراتور فروش انتخاب نشده است");
        return;
      }
      let form = {
        operator_id: event[0],
        messages_id: this.selected_item,
      };
      this.$reqApi("/call-center/distribute-operator-manual", form)
        .then((res) => {})
        .catch((err) => {
          return err;
        });
    },
    autoDistribute() {
      this.dialog_serperviser = true;
      this.url_auto = "/call-center/distribute-operator";
    },
    percentDistribute(url) {
      this.url_auto = url;
      if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
        (this.title_dialog = "انتخاب سرپرست مرکز تماس"),
          (this.helper_text =
            "پیام ها به اوپراتوری تخصیص داده میشوند که سرپرست مرکز تماس آنها انتخاب شده باشد"),
          (this.users_list = "/call-center/superviser-list");
      }
      // if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      //   this.title_dialog = "اپراتور مرکز تماس";
      //   this.users_list = "/call-center/distribute-by-sell-percent";
      // }
      this.dialog_serperviser = true;
    },
    setPrcentDistrubute(event, status) {
      if (event) {
        let form = {
          superviser_id: event[0],
        };
        this.$reqApi(event[1], form)
          .then((res) => {})
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
    },
    BySellPercent() {
      let url = "/call-center/distribute-by-sell-percent";
      let data = "";
      this.$reqApi(url)
        .then((res) => {
          data = res.distributed_messages_count;
          if (data != 0) {
            this.reload();
            this.$toast.success("پیام تخصیص داده شد" + `${data}`);
            return;
          }
        })
        .catch((err) => {
          return err;
        });
    },
    AuotoDistributeOperator() {
      let url = "/call-center/distribute-operator";
      let data = "";
      this.$reqApi(url)
        .then((res) => {
          data = res.distributed_messages_count;
          if (data == 0) {
            this.$toast.error("پیام جدیدی وجود ندارد");
            return;
          }
          if (data != 0) {
            this.reload();
            this.$toast.success("پیام تخصیص داده شد" + `${data}`);
            return;
          }
        })
        .catch((err) => {
          return err;
        });
    },
    reload() {
      this.$refs.refMessage.getDataFromApi();
    },
    clearVModel() {
      this.selected_item = [];
    },
  },
};
</script>

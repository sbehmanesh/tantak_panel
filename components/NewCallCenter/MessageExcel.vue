<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="650">
      <v-card
        style="overflow: hidden !important"
        class="align-center card-style justify-center pa-8"
      >
        <v-card
          :disabled="disabled"
          height="50%"
          class="elevation-0 d-flex align-center pa-5 card-style2"
        >
          <v-col cols="12" md="10">
            <amp-autocomplete
              text="خروجی اکسل  براساس وضعیت"
              chips
              multiple
              v-model="status"
              :items="$store.state.static.status_message"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-button
              text="تایید"
              height="38"
              block
              color="teal darken-2"
              @click="getVarComs"
              :disabled="status.length == 0"
            />
          </v-col>
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
export default {
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

  watch: {
    total_data: {
      deep: true,
      handler() {
        this.value = (this.total_data.length * 100) / this.total_length;
      },
    },
    status: {
      depp: true,
      handler() {
        let filter = {};
        let key = "=";
        let value = "";
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
        this.set_filters = filter;
      },
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
    getVarComs() {
      this.disabled = true;
      if (Boolean(this.end)) {
        return;
      }
      if (this.last_page < this.page_number) {
        this.total_data.length = this.total_length;
        this.value = 100;
        let file_name = "پیام های انجام شده";
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
          console.log("  this.total_data >>> ", this.total_data);

          this.page_number++;
          this.getVarComs();
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

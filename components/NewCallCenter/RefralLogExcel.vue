<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="450">

        <v-card
          :disabled="disabled"
          class="elevation-0 d-flex align-center pa-3 "
          style="overflow: hidden !important;"
        >
          <v-form v-model="valid">
            <v-row class="justify-center">
              <v-col cols="12" md="12">
                <amp-select
                  text="نقش"
                  :items="roles"
                rules="require"

                  v-model="form.type_report"
                />
                <UserSelectForm
                  v-if="Boolean(form.type_report)"
                  text="انتخاب کاربر"
                  v-model="user"
                  url="user/searchByRole"
                  :rules="Boolean(form.type_report) ? 'require' : ''"
                  :role-id="filter_role"
                />
                <amp-jdate
                  text="تاریخ شروع"
                  :is-number="true"
                rules="require"

                  v-model="form.start_at"
                />
                <amp-jdate
                class="mt-3"
                rules="require"
                  text="تاریخ پایان"
                  :is-number="true"
                  v-model="form.end_at"
                />
              </v-col>
              <v-row class="align-center pa-2 justify-center my-2">
                <amp-button
                  text="تایید"
                  height="38"
                  class="ma-2"
                  :loading="loading"
                  color="blue-grey"
                  @click="getLogsRefral"
                  :disabled="!valid || loading"
                />
                <amp-button
                  text="انصراف"
                  height="38"
                    class="ma-2"
                  color="red"
                  @click="closeDialog"
                  :disabled="loading"
                />
              </v-row>
            </v-row>
          </v-form>
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
      loading: false,
      disabled: false,
      page_number: 1,
      total_length: "0",
      value: 0,
      end: false,
      total_data: [],
      filter_role: [],
      user: [],
      roles: [],
      form: {
        type_report: "",
        end_at: "",
        start_at: "",
        user_id: "",
      },

      valid: true,
      set_filters: {},
      excel_hed: [
        { text: "شماره همراه ارجاع دهنده", value: "sender_phone" },
        {
          text: "مرحله ارجاع ",
          value: "step",
        },
        {
          text: "تعداد پیام ارجاع داده شده",
          value: "count",
        },
        { text: "گیرنده", value: "geter" },
        { text: "شماره همراه  گیرنده", value: "geter_phone" },
      ],
    };
  },
  beforeMount() {
    this.roles = [
      {
        text: "مدیر مرکز تماس",
        value: "manager",
        role_id: this.$store.state.auth.role.admin_call_center_id,
      },
      {
        text: "سرپرست",
        value: "supervisor",
        role_id: this.$store.state.auth.role.superviser_id,
      },
      {
        text: "فروشنده",
        value: "operator",
        role_id: this.$store.state.auth.role.oprator_id,
      },
    ];
  },
  watch: {
    total_data: {
      deep: true,
      handler() {
        this.value = (this.total_data.length * 100) / this.total_length;
      },
    },
    "form.type_report"() {
      this.filter_role = [];
      let find = this.roles.find((x) => x.value == this.form.type_report);
      if (Boolean(find)) {
        this.filter_role.push(find.role_id);
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
    getLogsRefral() {
      this.loading = true;
      let form = { ...this.form };
      form.user_id = this.user[0].id;
      this.$reqApi("message/refer/history-report", { ...form })
        .then((res) => {
          if (res) {
            if (res.result.length == 0) {
              this.$toast.info("برای کاربر مورد نظر تاریخچه ای ثبت نشده");
              this.loading = false;
              return;
            }
            this.getExcelFile(res);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getExcelFile(data) {
      let excel_name = "";
      let file_name =
        Boolean(data.user.first_name) && Boolean(data.user.last_name)
          ? data.user.first_name + " " + data.user.last_name
          : data.user.username;
      if (Boolean(file_name)) {
        excel_name = ` ( ${file_name} )  گزارش ارجاعات تماس `;
      }
      let body_items = [];
      for (let i = 0; i < data.result.length; i++) {
        const x = data.result[i];
        let step_refral = this.$getItemEnum(
          this.$store.state.static.step_message,
          x.step
        );
        body_items.push({
          sender_phone: data.user.username,
          geter:
            Boolean(x.to_personnel) &&
            Boolean(x.to_personnel.first_name) &&
            Boolean(x.to_personnel.last_name)
              ? x.to_personnel.first_name + " " + x.to_personnel.last_name
              : "--",
          geter_phone: Boolean(x.to_personnel) ? x.to_personnel.username : "--",
          count: x.count,
          step: step_refral,
        });
      }
      this.$exportCSV(this.excel_hed, body_items, excel_name);
      this.loading = false;
      this.$toast.success("اکسل گزارش ارجاعات با موفقیت دریافت شد");
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

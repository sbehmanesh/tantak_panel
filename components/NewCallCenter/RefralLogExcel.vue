<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="500">
      <v-card
        :disabled="disabled"
        class="elevation-0 pa-3 "
      >
      <div class="card-style pa-5" elevation="2">
        <v-banner class="mb-5"> <h1>خروجی اکسل گزارشات تماس</h1></v-banner>
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
                v-if="Boolean(check_show_list)"
                text="انتخاب کاربر"
                v-model="user"
                :url="url_list"
                :rules="Boolean(form.type_report) ? 'require' : ''"
                :role-id="filter_role"
              />
              <amp-select
                :disabled="!Boolean(form.type_report)"
                text="مرحله را انتخاب کنید"
                :items="step_items"
                rules="require"
                v-model="form.step"
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
      loading: false,
      disabled: false,
      valid: true,
      url_list: "user/searchByRole",
      filter_role: [],
      user: [],
      roles: [],
      form: {
        type_report: "",
        end_at: "",
        start_at: "",
        user_id: "",
      },
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
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.url_list = "user/list-employee";
      this.roles = [
        {
          text: "خودم",
          value: "supervisor",
          role_id: this.$store.state.auth.role.superviser_id,
        },
        {
          text: "فروشنده",
          value: "operator",
          role_id: this.$store.state.auth.role.oprator_id,
        },
      ];
    } else {
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
    }
  },
  watch: {
    "form.type_report"() {
      this.filter_role = [];
      console.log("E --> ", this.form.type_report);
      if (this.form.type_report == "manager") {
        this.step_items = [
          {
            text: "مدیر مرکز تماس به سرپرست مرکز تماس",
            value: "manager_to_supervisor",
          },
          {
            text: "پیام های بسته شده",
            value: "close",
          },
        ];
      } else if (this.form.type_report == "supervisor") {
        this.step_items = [
          {
            text: "   از سرپرست مرکز تماس به فروشنده",
            value: "supervisor_to_operator",
          },
          {
            text: "   از سرپرست مرکز تماس به مدیر مرکز تماس",

            value: "supervisor_to_manager",
          },
        ];
      } else {
        this.step_items = [
          {
            text: "   از  فروشنده به سرپرست مرکز   ",
            value: "operator_to_supervisor",
          },
        ];
      }
      let find = this.roles.find((x) => x.value == this.form.type_report);
      if (Boolean(find)) {
        this.filter_role.push(find.role_id);
      }
    },
  },
  computed: {
    check_show_list() {
      if (
        Boolean(this.$checkRole(this.$store.state.auth.role.superviser_id)) &&
        this.form.type_report == "supervisor"
      ) {
        return false;
      } else if (!Boolean(this.form.type_report)) {
        return false;
      } else {
        return true;
      }
    },

  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    getLogsRefral() {
      this.loading = true;
      let form = { ...this.form };
      if (
        Boolean(this.$checkRole(this.$store.state.auth.role.superviser_id)) &&
        form.type_report == "supervisor"
      ) {
        form.user_id = this.$store.state.auth.user.id;
      } else {
        form.user_id = this.user[0].id;
      }
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

  },
};
</script>
<style scoped>
.card-style {
  overflow: hidden !important;
  border-radius: 8px !important;
  border: 7px double #a8a8a8b8;
}
.card-style2 {
  background-color: #ffffff !important;
  border: 8px double rgba(0, 0, 0, 0.158);
  border-radius: 8px !important;
}
</style>

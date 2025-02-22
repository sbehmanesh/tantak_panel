<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card style="overflow: hidden">
        <v-col cols="12" class="pa-0 ma-0">
          <v-alert dense prominent icon="event_repeat" class="grey lighten-2">
            <h1 class="font_17">‌برسی روند ارجاع</h1>
          </v-alert>
        </v-col>
        <v-form v-model="valid" class="pa-3">
          <v-col cols="12" class="pa-0 ma-0">
            <amp-select
              :disabled="set_items.length == 1"
              text="تعیین مرحله"
              rules="require"
              :items="set_items"
              v-model="form.step"
            />
            <UserSelectForm
              v-if="show_select_user"
              :text="select_user_title"
              v-model="user"
              :url="url"
              rules="require"
            />
            <AmpUploadFileNew
              text="بارگذاری فایل"
              v-model="form.file"
              class="mb-5"
            />
            <amp-select
              text="پیام های اماده"
              :items="$store.state.setting.ready_messages"
              v-model="ready_message"
            />
            <amp-textarea
              text=" توضیحات"
              rules="require"
              v-model="form.message"
              :rows="2"
            />
          </v-col>
        </v-form>
        <v-card-actions>
          <v-row class="d-flex justify-center pa-1">
            <amp-button
              text="انصراف"
              @click="closeDialog"
              color="red"
              class="ma-2"
            />
            <amp-button
              text="تایید"
              @click="submit"
              color="success darken-1"
              class="ma-2"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: {
    UserSelectForm,
  },
  props: {
    dialog: {
      require: false,
      default: false,
    },

    modelId: {
      require: false,
      default: false,
    },
    statusPayment: {
      require: false,
      default: false,
    },
    stepOrder: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      user: [],
      valid: true,
      loading: false,
      show_select_user: false,
      url: "user/list-employee",
      select_user_title: "",
      form: {
        step: "",
        message: "",
        id: "",
        file: "",
      },
      ready_message: "",
    };
  },
  mounted() {
    this.$store.dispatch("setting/readyMessages");
  },
  watch: {
    ready_message() {
      this.message = this.ready_message;
    },
    "form.step"() {
      switch (this.form.step) {
        case "supervisor_to_employee_stock":
          this.show_select_user = true;
          this.select_user_title = "انتخاب کارمند انبار مرکزی ";
          break;
        case "fiscal_manager_to_supervisor":
          this.show_select_user = true;
          this.select_user_title = "انتخاب   سرپرست واحد مالی ";
          break;
        case "fiscal_supervisor_to_fiscal":
          this.show_select_user = true;
          this.select_user_title = "انتخاب   واحد مالی ";
          break;
        default:
          this.show_select_user = false;
          break;
      }
    },
  },
  computed: {
    set_items() {
      let items = [];
      if (this.$checkRole(this.$store.state.auth.role.sefir)) {
        if (this.stepOrder == "accept_reviewer") {
          items = [
            {
              text: "ارجاع به مدیر واحد مالی",
              value: "debtor_to_fiscal_manager",
            },
          ];
          this.form.step = "debtor_to_fiscal_manager";
        } else {
          items = [
            {
              text: "ارجاع به سرپرست انبار مرکزی",
              value: "debtor_to_reviewer",
            },
            {
              text: "بستن",
              value: "cancel",
            },
          ];
        }
      }

      if (
        this.$checkRole(this.$store.state.auth.role.superviser_centeral_stock)
      ) {
        items = [
          {
            text: "تایید",
            value: "accept_reviewer",
          },
          {
            text: "عدم تایید",
            value: "not_accept_reviewer",
          },
          {
            text: " مرجوع کردن (ارجاع به  سفیر )",
            value: "reviewer_to_debtor",
          },
        ];
      }
      if (this.$checkRole(this.$store.state.auth.role.sales_expert)) {
        items = [
          {
            text: " مرجوع کردن (ارجاع به سرپرست نمایندگی )",
            value: "employee_to_supervisor_sale ",
          },
        ];
        if (this.statusPayment == "wait") {
          items.push({
            text: "تایید سفارش",
            value: "accept_employee_sale",
          });
        }
      }

      if (
        this.$checkRole(this.$store.state.auth.role.employee_centeral_stock)
      ) {
        items = [
          {
            text: " مرجوع کردن (ارجاع به سرپرست انبار مرکزی )",
            value: "employee_to_supervisor_stock",
          },
          {
            text: " درحال بسته بندی سفارش",
            value: "waiting_packaging",
          },
        ];
      }
      if (this.$checkRole(this.$store.state.auth.role.fiscal_manager)) {
        items = [
          {
            text: "ارجاع  به سرپرست واحد مالی",
            value: "fiscal_manager_to_supervisor",
          },
          {
            text: "مرجوع کردن (ارجاع به بدهکار )",
            value: "fiscal_manager_to_debtor",
          },
        ];
      }
      if (this.$checkRole(this.$store.state.auth.role.fiscal_supervisor)) {
        items = [
          {
            text: "ارجاع  به  واحد مالی",
            value: "fiscal_supervisor_to_fiscal",
          },
          {
            text: "مرجوع کردن (ارجاع به مدیر واحد مالی)",
            value: "fiscal_supervisor_to_manager",
          },
        ];
      }
      if (this.$checkRole(this.$store.state.auth.role.fiscal)) {
        items = [
          {
            text: "تایید سفارش",
            value: "done",
          },
          {
            text: "مرجوع کردن (ارجاع به سرپرست واحد مالی)",
            value: "fiscal_to_fiscal_supervisor",
          },
        ];
      }

      return items;
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.id = this.modelId;
      switch (this.form.step) {
        case "fiscal_manager_to_supervisor":
          form["user_refer_id"] = this.user[0].id;
          break;
        case "fiscal_supervisor_to_fiscal":
          form["user_refer_id"] = this.user[0].id;
          break;
      }

      this.$reqApi("debt/referral", form)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.$emit("reload");
          this.closeDialog();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

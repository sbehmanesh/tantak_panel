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

    basketId: {
      require: false,
      default: false,
    },
    statusPayment: {
      require: false,
      default: false,
    },
    stepInvitor: {
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
      ready_message: "",
      form: {
        step: "",
        message: "",
        id: "",
        file: "",
      },
    };
  },
  mounted() {},
  watch: {
    ready_message() {
      this.message = this.ready_message;
    },
    "form.step"() {
      switch (this.form.step) {
        case "supervisor_to_employee_sale":
          this.show_select_user = true;
          this.select_user_title = "انتخاب کارشناس";
          break;
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
          this.select_user_title = "انتخاب    واحد مالی ";
          break;
        case "pack_and_send":
          this.show_select_user = true;
          this.select_user_title = "انتخاب سفیر";
          this.url = "user/sefir";
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
      if (this.$checkRole(this.$store.state.auth.role.agency_manager)) {
        if (this.stepInvitor == "accept_fiscal") {
          this.form.step = "manager_to_supervisor_stock";
          items = [
            {
              text: "ارجاع به سرپرست انبار مرکزی",
              value: "manager_to_supervisor_stock",
            },
          ];
        } else if (
          this.stepInvitor == "init" ||
          this.stepInvitor == "supervisor_to_manager_sale" 
        ) {
          this.form.step = "manager_to_supervisor_sale";
          items = [
            {
              text: "ارجاع به سرپرست فروش",
              value: "manager_to_supervisor_sale",
            },
          ];
        } else if (this.stepInvitor == "accept_employee_sale" ||   this.stepInvitor == "fiscal_manager_to_manager" ) {
          this.form.step = "manager_to_fiscal_manager";
          items = [
            {
              text: "ارجاع به  مدیر واحد مالی",
              value: "manager_to_fiscal_manager",
            },
          ];
        }
      }

      if (this.$checkRole(this.$store.state.auth.role.sales_manager)) {
        items = [
          {
            text: " مرجوع کردن (ارجاع به مدیر نمایندگی )",
            value: "supervisor_to_manager_sale",
          },
          {
            text: "ارجاع به کارشناس فروش",
            value: "supervisor_to_employee_sale",
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
        this.$checkRole(this.$store.state.auth.role.superviser_centeral_stock)
      ) {
        items = [
          {
            text: " مرجوع کردن (ارجاع به مدیر نمایندگی )",
            value: "supervisor_stock_to_manager",
          },
          {
            text: "ارجاع به کارمند انبار مرکزی",
            value: "supervisor_to_employee_stock",
          },
        ];
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
        if (this.stepInvitor == "waiting_packaging") {
          this.form.step = "pack_and_send";
          items = [
            {
              text: "بسته بندی و ارسال سفارش",
              value: "pack_and_send",
            },
          ];
        }
      }
      if (this.$checkRole(this.$store.state.auth.role.fiscal_manager)) {
        items = [
          {
            text: "ارجاع  به سرپرست واحد مالی",
            value: "fiscal_manager_to_supervisor",
          },
          {
            text: "مرجوع کردن (ارجاع به مدیر نمایندگی فروش)",
            value: "fiscal_manager_to_manager",
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
            value: "accept_fiscal",
          },
          {
            text: "مرجوع کردن (ارجاع به سرپرست واحد مالی)",
            value: "fiscal_to_fiscal_supervisor",
          },
        ];
      }
      if (this.$checkRole(this.$store.state.auth.role.sefir)) {
        items = [
          {
            text: " مدیر نمایندگی فروش",
            value: "sefir_to_agency_manager",
          },
          {
            text: "مرجوع کردن (ارجاع به کارمند انبار مرکزی)",
            value: "sefir_to_employee_stock",
          },
        ];
      }
      return items;
    },
  },
  methods: {
    submit() {
      this.loading = true;
      if (!Boolean(  this.show_select_user)) {
        this.user = []
        
      }
      let form = { ...this.form };
      form.id = this.basketId;
      switch (this.form.step) {
        case "supervisor_to_employee_sale":
          form["user_refer_id"] = this.user[0].id;
          break;
        case "supervisor_to_employee_stock":
          form["user_refer_id"] = this.user[0].id;
          break;
        case "fiscal_manager_to_supervisor":
          form["user_refer_id"] = this.user[0].id;
          break;
        case "fiscal_supervisor_to_fiscal":
          form["user_refer_id"] = this.user[0].id;
          break;
        case "pack_and_send":
          form["user_refer_id"] = this.user[0].id;
          break;

        default:
          break;
      }


      this.$reqApi("product-request/referral", form)
        .then((res) => {
          let name = "";
          if (Boolean(this.user) && Boolean(this.user[0])) {
            if (
              Boolean(this.user[0].first_name) &&
              Boolean(this.user[0].last_name)
            ) {
              name = this.user[0].first_name + " " + this.user[0].last_name;
            } else {
              name = this.user[0].username;
            }
            this.$toast.success(
              `  با موفقیت به 
              ${name} 
               ارجاع داده شد
              `
            );
          } else {
            this.$toast.success("عملیات با موفقیت  انجام شد");
          }
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

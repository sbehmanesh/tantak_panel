<template>
  <div>
    <v-stepper vertical v-model="e1" class="grey lighten-4">
      <v-stepper-step :complete="e1 > 1" step="1">
        <span>
          تعیین روند ارجاع
          <small class="pt-1"> نوع تخصیص یا مرحله پیام را انتخاب کنید </small>
        </span>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-form v-model="valid_step1">
          <v-row class="d-flex justify-center">
            <v-col cols="5" v-if="is_superviser || is_oprator">
              <amp-autocomplete
                rules="require"
                v-model="step_ref"
                :items="step_items"
                text="انتخاب مرحله"
              />
            </v-col>
            <v-col cols="5" v-if="Boolean(show_type_send)">
              <amp-select
                rules="require"
                v-model="type_send"
                :items="select_type_send"
                text="نوع تخصیص"
              />
            </v-col>

            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid_step1"
              class="mt-10 ml-4"
              v-if="Boolean(back_ref) && Boolean(check_steps)"
              color="primary"
              @click="submit()"
            >
              تایید
            </v-btn>
            <v-btn
              v-else
              class="mt-10 ml-4"
              color="primary"
              @click="e1 = 2"
              :disabled="!valid_step1"
            >
              بعدی
            </v-btn>
            <v-btn class="mt-10 ml-4" color="info" @click="clearAll()"> انصراف </v-btn>
          </v-row>
        </v-form>
      </v-stepper-content>
      <v-stepper-step
        v-if="Boolean(check_steps || !chek_number_step)"
        :complete="e1 > 2"
        step="2"
      >
        انتخاب پیام
        <small class="pt-1">
          پیام هایی را که قصد تخصیص یا بستن آن را دارید از لیست پایین انتخاب کنید
        </small>
      </v-stepper-step>
      <v-stepper-content step="2" v-if="Boolean(check_steps || !chek_number_step)">
        <v-col cols="12">
          <v-row>
            <span class="primary--text font_15">
              <v-icon size="15" color="primary"> mail </v-icon>
              تعداد پیام انتخاب شده : {{ selected_item.length }}
            </span>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4" v-if="!Boolean(back_ref)">
              <v-btn color="primary" :disabled="selected_item.length < 1" @click="e1 = 3">
                بعدی
              </v-btn>

              <v-btn color="info" @click="e1 = 1"> برگشت </v-btn>
            </v-col>
            <v-col cols="12" md="4" v-else>
              <v-btn color="primary" @click="submit()"> تایید </v-btn>

              <v-btn color="info" @click="e1 = 1"> برگشت </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-stepper-content>
      <v-stepper-step
        v-if="!Boolean(back_ref) || Boolean(check_steps)"
        :step="chek_number_step ? 2 : 3"
      >
        انتخاب مرکز تماس
        <small class="pt-1">
          مرکز تماسی را که قصد تخصیص به آن را دارید , انتخاب کنید
        </small>
      </v-stepper-step>

      <v-stepper-content
        :step="chek_number_step ? 2 : 3"
        v-if="!Boolean(back_ref) || Boolean(check_steps)"
      >
        <v-row>
          <v-col cols="12" md="6">
            <UserSelectForm
              :text="is_admin_call_center ? ' انتخاب مرکز تماس' : 'انتخاب فروشنده'"
              v-model="user"
              :url="url_list"
              rules="require"
              :role-id="[]"
            />
          </v-col>
          <v-spacer></v-spacer>
          <div class="mt-10 mx-5">
            <v-btn color="primary" @click="submit()"> تایید </v-btn>
            <v-btn color="info" v-if="Boolean(chek_number_step)" @click="e1 = 1">
              برگشت
            </v-btn>
            <v-btn color="info" v-else @click="e1 = 2"> برگشت </v-btn>
          </div>
        </v-row>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  props: {
    DialogRefer: {
      require: false,
      default: false,
    },
    MessageId: {
      require: false,
      default: false,
    },
    selected_item: {
      require: false,
      default: false,
    },
  },
  components: {
    UserSelectForm,
  },
  data: () => ({
    select_type_send: [],
    step_items: [],
    superviser_list: "call-center/superviser-list",
    oprator_list: "call-center/operator-list",
    type_send: "",
    step_ref: "",
    valid_step1: true,
    valid_step2: true,
    valid_step3: true,
    user: [],
    valid_comment: true,
    is_superviser: false,
    is_oprator: false,
    is_admin_call_center: false,
    e1: 1,
    url_list: "",
    titel_list: "",
    loading: false,
  }),
  beforeMount() {
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.is_superviser = true;
      this.step_items = [
        { text: "ارجاع به مدیر (مرجوع کردن)", value: "supervisor_to_manager" },
        { text: "  ارجاع به فروشنده", value: "supervisor_to_operator" },
      ];
      this.url_list = this.oprator_list;
      this.titel_list = "انتخاب فروشنده";
      this.select_type_send = [
        { text: "تخصیص خودکار", value: "auto" },
        { text: "دستی", value: "multi" },
        { text: "بر اساس سابقه فروش", value: "sale" },
      ];
    }
    if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      this.is_oprator = true;
      this.step_items = [
        { text: "ارجاع  به مرکز تماس (مرجوع کردن)", value: "operator_to_supervisor" },
      ];
    }
    if (
      this.$checkRole(this.$store.state.auth.role.admin_id) ||
      this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {
      this.is_admin_call_center = true;
      this.url_list = this.superviser_list;
      this.select_type_send = [
        { text: "تخصیص خودکار", value: "auto" },
        { text: "دستی", value: "multi" },
        { text: "بر اساس سابقه فروش", value: "sale" },
        { text: "بستن", value: "close" },
      ];
    }
  },
  methods: {
    submit() {
      this.loading = true;
      let form = {};
      let step = "";
      let role_user = "";
      // //////////////////////////////////////////////////////////////
      if (Boolean(this.is_admin_call_center)) {
        if (this.type_send == "close") {
          step = "close";
          form["step"] = step;
        } else {
          form["supervisor_id"] = this.user[0].id;
          step = "manager_to_supervisor";
        }
        form["type_send"] = this.type_send;
        form["step"] = step;
      }
      ///////////////////////////////////////////////////////////      // //////////////////////////////////////////////////////////////
      if (Boolean(this.is_superviser)) {
        if (
          this.step_ref == "supervisor_to_operator" &&
          (this.type_send == "multi" || this.type_send == "auto")
        ) {
          form["operator_id"] = this.user[0].id;
        }

        form["step"] = this.step_ref;
        form["type_send"] = this.type_send;
      }
      ///////////////////////////////////////////////////////////
      if (Boolean(this.is_oprator)) {
        form["step"] = this.step_ref;
      }
      /////////////////////////////////////////////////////////
      if (this.selected_item.length > 0) {
        form["message_ids"] = this.selected_item;
      }

      this.$reqApi("/message/refer", form)
        .then((response) => {
          this.loading = false;
          this.$toast.success(" عملیات با موفقیت انجام شد");
          this.e1 = 1;
          this.relod();
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    closeDialog() {
      this.DialogRefer.show = false;
      this.DialogRefer.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    clearAll() {
      this.step_ref = "";
      this.type_send = "";
      this.$emit("clearBox", true);
    },
  },
  watch: {
    type_send() {
      if (
        Boolean(this.is_superviser) &&
        (this.step_ref == "supervisor_to_operator" ||
          this.step_ref == "operator_to_supervisor") &&
        this.type_send == "multi"
      ) {
        this.$emit("setHeaders", true);
      }
      if (this.type_send == "close" || this.type_send == "multi") {
        this.$emit("setHeaders", true);
      } else {
        this.$emit("setHeaders", false);
      }
    },
    step_ref() {
      if (
        this.step_ref == "supervisor_to_manager" ||
        this.step_ref == "operator_to_supervisor"
      ) {
        this.$emit("setHeaders", true);
      } else {
        this.$emit("setHeaders", false);
      }
    },
  },
  computed: {
    chek_number_step() {
      let check = false;
      if (
        this.is_admin_call_center &&
        (this.type_send == "auto" || this.type_send == "sale")
      ) {
        check = true;
      }
      if (this.is_superviser && (this.type_send == "auto" || this.type_send == "sale")) {
        check = true;
      }
      return check;
    },
    show_type_send() {
      let check = false;
      if (this.is_admin_call_center) {
        check = true;
      }
      if (this.is_superviser) {
        if (this.step_ref == "supervisor_to_operator") {
          check = true;
        }
      }
      return check;
    },
    check_steps() {
      let show_step = false;
      if (this.is_admin_call_center && this.type_send == "multi") {
        show_step = true;
      }
      if (this.is_superviser) {
        if (
          (this.step_ref == "supervisor_to_operator" && this.type_send == "multi") 
        ) {
          show_step = true;
        }
      }
      return show_step;
    },
    back_ref() {
      let check = false;
      if (this.is_superviser) {
        if (this.step_ref == "supervisor_to_manager") {
          check = true;
        }
      }
      if (this.is_admin_call_center && this.type_send == "close") {
        check = true;
      }
      if (this.is_oprator) {
        if (this.step_ref == "operator_to_supervisor") {
          check = true;
        }
      }
      return check;
    },
  },
};
</script>

<style></style>

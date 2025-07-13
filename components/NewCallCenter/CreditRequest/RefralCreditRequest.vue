<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="420">
      <v-card class="pa-3" style="overflow: hidden !important">
        <v-banner class="mx-4">
          <h1 class="font_15">روند ارجاع</h1>
        </v-banner>
        <v-form v-model="valid">
          <v-col cols="12">
            <amp-select
              v-model="form.step"
              rules="require"
              :items="step_items"
              text="مرحله را انتخاب کنید"
            />
            <UserSelectForm
              v-if="show_select_user"
              :text="select_user_title"
              v-model="user"
              :url="url"
              rules="require"
            />
            <amp-textarea
              text="توضیحات"
              v-model="form.message"
              rules="require"
            />
          </v-col>
        </v-form>
        <v-row class="d-flex justify-center mb-1">
          <v-col cols="12" md="3">
            <amp-button
              text="تایید"
              height="38"
              block
              color="teal darken-2"
              @click="submit"
              class="ma-1"
              :loading="loading"
              :disabled="loading || !valid"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-button
              text="انصراف"
              height="38"
              block
              color="red darken-2"
              @click="closeDialog"
              class="ma-1"
            />
          </v-col>
        </v-row>
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
    dialog: { default: false, require: false },
    modelId: { default: false, require: false },
  },
  data() {
    return {
      valid: false,
      loading: false,
      show_select_user: false,
      select_user_title: "",
      user: [],
      url: "user/list-employee",
      form: {
        id: "",
        step: "",
        message: "",
      },
    };
  },
  computed: {
    step_items() {
      const steps = this.$store.state.static.step_credit_request;
      let available_steps = [];
      if (
        this.$checkRole(
          this.$store.state.auth.role.representative_affairs_manager
        )
      ) {
        available_steps = steps.filter(
          (x) =>
            x.value == "representative_affairs_manager_to_fiscal_manager" ||
            x.value == "cancel"
        );
      }
      if (this.$checkRole(this.$store.state.auth.role.manager_financial_unit)) {
        available_steps = steps.filter(
          (x) =>
            x.value == "fiscal_manager_to_supervisor" ||
            x.value == "fiscal_manager_to_representative_affairs_manager"
        );
      }

      if (this.$checkRole(this.$store.state.auth.role.fiscal_supervisor)) {
        available_steps = steps.filter(
          (x) =>
            x.value == "fiscal_supervisor_to_manager" ||
            x.value == "fiscal_supervisor_to_fiscal"
        );
      }
      if (this.$checkRole(this.$store.state.auth.role.fiscal)) {
        available_steps = steps.filter(
          (x) =>
            x.value == "fiscal_to_fiscal_supervisor" ||
            x.value == "accept_fiscal"
        );
      }
      return available_steps;
    },
  },
  watch: {
    "form.step"() {
      switch (this.form.step) {
        case "fiscal_manager_to_supervisor":
          this.show_select_user = true;
          this.select_user_title = "سرپرست مورد نظر را انتخاب کنید";
          break;
        case "fiscal_supervisor_to_fiscal":
          this.show_select_user = true;
          this.select_user_title = "واحد مالی مورد نظر را انتخاب کنید";
          break;

        default:
          this.show_select_user = false;
          this.user = [];
          this.select_user_title = "";
          break;
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.id = this.modelId;
      if (this.user.length > 0) {
        form["user_refer_id"] = this.user[0].id;
      }
      this.$reqApi("credit-request/referral", form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.closeDialog();
          this.$emit("reload");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

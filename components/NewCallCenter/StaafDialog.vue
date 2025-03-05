<template>
  <div>
    <v-dialog
      persistent
      v-model="DialogStaff.show"
      :model-id="DialogStaff.items"
      width="500"
    >
      <v-card class="pa-4">
        <v-row class="mx-2 mt-1 align-center">
          <h1 v-text="check_role" class="font_15 mr-2"></h1>
          <v-spacer></v-spacer>
          <v-icon class="mr-3"> add_circle </v-icon>
          <v-col cols="12 " class="mt-0">
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="submit()">
            <v-row>
              <v-col cols="12" md="12">
                <amp-select
                  v-if="$checkRole(this.$store.state.auth.role.agency_manager)"
                  text="نقش"
                  v-model="role_id"
                  :items="roles"
                  rules="require"
                />

                <amp-input
                  text="نام"
                  v-model="form.first_name"
                  rules="require"
                />
                <amp-input
                  text="نام خانوادگی"
                  v-model="form.last_name"
                  rules="require"
                />
                <amp-input
                  class="ltr-item"
                  text=" شماره همراه "
                  rules="phone,require"
                  v-model="form.username"
                />
                <amp-input
                  type="password"
                  class="ltr-item"
                  text="رمز عبور"
                  rules="require,password"
                  v-model="form.password"
                />
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center">
              <v-col cols="12" md="4">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  type="submit"
                  class="ma-1"
                  :loading="loading"
                  :disabled="loading || !valid"
                />
              </v-col>
              <v-col cols="12" md="4">
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
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    DialogStaff: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    role_id: "",
    roles: [],
    loading: false,
    form: {
      username: "",
      last_name: "",
      first_name: "",
      password: "",
      role_id: [],
    },
  }),
  beforeMount() {
    this.roles = [
      { text: "  انبار دار  ", value: this.$store.state.auth.role.storekeeper },
      { text: "صندوق دار", value: this.$store.state.auth.role.cashier_id },
    ];
  },
  computed: {
    check_role() {
      let dialog_title = "";
      if (this.$checkRole(this.$store.state.auth.role.manager_financial_unit)) {
        dialog_title = "ایجاد سرپرست واحد مالی";
        this.form.role_id.push(this.$store.state.auth.role.head_financial_unit);
      }
      if (this.$checkRole(this.$store.state.auth.role.head_financial_unit)) {
        dialog_title = "ایجاد  واحد مالی";
        this.form.role_id.push(this.$store.state.auth.role.financial_unit_id);
      }
      if (this.$checkRole(this.$store.state.auth.role.sales_manager)) {
        dialog_title = "ایجاد کارشناس فروش";
        this.form.role_id.push(this.$store.state.auth.role.sales_expert);
      }

      if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
        dialog_title = "ایجاد مرکز تماس";
        this.form.role_id.push(this.$store.state.auth.role.superviser_id);
      }
      if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
        dialog_title = "ایجاد اپراتور مرکز تماس";
        this.form.role_id.push(this.$store.state.auth.role.oprator_id);
      }
      if (this.$checkRole(this.$store.state.auth.role.coordinating_manager)) {
        dialog_title = "ایجاد سرپرست هماهنگ کننده";
        this.form.role_id.push(
          this.$store.state.auth.role.supervisor_coordinator
        );
      }
      if (
        this.$checkRole(this.$store.state.auth.role.superviser_centeral_stock)
      ) {
        dialog_title = "ایجاد کارمند انبار";
        this.form.role_id.push(this.$store.state.auth.role.store_employee);
      }
      if (this.$checkRole(this.$store.state.auth.role.supervisor_coordinator)) {
        dialog_title = "ایجاد هماهنگ کننده";
        this.form.role_id.push(this.$store.state.auth.role.coordinator_id);
      }
      if (
        this.$checkRole(
          this.$store.state.auth.role.delivery_coordination_manager
        )
      ) {
        dialog_title = " ایجاد سرپرست هماهنگ کننده ارسال";
        this.form.role_id.push(
          this.$store.state.auth.role.delivery_coordination_supervisor
        );
      }
      if (
        this.$checkRole(
          this.$store.state.auth.role.delivery_coordination_supervisor
        )
      ) {
        dialog_title = " ایجاد  هماهنگ کننده ارسال";
        this.form.role_id.push(
          this.$store.state.auth.role.delivery_coordination
        );
      }
      // if (this.$checkRole(this.$store.state.auth.role.agency_manager)) {
      //   dialog_title = " ایجاد  انبار دار ";
      //   this.form.role_id.push(this.$store.state.auth.role.storekeeper);
      // }
      if (this.$checkRole(this.$store.state.auth.role.storekeeper)) {
        dialog_title = " ایجاد  کارمند ";
        this.form.role_id.push(this.$store.state.auth.role.agency_employee);
      }
      if (this.$checkRole(this.$store.state.auth.role.agency_employee)) {
        dialog_title = " ایجاد  پیک ";
        this.form.role_id.push(this.$store.state.auth.role.courier);
      }
      if (
        this.$checkRole(this.$store.state.auth.role.human_resources_manager)
      ) {
        dialog_title = " ایجاد  سرپرست منابع انسانی ";
        this.form.role_id.push(
          this.$store.state.auth.role.human_resources_supervisor
        );
      }

      if (
        this.$checkRole(this.$store.state.auth.role.human_resources_supervisor)
      ) {
        dialog_title = " ایجاد    کارشناس استخدام ";
        this.form.role_id.push(
          this.$store.state.auth.role.human_resources_expert
        );
      }

      if (
        this.$checkRole(
          this.$store.state.auth.role.representative_affairs_manager
        )
      ) {
        dialog_title = " ایجاد  سرپرست  امور نمایندگان ";
        this.form.role_id.push(
          this.$store.state.auth.role.representative_affairs_supervisor
        );
      }

      if (
        this.$checkRole(
          this.$store.state.auth.role.representative_affairs_supervisor
        )
      ) {
        dialog_title = " ایجاد    کارشناس امور نمایندگان ";
        this.form.role_id.push(
          this.$store.state.auth.role.representative_affairs_expert
        );
      }

      return dialog_title;
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (
        Boolean(this.role_id) &&
        Boolean(this.$checkRole(this.$store.state.auth.role.agency_manager))
      ) {
        form.role_id.push(this.role_id);
        if (this.$store.state.auth.role.cashier_id == this.role_id) {
          form["sale_agency_id"] = this.$store.state.auth.user.sale_agency_id;
        }
      }
      form["person_type"] = "real";
      let url = "user/inser-employee";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("کاربر با موفقیت ایجاد شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.DialogStaff.show = false;
      this.DialogStaff.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

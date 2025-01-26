<template>
  <v-dialog v-model="dialog" width="430" persistent>
    <v-card :disabled="loading" class="pa-4 py-6">
      <div class="pt-2" style="border: 7px double #8585858a">
        <v-col cols="12" class="text-center">
          <h1 class="font_16">
            برسی روند ارجاع (
            <small>
              تعداد محصولات
              {{ data.return_factory_items.length }} </small
            >)
          </h1>
          <h1>
            <small>
              مجموع قیمت
              {{ $price(data.total_price) }} ریال
            </small>
            <br />
            <small class="grey--text" style="border-bottom: 1px solid #8585858a">
              شماره فاکتور
              {{ data.factor_number }}
            </small>
          </h1>
        </v-col>
        <v-col cols="12" class="mt-5 pa-0">
          <amp-select
            placeholder=" مرحله را انتخاب کنید"
            v-model="form.step"
            :items="step_items"
            :disabled="step_items.length == 1"
          />
          <amp-autocomplete
            class="mt-2"
            v-if="show_select_user"
            v-model="user_id"
            :placeholder="select_user_title"
            :items="user_list"
          />
          <amp-textarea label="توضیحات" v-model="form.message" />
        </v-col>
        <v-row class="d-flex justify-center mt-3 mb-3">
          <v-col cols="12" md="3">
            <amp-button
              text="تایید"
              height="38"
              block
              color="teal darken-2"
              @click="submit"
              class="ma-1"
              :loading="loading"
              :disabled="!Boolean(form.step) || !Boolean(form.message)"
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
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    data: {
      default: {},
    },
    dialog: {
      default: false,
    },
  },
  data: () => ({
    valid: true,
    loading: false,
    show_select_user: false,
    select_user_title: "",
    user_id: "",
    url: "",
    step_items: [],
    user_list: [],
    form: { step: "", message: "" },
  }),
  mounted() {
    this.checkRole();
  },
  watch: {
    "form.step"() {
      if (this.form.step == "agency_manager_to_sefir") {
        this.getUsers("user/sefir");
        this.select_user_title = "سفیر مورد نظر را انتخاب کنید";
        this.show_select_user = true;
      }
      if (this.form.step == "storage_manager_to_employee") {
        this.getUsers("user/list-employee");
        this.show_select_user = true;
        this.select_user_title = "کارمند مورد نظر را انتخاب کنید";
      }
      if (this.form.step == "manager_to_supervisor_financial") {
        this.getUsers("user/list-employee");
        this.select_user_title = "سرپرست مورد نظر را انتخاب کنید";
        this.show_select_user = true;
      }
      if (this.form.step == "supervisor_to_financial") {
        this.getUsers("user/list-employee");
        this.select_user_title = "واحد مالی مورد نظر را انتخاب کنید";
        this.show_select_user = true;
      }
    },
  },
  methods: {
    checkRole() {
      if (Boolean(this.$checkRole(this.$store.state.auth.role.agency_manager))) {
        this.setStepItems("agency_manager");
      }
      if (Boolean(this.$checkRole(this.$store.state.auth.role.sefir))) {
        this.setStepItems("sefir");
      }
      if (
        Boolean(this.$checkRole(this.$store.state.auth.role.superviser_centeral_stock))
      ) {
        this.setStepItems("storage_manager");
      }
      if (Boolean(this.$checkRole(this.$store.state.auth.role.store_employee))) {
        this.setStepItems("storage_employee");
      }
      if (Boolean(this.$checkRole(this.$store.state.auth.role.manager_financial_unit))) {
        this.setStepItems("manager_financial");
      }
      if (Boolean(this.$checkRole(this.$store.state.auth.role.fiscal_supervisor))) {
        this.setStepItems("supervisor");
      }
      if (Boolean(this.$checkRole(this.$store.state.auth.role.financial_unit_id))) {
        this.setStepItems("financial");
      }
    },
    setStepItems(key) {
      let items = [...this.$store.state.static.step_reterned_product];
      let data = [];
      data = items.filter((x) => x.key == key);
      if (Boolean(data) && data.length > 0) {
        this.step_items = data;
        if (this.step_items.length == 1) {
          setTimeout(() => {
            this.form.step = this.step_items[0].value;
          }, 111);
        }
      }
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form["id"] = this.data.id;

      if (
        form.step == "storage_manager_to_employee" ||
        form.step == "supervisor_to_financial" ||
        form.step == "agency_manager_to_sefir" ||
        form.step == "manager_to_supervisor_financial"
      ) {
        if (!Boolean(this.user_id)) {
          this.$toast.error("انتخاب کاربر اجباریست");
          this.loading = false;
          return;
        }
        form["user_refer_id"] = this.user_id;
      }

      this.$reqApi("return-factory/referral", form)
        .then((res) => {
          this.loading = false;
          this.$emit("reload");
          this.closeDialog();
          this.$toast.success("عملیات با موفقیت انجام شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getUsers(url) {
      this.loading = true;
      this.$reqApi(url)
        .then((res) => {
          let items = [];
          for (let i = 0; i < res.model.data.length; i++) {
            const x = res.model.data[i];
            let user =
              Boolean(x.first_name) && Boolean(x.last_name)
                ? x.first_name + " " + x.last_name + " | " + x.username
                : x.username;
            items.push({
              text: user,
              value: x.id,
            });
          }
          this.user_list = items;

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

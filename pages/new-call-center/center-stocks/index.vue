<template>
  <v-row class="pa-4">
    <v-col cols="12" md="12">
      <BaseTable
        :extraBtn="extra_btn"
        url="/center-stock"
        :headers="headers"
        createUrl="/new-call-center/center-stocks/insert"
        :filters="filters"
        :autoLoad="false"
        autoUpdate="/new-call-center/center-stocks"
        :BTNactions="btn_actions"
        autoDelete="/center-stock/delete"
      />
    </v-col>
    <Dialog
      :branchId="id"
      :dialog="show_dialog"
      v-if="show_dialog"
      @closeDialog="closeDialog"
    />  
    
      <VarComExcel
      :dialog="varcome_excel"
      v-if="varcome_excel"
      url-list="/center-stock"
      @closeDialog="closeDialog"
    />
    <v-dialog
      v-model="tipax_dialog"
      persistent
      max-width="720px"
    >
      <v-card>
        <v-progress-linear
          v-if="tipax_loading || tipax_submit_loading"
          color="primary"
          height="2"
          indeterminate
        />
        <v-card-title class="d-flex align-center">
          <span>{{ tipax_dialog_title || "تنظیمات تیپاکس" }}</span>
          <v-spacer />
          <v-icon @click="closeTipaxDialog">close</v-icon>
        </v-card-title>
        <v-card-text>
          <div v-if="tipax_loading" class="text-center py-6">
            <v-progress-circular indeterminate color="primary" />
          </div>
      <v-form
        v-else
        ref="tipaxForm"
        v-model="tipax_form_valid"
        lazy-validation
      >
        <v-row dense>
          <v-col cols="12">
            <amp-autocomplete
              text="شهر"
              :items="tipax_cities"
              v-model="tipax_form.cityId"
              rules="require"
              :loading="tipax_cities_loading"
            />
          </v-col>
          <v-col cols="12">
            <amp-textarea
              text="آدرس کامل"
              rows="2"
              v-model="tipax_form.fullAddress"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="طبقه"
              v-model="tipax_form.floor"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="واحد"
              v-model="tipax_form.unit"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="کد پستی"
              v-model="tipax_form.postalCode"
              rules="require"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="پلاک"
              v-model="tipax_form.no"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="شماره تلفن"
              v-model="tipax_form.phone"
              rules="require"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="نام و نام خانوادگی"
              v-model="tipax_form.fullName"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="تلفن جایگزین"
              v-model="tipax_form.mobile"
              rules="require"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="عرض جغرافیایی (lat)"
              v-model="tipax_form.lat"
              cClass="ltr-item"
              rules="number_float"
            />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input
              text="طول جغرافیایی (long)"
              v-model="tipax_form.long"
              cClass="ltr-item"
              rules="number_float"
            />
          </v-col>
          <v-col cols="12" v-if="showTipaxMapSelector">
            <SelectLocationDialog
              v-model="tipax_location"
              :disabled="false"
            />
          </v-col>
        </v-row>
      </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <amp-button
            text="انصراف"
            color="red"
            :disabled="tipax_submit_loading"
            @click="closeTipaxDialog"
          />
          <amp-button
            text="ذخیره"
            color="primary"
            :loading="tipax_submit_loading"
            :disabled="tipax_submit_loading || tipax_loading"
            @click="submitTipaxConfig"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Dialog from "@/components/Product/Representative/Dialog.vue";
import VarComExcel from "@/components/Product/VarComExcel.vue";

const createTipaxConfigForm = () => ({
  id: null,
  cityId: null,
  fullAddress: "",
  floor: "",
  unit: "",
  postalCode: "",
  no: "",
  phone: "",
  fullName: "",
  mobile: "",
  lat: "",
  long: "",
});

export default {
  components: { Dialog , VarComExcel, SelectLocationDialog: () => import("@/components/Base/SelectLocationDialog.vue") },
  data: () => ({
    headers: [],
    extra_btn: [],
    items: [],
    filters: {},
    btn_actions: [],
    title: "انبار مرکزی",
    id: "",
    show_dialog: false,
    varcome_excel: false,
    tipax_dialog: false,
    tipax_loading: false,
    tipax_submit_loading: false,
    tipax_cities_loading: false,
    tipax_form_valid: false,
    tipax_dialog_title: "",
    tipax_form: createTipaxConfigForm(),
    tipax_cities: [],
    tipax_row_id: null,
    tipax_location: [],
  }),
  computed: {
    showTipaxMapSelector() {
      return !this.tipax_form.lat || !this.tipax_form.long;
    },
  },
  watch: {
    tipax_location(newVal) {
      if (Array.isArray(newVal) && newVal.length >= 2) {
        this.tipax_form.lat = newVal[0] || "";
        this.tipax_form.long = newVal[1] || "";
      }
    },
  },
  beforeMount() {
    this.headers = [
      { text: "نام مدیر", value: "first_name_manager" },
      { text: "نام خانوادگی", value: "last_name_manager" },
      { text: "نام مرکز", value: "name" },
      { text: "کد مرکز", value: "code" },
      { text: "شماره همراه", value: "username_manager" },
      {
        text: " نام شهر",
        value: (body) => {
          if (body.country_division) {
            return body.country_division.name;
          }
        },
      },
      {
        text: "آدرس دقیق",
        filterCol: "address",
        type: "tooltip",
        function: (body) => {
          if (body.address) {
            return body.address;
          }
        },
        value: (body) => {
          if (typeof body.address == "string") {
            if (body.address.length < 20) {
              return body.address;
            }
            return body.address.slice(0, 20) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: " تعریف موجودی ",
        icon: "storefront",
        color: "red",
        fun: (body) => {
          this.id = body.id;
          this.show_dialog = true;
        },
      },
      {
        text: "تنظیمات تیپاکس",
        icon: "local_shipping",
        color: "indigo",
        fun: (body) => this.openTipaxSettings(body),
      },
    ];
    this.extra_btn = [
      {
        text: "ترکیبات محصول",
        icon: "backup",
        color: "teal darken-2",
        fun: (body) => {
          this.varcome_excel = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    closeDialog() {
      this.show_dialog = false;
      this.varcome_excel = false;
    },
    closeTipaxDialog() {
      this.tipax_dialog = false;
      this.resetTipaxDialog();
    },
    resetTipaxDialog() {
      this.tipax_form = createTipaxConfigForm();
      this.tipax_dialog_title = "";
      this.tipax_row_id = null;
      this.tipax_form_valid = false;
      this.tipax_loading = false;
      this.tipax_submit_loading = false;
      this.tipax_cities_loading = false;
      this.tipax_location = [];
      if (this.$refs.tipaxForm && typeof this.$refs.tipaxForm.resetValidation === "function") {
        this.$refs.tipaxForm.resetValidation();
      }
    },
    mapCityItems(list_source) {
      const list = Array.isArray(list_source) ? list_source : [];
      return list.map((item) => ({
        text: item.title || item.name || item.id,
        value: item.id,
      }));
    },
    applyTipaxExtraConfig(extra_config) {
      const defaults = createTipaxConfigForm();
      defaults.id = this.tipax_row_id;
      if (extra_config) {
        try {
          const parsed =
            typeof extra_config === "string"
              ? JSON.parse(extra_config)
              : extra_config;
          if (parsed && typeof parsed === "object") {
            Object.assign(defaults, parsed);
          }
        } catch (error) {
          // keep defaults on parse error
        }
      }
      this.tipax_form = defaults;
      if (defaults.lat && defaults.long) {
        this.tipax_location = [defaults.lat, defaults.long];
      } else {
        this.tipax_location = [];
      }
    },
    async openTipaxSettings(body) {
      if (!body || !body.id) {
        return;
      }
      this.resetTipaxDialog();
      this.tipax_loading = true;
      this.tipax_cities_loading = true;
      try {
        const [detail, cities] = await Promise.all([
          this.$reqApi("center-stock/show", { id: body.id }),
          this.$reqApi("shop/tipax/get-cities", {}),
        ]);
        const detailData = detail?.data || detail || {};
        this.tipax_row_id = detailData.id || body.id;
        this.tipax_dialog_title = detailData.name || "تنظیمات تیپاکس";
        this.tipax_cities = this.mapCityItems(cities);
        this.applyTipaxExtraConfig(detailData.extra_config);
        this.tipax_dialog = true;
      } catch (error) {
        this.$toast.error("خطا در دریافت اطلاعات تنظیمات تیپاکس");
      } finally {
        this.tipax_loading = false;
        this.tipax_cities_loading = false;
      }
    },
    submitTipaxConfig() {
      if (this.tipax_submit_loading) {
        return;
      }
      if (
        this.$refs.tipaxForm &&
        typeof this.$refs.tipaxForm.validate === "function"
      ) {
        const is_valid = this.$refs.tipaxForm.validate();
        if (!is_valid) {
          return;
        }
      }
      this.tipax_submit_loading = true;
      const payload = {
        id: this.tipax_row_id,
        extra_config: JSON.stringify({
          cityId: this.tipax_form.cityId,
          fullAddress: this.tipax_form.fullAddress,
          floor: this.tipax_form.floor,
          unit: this.tipax_form.unit,
          postalCode: this.tipax_form.postalCode,
          no: this.tipax_form.no,
          phone: this.tipax_form.phone,
          fullName: this.tipax_form.fullName,
          mobile: this.tipax_form.mobile,
          lat: this.tipax_form.lat,
          long: this.tipax_form.long,
        }),
      };
      this.$reqApi("center-stock/update-extra-config", payload)
        .then(() => {
          this.$toast.success("تنظیمات تیپاکس ذخیره شد");
          this.closeTipaxDialog();
        })
        .finally(() => {
          this.tipax_submit_loading = false;
        });
    },
  },
};
</script>

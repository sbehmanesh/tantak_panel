<template>
  <v-dialog v-model="dialogProxy" persistent max-width="960px">
    <v-card>
      <v-progress-linear
        v-if="tipax_submit_loading"
        color="primary"
        height="2"
        indeterminate
      />
      <v-card-title class="d-flex align-center">
        <span>ثبت در تیپاکس</span>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="!tipax_has_permission" type="error" dense outlined>
          شما مجاز به ثبت سفارش تیپاکس نیستید.
        </v-alert>
        <template v-else>
          <v-alert
            v-if="tipax_lists_error"
            type="error"
            dense
            outlined
            class="mb-4"
          >
            {{ tipax_lists_error }}
            <amp-button
              small
              class="ml-2"
              color="primary"
              text="تلاش مجدد"
              :loading="tipax_lists_loading"
              @click="fetchTipaxResources"
            />
          </v-alert>
          <div v-if="tipax_lists_loading && !tipax_data_loaded" class="py-6">
            <v-skeleton-loader type="article" />
          </div>
          <v-form
            v-else
            ref="tipaxForm"
            v-model="tipax_form_valid"
            lazy-validation
          >
            <v-row dense>
              <v-col cols="12" md="4">
                <amp-select
                  text="سرویس ارسال"
                  :items="tipax_lists.services"
                  v-model="tipax_form.service_id"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text="نوع پرداخت"
                  :items="tipax_lists.payment_types"
                  v-model="tipax_form.payment_type"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text="روش جمع آوری"
                  :items="tipax_lists.pickup_types"
                  v-model="tipax_form.pickup_type"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text="روش تحویل"
                  :items="tipax_lists.distribution_types"
                  v-model="tipax_form.distribution_type"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text="نوع بسته بندی"
                  :items="tipax_lists.pack_types"
                  v-model="tipax_form.pack_type"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-autocomplete
                  text="بسته بندی انتخابی"
                  :items="filteredPackingOptions"
                  v-model="tipax_form.packing_id"
                  :disabled="!tipax_form.pack_type || !filteredPackingOptions.length"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-autocomplete
                  text="محتوای بسته"
                  :items="filteredPackContentOptions"
                  v-model="tipax_form.package_content_id"
                  :disabled="!tipax_form.pack_type || !filteredPackContentOptions.length"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="ارتفاع بسته (سانتی متر)"
                  v-model="tipax_form.height"
                  rules="required"
                  cClass="ltr-item"
                  is-number
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="عرض بسته (سانتی متر)"
                  v-model="tipax_form.width"
                  rules="required"
                  cClass="ltr-item"
                  is-number
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="طول بسته (سانتی متر)"
                  v-model="tipax_form.length"
                  rules="required"
                  cClass="ltr-item"
                  is-number
                />
              </v-col>
              <v-col cols="12">
                <amp-textarea
                  text="توضیحات اضافی"
                  v-model="tipax_form.description"
                  rows=2
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="font-weight-medium mb-3">اطلاعات مبدا</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <amp-autocomplete
                  text="انبار مرکزی"
                  :items="tipax_lists.center_stocks"
                  v-model="tipax_selected_center_stock"
                  :loading="tipax_lists_loading"
                  clearable
                />
              </v-col>
              <v-col cols="12" v-if="!tipax_selected_center_stock">
                <v-alert type="info" dense outlined class="mb-0">
                  برای مشاهده و ویرایش اطلاعات مبدا، ابتدا انبار مرکزی را انتخاب کنید.
                </v-alert>
              </v-col>
              <v-col cols="12" v-else>
                <v-card outlined>
                  <v-card-title
                    class="py-2 px-3 d-flex align-center"
                    @click="origin_box_open = !origin_box_open"
                    style="cursor: pointer"
                  >
                    <v-icon small class="ml-2">
                      {{ origin_box_open ? "expand_less" : "expand_more" }}
                    </v-icon>
                    <span>جزئیات مبدا</span>
                  </v-card-title>
                  <v-slide-y-transition>
                    <div v-show="origin_box_open" class="px-3 pb-3">
                      <v-row dense>
                        <v-col cols="12" md="4">
                          <amp-autocomplete
                            text="شهر مبدا"
                            :items="tipax_lists.cities"
                            v-model="tipax_form.origin.city_id"
                            rules="require"
                            :loading="tipax_lists_loading"
                            :disabled="isOriginFieldDisabled('city_id')"
                          />
                        </v-col>
                        <v-col cols="12" md="12">
                          <amp-textarea
                            text="آدرس کامل"
                            v-model="tipax_form.origin.full_address"
                            rows=2
                            rules="require"
                            :disabled="isOriginFieldDisabled('full_address')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="طبقه"
                            v-model="tipax_form.origin.floor"
                            is-number
                            rules="require"
                            :disabled="isOriginFieldDisabled('floor')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="واحد"
                            v-model="tipax_form.origin.unit"
                            is-number
                            rules="require"
                            :disabled="isOriginFieldDisabled('unit')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="کد پستی"
                            v-model="tipax_form.origin.postal_code"
                            rules="require"
                            cClass="ltr-item"
                            :disabled="isOriginFieldDisabled('postal_code')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="پلاک"
                            rules="require"
                            v-model="tipax_form.origin.no"
                            :disabled="isOriginFieldDisabled('no')"
                          />
                        </v-col>
                        <v-col cols="12" md="8">
                          <amp-textarea
                            text="توضیحات"
                            v-model="tipax_form.origin.description"
                            rows=2
                            :disabled="isOriginFieldDisabled('description')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="نام و نام خانوادگی"
                            v-model="tipax_form.origin.full_name"
                            rules="require"
                            :disabled="isOriginFieldDisabled('full_name')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="تلفن ثابت"
                            v-model="tipax_form.origin.phone"
                            rules="phone_no_city"
                            cClass="ltr-item"
                            :disabled="isOriginFieldDisabled('phone')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="موبایل"
                            v-model="tipax_form.origin.mobile"
                            rules="mobile"
                            cClass="ltr-item"
                            :disabled="isOriginFieldDisabled('mobile')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="عرض جغرافیایی (lat)"
                            v-model="tipax_form.origin.latitude"
                            cClass="ltr-item"
                            rules="required"
                            is-number
                            :disabled="isOriginFieldDisabled('latitude')"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <amp-input
                            text="طول جغرافیایی (long)"
                            v-model="tipax_form.origin.longitude"
                            cClass="ltr-item"
                            rules="required"
                            is-number
                            :disabled="isOriginFieldDisabled('longitude')"
                          />
                        </v-col>
                      </v-row>
                    </div>
                  </v-slide-y-transition>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <div class="font-weight-medium mb-3">اطلاعات مقصد</div>
            <v-row dense>
              <v-col cols="12" md="4">
                <amp-autocomplete
                  text="شهر مقصد"
                  :items="tipax_lists.cities"
                  v-model="tipax_form.destination.city_id"
                  rules="require"
                  :loading="tipax_lists_loading"
                />
              </v-col>
              <v-col cols="12" md="8">
                <amp-textarea
                  text="آدرس کامل"
                  v-model="tipax_form.destination.full_address"
                  rows=2
                  rules="require"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="طبقه"
                  rules="require"
                  v-model="tipax_form.destination.floor"
                  is-number
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="واحد"
                  rules="require"
                  v-model="tipax_form.destination.unit"
                  is-number
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="کد پستی"
                  v-model="tipax_form.destination.postal_code"
                  rules="require"
                  cClass="ltr-item"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="پلاک"
                  rules="require"
                  v-model="tipax_form.destination.no"
                />
              </v-col>
              <v-col cols="12" md="8">
                <amp-textarea
                  text="توضیحات"
                  v-model="tipax_form.destination.description"
                  rows=2
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="نام و نام خانوادگی"
                  v-model="tipax_form.destination.full_name"
                  rules="require"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="تلفن ثابت"
                  v-model="tipax_form.destination.phone"
                  rules="phone_no_city"
                  cClass="ltr-item"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="موبایل"
                  v-model="tipax_form.destination.mobile"
                  rules="mobile"
                  cClass="ltr-item"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="عرض جغرافیایی (lat)"
                  v-model="tipax_form.destination.latitude"
                  cClass="ltr-item"
                  rules="required"
                  is-number
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="طول جغرافیایی (long)"
                  v-model="tipax_form.destination.longitude"
                  rules="required"
                  cClass="ltr-item"
                  is-number
                />
              </v-col>
              <v-col cols="12" md="4" v-if="showDestinationMapSelector">
                <SelectLocationDialog
                  v-model="destination_map_location"
                  :disabled="false"
                />
              </v-col>
            </v-row>
          </v-form>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <amp-button
          text="انصراف"
          color="red"
          :disabled="tipax_submit_loading"
          @click="closeDialog"
        />
        <amp-button
          v-if="tipax_has_permission"
          text="ثبت در تیپاکس"
          color="primary"
          :loading="tipax_submit_loading"
          :disabled="tipax_submit_disabled"
          @click="submitTipaxForm"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const TIPAX_PERMISSION = "basket/insert_order_tipax";
const TIPAX_USER_PREFS_KEY = "tipax_user_defaults";

const createAddressModel = () => ({
  city_id: null,
  full_address: "",
  floor: "",
  unit: "",
  postal_code: "",
  no: "",
  description: "",
  phone: "",
  full_name: "",
  mobile: "",
  latitude: "",
  longitude: "",
});

const createTipaxForm = () => ({
  basket_id: null,
  service_id: null,
  payment_type: null,
  pickup_type: null,
  distribution_type: null,
  pack_type: null,
  packing_id: null,
  package_content_id: null,
  description: "",
  length: 20,
  width: 20,
  height: 20,
  origin: createAddressModel(),
  destination: createAddressModel(),
});

export default {
  name: "TipaxDialog",
  components: {
    SelectLocationDialog: () =>
      import("@/components/Base/SelectLocationDialog.vue"),
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    basketRow: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    tipax_form_valid: false,
    tipax_submit_loading: false,
    tipax_lists_loading: false,
    tipax_lists_error: null,
    tipax_data_loaded: false,
    tipax_form: createTipaxForm(),
    tipax_selected_center_stock: null,
    tipax_origin_disabled_fields: {},
    origin_box_open: false,
    destination_map_location: [],
    tipax_lists: {
      cities: [],
      services: [],
      payment_types: [],
      pickup_types: [],
      distribution_types: [],
      pack_types: [],
      packing_items: [],
      pack_content_items: [],
      center_stocks: [],
    },
  }),
  computed: {
    dialogProxy: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    tipax_has_permission() {
      if (typeof this.$checkAccess === "function") {
        return this.$checkAccess(TIPAX_PERMISSION);
      }
      return false;
    },
    filteredPackingOptions() {
      if (!this.tipax_form.pack_type) {
        return [];
      }
      return this.tipax_lists.packing_items
        .filter(
          (item) => String(item.pack_type) === String(this.tipax_form.pack_type)
        )
        .map((item) => ({ text: item.text, value: item.value }));
    },
    filteredPackContentOptions() {
      if (!this.tipax_form.pack_type) {
        return [];
      }
      return this.tipax_lists.pack_content_items
        .filter(
          (item) => String(item.pack_type) === String(this.tipax_form.pack_type)
        )
        .map((item) => ({ text: item.text, value: item.value }));
    },
    tipax_submit_disabled() {
      return (
        this.tipax_submit_loading ||
        this.tipax_lists_loading ||
        !this.tipax_form_valid ||
        !this.tipax_data_loaded
      );
    },
    showDestinationMapSelector() {
      return (
        !this.tipax_form.destination.latitude ||
        !this.tipax_form.destination.longitude
      );
    },
  },
  watch: {
    value(new_value) {
      if (new_value) {
        this.tipax_form.basket_id = this.basketRow?.id || null;
        this.populateDestinationFromBasket(this.basketRow);
        this.applyUserTipaxPreferences();
        if (this.tipax_has_permission) {
          this.ensureTipaxResources();
        }
      } else {
        this.resetDialog();
      }
    },
    basketRow: {
      handler(new_value) {
        if (new_value) {
          this.tipax_form.basket_id = new_value.id || null;
          this.populateDestinationFromBasket(new_value);
          this.applyUserTipaxPreferences();
        }
      },
      deep: true,
    },
    "tipax_form.pack_type"() {
      this.tipax_form.packing_id = null;
      this.tipax_form.package_content_id = null;
    },
    tipax_selected_center_stock(new_value) {
      this.applyCenterStockSelection(new_value);
      this.origin_box_open = false;
    },
    destination_map_location(new_value) {
      if (Array.isArray(new_value) && new_value.length >= 2) {
        this.tipax_form.destination.latitude = new_value[0] || "";
        this.tipax_form.destination.longitude = new_value[1] || "";
      }
    },
  },
  methods: {
    closeDialog() {
      this.dialogProxy = false;
    },
    resetDialog() {
      this.tipax_form = createTipaxForm();
      this.tipax_form_valid = false;
      this.tipax_submit_loading = false;
      this.tipax_lists_error = null;
      this.tipax_selected_center_stock = null;
      this.tipax_origin_disabled_fields = {};
      this.origin_box_open = false;
      this.destination_map_location = [];
      if (this.$refs.tipaxForm && typeof this.$refs.tipaxForm.resetValidation === "function") {
        this.$refs.tipaxForm.resetValidation();
      }
    },
    ensureTipaxResources() {
      if (this.tipax_data_loaded || this.tipax_lists_loading) {
        return;
      }
      this.fetchTipaxResources();
    },
    async fetchTipaxResources() {
      this.tipax_lists_loading = true;
      this.tipax_lists_error = null;
      try {
        const [
          cities,
          services,
        payment_types,
        pickup_types,
        distribution_types,
        pack_types,
        packing_items,
        pack_content_items,
        center_stocks,
      ] = await Promise.all([
        this.$reqApi("shop/tipax/get-cities", {}),
        this.$reqApi("shop/tipax/list-service", {}),
        this.$reqApi("shop/tipax/list-payment-type", {}),
        this.$reqApi("shop/tipax/list-pickup-type", {}),
        this.$reqApi("shop/tipax/list-distribution-type", {}),
        this.$reqApi("shop/tipax/get-pack-type", {}),
        this.$reqApi("shop/tipax/list-packing", {}),
        this.$reqApi("shop/tipax/list-pack-content", {}),
        this.$reqApi("center-stock/limited", {}),
      ]);

        this.tipax_lists.cities = this.mapCityItems(cities);
        this.tipax_lists.services = this.mapToSelectItems(services);
        this.tipax_lists.payment_types = this.mapToSelectItems(payment_types);
        this.tipax_lists.pickup_types = this.mapToSelectItems(pickup_types);
        this.tipax_lists.distribution_types = this.mapToSelectItems(
          distribution_types
        );
        this.tipax_lists.pack_types = this.mapToSelectItems(pack_types?.data);
        this.tipax_lists.packing_items = this.mapPackingItems(
          packing_items?.result
        );
        this.tipax_lists.pack_content_items = this.mapPackContentItems(
          pack_content_items?.result
        );
        this.tipax_lists.center_stocks = this.mapCenterStockItems(
          center_stocks?.model?.data || center_stocks?.data || center_stocks
        );
        this.tipax_data_loaded = true;
      } catch (error) {
        this.tipax_lists_error = "خطا در دریافت اطلاعات تیپاکس";
      } finally {
        this.tipax_lists_loading = false;
      }
    },
    mapToSelectItems(list_source) {
      const list = Array.isArray(list_source) ? list_source : [];
      return list.map((item) => ({
        text: item.title || item.name || item.text || item.id,
        value: item.id ?? item.value ?? null,
      }));
    },
    mapCityItems(list_source) {
      const list = Array.isArray(list_source) ? list_source : [];
      return list.map((item) => ({
        text: item.title || item.name || item.id,
        value: item.id,
      }));
    },
    mapCenterStockItems(list_source) {
      const list = Array.isArray(list_source) ? list_source : [];
      return list.map((item) => ({
        text: item.name || item.title || item.id,
        value: item.id,
        extra_config: item.extra_config ?? null,
      }));
    },
    mapPackingItems(list_source) {
      const list = Array.isArray(list_source) ? list_source : [];
      return list.map((item) => ({
        text: item.title || item.id,
        value: item.id,
        pack_type: item.packType,
      }));
    },
    mapPackContentItems(list_source) {
      const list = Array.isArray(list_source) ? list_source : [];
      return list.map((item) => ({
        text: item.title || item.id,
        value: item.id,
        pack_type: item.packType,
      }));
    },
    extractOriginFromExtraConfig(extra_config) {
      const origin = createAddressModel();
      const disabledFields = {};
      if (!extra_config) {
        return { origin, disabledFields };
      }
      let parsedConfig = extra_config;
      if (typeof extra_config === "string") {
        try {
          parsedConfig = JSON.parse(extra_config);
        } catch (error) {
          parsedConfig = null;
        }
      }
      if (parsedConfig && typeof parsedConfig === "object") {
        const mapping = {
          city_id: "cityId",
          full_address: "fullAddress",
          floor: "floor",
          unit: "unit",
          postal_code: "postalCode",
          no: "no",
          description: "description",
          phone: "phone",
          full_name: "fullName",
          mobile: "mobile",
          latitude: "lat",
          longitude: "long",
        };
        Object.keys(mapping).forEach((targetKey) => {
          const sourceKey = mapping[targetKey];
          const value =
            parsedConfig[sourceKey] !== undefined
              ? parsedConfig[sourceKey]
              : parsedConfig[targetKey] ?? parsedConfig[sourceKey === "long" ? "lng" : targetKey];
          if (value !== undefined && value !== null && value !== "") {
            origin[targetKey] = value;
            disabledFields[targetKey] = true;
          }
        });
      }
      return { origin, disabledFields };
    },
    applyCenterStockSelection(center_stock_id) {
      if (!center_stock_id) {
        this.tipax_form.origin = createAddressModel();
        this.tipax_origin_disabled_fields = {};
        return;
      }
      const selected = this.tipax_lists.center_stocks.find(
        (item) => String(item.value) === String(center_stock_id)
      );
      if (!selected) {
        this.tipax_form.origin = createAddressModel();
        this.tipax_origin_disabled_fields = {};
        return;
      }
      const { origin, disabledFields } = this.extractOriginFromExtraConfig(
        selected.extra_config
      );
      this.tipax_form.origin = origin;
      this.tipax_origin_disabled_fields = disabledFields;
    },
    isOriginFieldDisabled(field_key) {
      return Boolean(this.tipax_origin_disabled_fields[field_key]);
    },
    populateDestinationFromBasket(basket_row) {
      if (!basket_row || !basket_row.data || !basket_row.data.delivery_info) {
        this.tipax_form.destination = createAddressModel();
        this.destination_map_location = [];
        return;
      }
      const delivery = basket_row.data.delivery_info || {};
      const destination = createAddressModel();
      destination.full_address = delivery.address || "";
      destination.postal_code = delivery.postal_code || "";
      const fullName = `${delivery.first_name || ""} ${delivery.last_name || ""}`.trim();
      destination.full_name = fullName;
      destination.phone = delivery.phone_number || "";
      destination.mobile = delivery.phone_number || "";
      destination.description = delivery.delivery_time || "";
      const basketLat =
        delivery.lat ||
        delivery.latitude ||
        delivery.location_lat ||
        delivery.locationLat ||
        delivery.location?.lat ||
        delivery.location?.latitude;
      const basketLong =
        delivery.long ||
        delivery.lng ||
        delivery.longitude ||
        delivery.location_long ||
        delivery.locationLong ||
        delivery.location?.long ||
        delivery.location?.lng ||
        delivery.location?.longitude;
      destination.latitude = basketLat || "";
      destination.longitude = basketLong || "";
      
      destination.city_id = delivery.country_division_id || "";
      destination.floor = delivery.floor || "";
      destination.unit = delivery.unit || "";
      destination.no = delivery.no || "";

      if (basketLat && basketLong) {
        this.destination_map_location = [basketLat, basketLong];
      } else {
        this.destination_map_location = [];
      }
      this.tipax_form.destination = destination;
    },
    submitTipaxForm() {
      if (!this.tipax_has_permission) {
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
      const payload = this.buildTipaxPayload();
      this.$reqApi("tipax/insert-order", payload)
        .then(() => {
          this.$toast.success("درخواست با موفقیت ثبت شد");
          this.saveUserTipaxPreferences();
          this.closeDialog();
          this.$emit('submited',true)
        })
        .finally(() => {
          this.tipax_submit_loading = false;
        });
    },
    buildTipaxPayload() {
      return {
        basket_id: this.tipax_form.basket_id,
        origin: [this.buildAddressPayload(this.tipax_form.origin)],
        destination: [this.buildAddressPayload(this.tipax_form.destination)],
        description: this.tipax_form.description,
        serviceId: this.tipax_form.service_id,
        paymentType: this.tipax_form.payment_type,
        pickupType: this.tipax_form.pickup_type,
        distributionType: this.tipax_form.distribution_type,
        length: this.tipax_form.length,
        height: this.tipax_form.height,
        width: this.tipax_form.width,
        packType: this.tipax_form.pack_type,
        packingId: this.tipax_form.packing_id,
        packageContentId: this.tipax_form.package_content_id,
      };
    },
    buildAddressPayload(address) {
      return {
        cityId: address.city_id,
        fullAddress: address.full_address,
        floor: address.floor,
        unit: address.unit,
        postalCode: address.postal_code,
        no: address.no,
        description: address.description,
        phone: address.phone,
        fullName: address.full_name,
        mobile: address.mobile,
        latitude: address.latitude,
        longitude: address.longitude,
      };
    },
    saveUserTipaxPreferences() {
      try {
        const prefs = {
          service_id: this.tipax_form.service_id,
          payment_type: this.tipax_form.payment_type,
          pickup_type: this.tipax_form.pickup_type,
          distribution_type: this.tipax_form.distribution_type,
        };
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(TIPAX_USER_PREFS_KEY, JSON.stringify(prefs));
        }
      } catch (error) {
        // ignore localStorage errors
      }
    },
    applyUserTipaxPreferences() {
      try {
        if (typeof localStorage === "undefined") {
          return;
        }
        const saved = localStorage.getItem(TIPAX_USER_PREFS_KEY);
        if (!saved) {
          return;
        }
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          this.tipax_form.service_id = parsed.service_id ?? this.tipax_form.service_id;
          this.tipax_form.payment_type = parsed.payment_type ?? this.tipax_form.payment_type;
          this.tipax_form.pickup_type = parsed.pickup_type ?? this.tipax_form.pickup_type;
          this.tipax_form.distribution_type =
            parsed.distribution_type ?? this.tipax_form.distribution_type;
        }
      } catch (error) {
        // ignore parse/storage errors
      }
    },
  },
};
</script>

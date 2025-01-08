<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row class="justify-center mb-5 align-top">
        <v-col cols="12" md="6">
          <v-card class="elevation-0 pa-5">
            <v-row dense>
              <v-col cols="12" md="4">
                <amp-input text="عنوان" v-model="form.title" rules="require" />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text=" وضعیت"
                  rules="require"
                  v-model="form.status"
                  :items="$store.state.static.status"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text=" نوع تخفیف"
                  rules="require"
                  v-model="form.type_discount"
                  :items="$store.state.static.discount_type"
                />
              </v-col>

              <v-col cols="12" md="4">
                <amp-jdate
                  text="تاریخ شروع "
                  :is-number="true"
                  rules="require"
                  v-model="form.start_at"
                  :min="now"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-jdate
                  text="تاریخ پایان"
                  rules="require"
                  :is-number="true"
                  v-model="form.end_at"
                />
              </v-col>

              <v-col cols="12" md="4">
                <amp-input
                  v-if="form.type_discount == 'amount'"
                  text="قیمت پس از تخفیف (ریال)"
                  v-model="form.price_off"
                  rules="require"
                  is-price
                />
                <amp-input
                  v-else
                  text="درصد تخفیف"
                  v-model="form.price_off"
                  rules="require,percent"
                />
              </v-col>

              <v-col cols="12" md="4">
                <amp-input
                  text=" سقف تعداد استفاده"
                  v-model="form.max_number"
                  cClass="ltr-item"
                  rules="number"
                />
              </v-col>        
               <v-col cols="12" md="4">
                <amp-input
                  text=" مقدار محدود استفاده هر فرد"
                  v-model="form.limit_use"
                  cClass="ltr-item"
                   rules="number"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="ترتیب"
                  v-model="form.sort"
                  cClass="ltr-item"
                  rules="number"
                />
              </v-col>
              <v-col cols>
                <amp-textarea
                  :rows="3"
                  text="توضیحات"
                  v-model="form.description"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="4 " class="mt-10">
          <v-card class="pa-3 elevation-4 card-style" :disabled="loading">
            <v-row class="justify-center">
              <v-col cols="12" md="12" class="mt-2">
                <amp-autocomplete
                  text="انتخاب محصول"
                  rules="require"
                  v-model="form.product_id"
                  :items="products"
                />
              </v-col>
              <v-col
                cols="12"
                v-if="Boolean(form.product_id) && !load_product"
                class="d-flex align-center ma-0 pa-0 justify-center"
              >
                <img
                  height="110"
                  :src="$getImage(informations_product.main_image)"
                />
                <div class="mr-5">
                  <h1 class="font_12">
                    برند :
                    {{ informations_product.brand.name }}
                  </h1>
                  <v-spacer></v-spacer>
                  <h1 class="font_12">
                    قیمت محصول :
                    {{ $price(informations_product.base_price) }} ریال
                  </h1>
                  <v-spacer></v-spacer>

                  <h1 class="font_12">
                    وزن محصول :
                    {{ informations_product.weight }} گرم
                  </h1>
                </div>
              </v-col>
              <v-col cols="12" class="text-center" v-if="load_product">
                <v-progress-circular
                  indeterminate
                  color="grey"
                ></v-progress-circular>
              </v-col>
              <v-col cols="12" md="12">
                <amp-select
                  text="تخفیف در برای همه "
                  rules="require"
                  v-model="form.off_sale_all"
                  :items="$store.state.static.bool_en"
                />
                <amp-select
                  v-if="form.off_sale_all == 'no'"
                  text="تخفیف در  "
                  v-model="discount_in"
                  multiple
                  :items="discount"
                />
                <amp-autocomplete
                  v-if="form.off_sale_all == 'no'"
                  text="نمایندگی های فروش مجاز به استفاده از تخفیف"
                  v-model="form.sale_agency_ids"
                  multiple
                  :items="agencyes"
                />
              </v-col>
              <v-row> </v-row>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button
            large
            icon="redo"
            class="my-1"
            color="error"
            text="انصراف"
            @click="redirectPage()"
          />

          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
            :disabled="!valid || loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
let jmoment = require("moment");

export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    load_product: false,
    createUrl: "/special-discount/insert",
    updateUrl: "/special-discount/update",
    showUrl: "/special-discount/show",
    informations_product: {},
    agencyes: [],
    all_info_products: [],
    products: [],
    discount: [
      { text: "  فروش آنلاین", value: "off_sale_online" },
      { text: "  فروش تلفنی", value: "off_sale_call_center" },
    ],
    now: "",
    discount_in: [],
    form: {
      sort: "",
      title: "",
      status: "active",
      end_at: "",
      start_at: "",
      price_off: "",
      product_id: "",
      limit_use: "",
      description: "",
      type_discount: "",
      off_sale_all: "yes",
      off_sale_online: false,
      off_sale_call_center: false,
      sale_agency_ids: [],
    },
  }),

  beforeMount() {
    this.loadAgencyes();
    this.loadProduct();
    this.now = jmoment().format("YYYY-MM-DD");
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  watch: {
    "form.product_id"() {
      if (Boolean(this.form.product_id)) {
        this.showProduct(this.form.product_id);
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (form.off_sale_all == "yes") {
        form.off_sale_all = true;
        form.off_sale_online = false;
        form.off_sale_call_center = false;
        form.sale_agency_ids = [];
      } else {
        form.off_sale_all = false;
        if (this.discount_in.length > 0) {
          for (let i in this.discount_in) {
            form[this.discount_in[i]] = true;
          }
        }
      }
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          let data = response.data;
          for (let key in data) {
            this.form[key] = data[key];
          }
          if (data.off_sale_all == true) {
            this.form.off_sale_all = "yes";
          } else {
            this.form.off_sale_all = "no";
            if (data.off_sale_online == true) {
              this.discount_in.push("off_sale_online");
            }
            if (data.off_sale_call_center == true) {
              this.discount_in.push("off_sale_call_center");
            }
          }
          this.form.sale_agency_ids = data.sale_agencies.map((x) => x.id);

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          let data = response.model.data;
          this.all_info_products = data;
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    showProduct(id) {
      this.load_product = true;
      this.$reqApi("/product/show", { id: id })
        .then((response) => {
          let items = [];

          this.informations_product = response.model;

          this.load_product = false;
        })
        .catch((error) => {
          this.load_product = false;
        });
    },
    loadAgencyes() {
      this.loading = true;
      let url = "/sale-agency";
      this.$reqApi(url)
        .then((res) => {
          this.loading = false;

          let items = [];
          let data = res.model.data;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push({
              text: `${element.name}   (  ${element.code} )`,
              value: element.id,
            });
          }
          this.agencyes = items;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>
<style scoped>
.card-style {
  border-radius: 10px !important;
  border: 1px solid rgba(128, 128, 128, 0.212);
}
</style>

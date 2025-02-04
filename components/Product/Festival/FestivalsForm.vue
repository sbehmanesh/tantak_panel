<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex">
        <v-col cols="12" md="3">
          <amp-input text="عنوان جشنواره" v-model="form.name" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <AmpUploadFile v-model="form.logo" title="انتخاب تصویر" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="نوع جوایز"
            :items="$store.state.static.type_gift"
            rules="require"
            v-model="form.type_gift"
          ></amp-select>
        </v-col>

        <v-col
          cols="12"
          md="3"
          v-if="
            form.type_gift == 'credit_wallt' || form.type_gift == 'cash_walet'
          "
        >
          <amp-input
            text=" مبلغ شارژ (ریال)"
            v-model="form.wallet_amount"
            rules="require"
            cClass="ltr-item"
            is-price
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.type_gift == 'coupon'" class="mt-8">
          <v-autocomplete
            clearable
            outlined
            dense
            multiple
            prepend-inner-icon="newspaper"
            v-model="form.coupon_ids"
            :items="coupon_list"
            text="کد های تخفیف"
          >
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title>
                  <h1>
                    {{ data.item.text }}
                  </h1>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <h1>
                    <small class="blue-grey--text">
                      مقدار تخفیف :‌ {{ data.item.discount_value }}
                    </small>
                    <br />
                    <small> {{ data.item.date }} </small>
                  </h1>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="نوع جشنواره"
            rules="require"
            v-model="form.type"
            :items="$store.state.static.festival_type"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-jdate
            text="تاریخ شروع  جشنواره"
            :is-number="true"
            v-model="form.start_at"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-jdate
            text="تاریخ پایان جشنواره"
            :is-number="true"
            v-model="form.end_at"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="وضعیت"
            :items="$store.state.static.festival_status"
            rules="require"
            v-model="form.status"
          ></amp-select>
        </v-col>

        <v-col cols="12" md="3">
          <amp-select
            text="جشنواره برای "
            :items="for_typs"
            rules="require"
            v-model="form.section_name"
          ></amp-select>
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            v-if="form.section_name == 'Product'"
            text="انتخاب محصول"
            :items="products"
            rules="require"
            v-model="form.section_id"
          />
          <amp-autocomplete
            v-if="form.section_name == 'Package'"
            text="انتخاب پکیج"
            :items="package"
            rules="require"
            v-model="form.section_id"
          />
        </v-col>

        <v-col cols="12" md="3" v-if="form.type == 'on_basket'">
          <amp-jdate
            text=" شروع بازه خرید "
            v-model="form.start_at_buy"
            :is-number="true"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.type == 'on_basket'">
          <amp-jdate
            text=" پایان بازه خرید "
            v-model="form.end_at_buy"
            :is-number="true"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            v-if="form.type == 'on_product'"
            text="تعداد خرید"
            v-model="form.amount_start_use"
            cClass="ltr-item"
            rules="require,number"
          />
          <amp-input
            v-else
            text="قیمت خرید (ریال)"
            v-model="form.amount_start_use"
            rules="require"
            cClass="ltr-item"
            is-price
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="ترتیب"
            v-model="form.sort"
            rules="number,number"
            cClass="ltr-item"
          />
        </v-col>
      </v-row>
      <v-row class="align-center justify-center">
        <v-col cols="12" md="10">
          <FestivalAwards
            v-if="
              products.length > 0 &&
              package.length > 0 &&
              form.type_gift == 'product_package'
            "
            :products="products"
            :package="package"
            @selectedIItems="selectedIItems($event)"
            :load-items="load_items"
            ref="FestivalAwards"
          />
        </v-col>
      </v-row>
      <v-row class="justify-center align-center">
        <v-col
          cols="12"
          md="10"
          v-if="
            form.type_gift == 'not_system_products' &&
            not_system_products.length > 0
          "
        >
          <NotSystemProducts
            v-if="!loading"
            ref="NotSystemProductsItems"
            @selectedIItems="selectedIItems($event)"
            :datas="not_system_products"
            :load-items="prop_not_system_products"
          />
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
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import FestivalAwards from "@/components/Product/Festival/FestivalAwards.vue";
import NotSystemProducts from "@/components/Product/Festival/LotteryGift/NotSystemProducts.vue";
export default {
  components: { FestivalAwards, NotSystemProducts },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    load_items: {},
    loading: false,
    createUrl: "/festival/insert",
    updateUrl: "/festival/update",
    showUrl: "/festival/show",
    products: [],
    not_system_products: [],
    coupon_list: [],
    prop_not_system_products: [],
    package: [],
    for_typs: [
      { text: "پکیج ها", value: "Package" },
      { text: "محصولات", value: "Product" },
    ],
    selected: {},
    form: {
      name: "",
      logo: "",
      sort: "",
      type: "",
      start_at: "",
      wallet_amount: "",
      end_at: "",
      status: "",
      lottery: "",
      benefit: "",
      type_gift: "product_package",
      section_name: "Package",
      package_items: [],
      product_items: [],
      coupon_ids: [],
      not_system_product_ids: [],
      start_at_buy: "",
      amount_start_use: "",
      end_at_buy: "",
      section_id: "",
    },
  }),

  beforeMount() {
    this.loadPackages();
    this.loadProduct();
    this.getProductsSetting();
    this.loadFestivalCoupon();
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      if (this.form.type_gift == "not_system_products") {
        this.$refs.NotSystemProductsItems.callSubmit();
        return;
      }
      if (this.form.type_gift == "product_package") {
        this.$refs.FestivalAwards.callSubmit();
      } else {
        this.selectedIItems();
      }
    },
    getProductsSetting() {
      let filter = {
        op: "=",
        key: "not_system_products",
      };
      this.$reqApi("/setting", { filters: filter, row_number: 30000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.value,
              value: x.id,
            });
          }
          this.not_system_products = items;
        })
        .catch((err) => {});
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          let data = response.data;
          for (let i in data) {
            this.form[i] = data[i];
          }
          if (Boolean(data.gift_packages) && data.gift_packages.length > 0) {
            this.load_items["packages"] = data.gift_packages;
          }
          if (Boolean(data.gift_products) && data.gift_products.length > 0) {
            this.load_items["products"] = data.gift_products;
          }
          data.coupons.map((x) => {
            this.form.coupon_ids.push(x.id);
          });
          if (data.type_gift == "not_system_products") {
            let items = [];
            data.not_system_products.map((x) => {
              items.push(x.id);
            });
            this.prop_not_system_products = items;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    loadPackages() {
      let filter = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      this.$reqApi("/package", { filters: filter, row_number: 2000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.package = items;
        })
        .catch((error) => {});
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
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
    loadFestivalCoupon() {
      this.load_item = true;
      let filters = {
        is_festival: {
          op: "=",
          value: true,
        },
      };
      this.$reqApi("/coupon", { row_number: 50000, filters: filters })
        .then((response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            let discount_value =
              x.type == "amount"
                ? `${this.$price(x.value)} ریال`
                : `${x.value} درصد`;
            let start = this.$toJalali(
              x.start_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
            let end = this.$toJalali(x.end_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
            let date = `قابل استفاده از تاریخ ${start} تا ${end}`;
            items.push({
              text: x.for_title,
              date: date,
              value: x.id,
              discount_value: discount_value,
            });
          }
          this.coupon_list = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    selectedIItems(event) {
      if (this.form.type_gift == "product_package" && event) {
        this.form.package_items = event.packages;
        this.form.product_items = event.products;
      }
      if (this.form.type_gift == "not_system_products" && event) {
        this.form.not_system_product_ids = event;
      }

      let form = { ...this.form };
      this.loading = true;
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

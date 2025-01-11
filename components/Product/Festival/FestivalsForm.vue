<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex">
        <v-col cols="12" md="2">
          <amp-input text="عنوان جشنواره" v-model="form.name" rules="require" />
        </v-col>
        <v-col cols="12" md="2">
          <AmpUploadFile v-model="form.logo" title="انتخاب تصویر" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="نوع جشنواره"
            rules="require"
            v-model="form.type"
            :items="$store.state.static.festival_type"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-jdate
            text="تاریخ شروع  جشنواره"
            :is-number="true"
            v-model="form.start_at"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-jdate
            text="تاریخ پایان جشنواره"
            :is-number="true"
            v-model="form.end_at"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="وضعیت"
            :items="$store.state.static.festival_status"
            rules="require"
            v-model="form.status"
          ></amp-select>
        </v-col>

        <v-col cols="12" md="2">
          <amp-select
            text="جشنواره برای "
            :items="for_typs"
            rules="require"
            v-model="form.section_name"
          ></amp-select>
        </v-col>
        <v-col cols="12" md="2">
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
        <v-col cols="12" md="2" v-if="form.type == 'on_basket'">
          <amp-jdate
            text=" شروع بازه خرید "
            v-model="form.start_at_buy"
            :is-number="true"
          />
        </v-col>
        <v-col cols="12" md="2" v-if="form.type == 'on_basket'">
          <amp-jdate
            text=" پایان بازه خرید "
            v-model="form.end_at_buy"
            :is-number="true"
          />
        </v-col>
        <v-col cols="12" md="2">
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
        <v-col cols="12" md="2">
          <amp-input text="ترتیب" v-model="form.sort" rules="number,number"       cClass="ltr-item" />
        </v-col>

      </v-row>
      <v-row class="align-center justify-center">
        <v-col cols="10">
          <FestivalAwards
            v-if="products.length > 0 && package.length > 0"
            :products="products"
            :package="package"
            @selectedIItems="selectedIItems($event)"
            ref="FestivalAwards"
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
export default {
  components: { FestivalAwards },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/festival/insert",
    updateUrl: "/festival/update",
    showUrl: "/festival/show",
    products: [],
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
      end_at: "",
      status: "",
      lottery: "",
      benefit: "",
      section_name: "Package",
      package_items: [],
      product_items: [],
      start_at_buy: "",
      amount_start_use: "",
      end_at_buy: "",
      section_id: "",
    },
  }),

  beforeMount() {
    this.loadPackages();
    this.loadProduct();
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      this.$refs.FestivalAwards.callSubmit();
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          let data = response.data;
          for (let i in data) {
            this.form[i] = data[i];
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
    selectedIItems(event) {
      this.form.package_items = event.packages;
      this.form.product_items = event.products;
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

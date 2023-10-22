<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-select
            text="ویژگی"
            :items="allVariations"
            title="Property"
            v-model="form.variation_type_id"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            rules="require"
            text="دسته بندی"
            v-model="form.category_id"
            :items="product_categories"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            :disabled='form.category_id.length < 0'
            rules="require"
            text="محصولات"
            v-model="form.product_id"
            :items="products"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input text="مقدار" v-model="form.value" />
        </v-col>
        <v-col cols="3">
          <amp-input text="بارکد" v-model="form.barcode" rules="max_2" />
        </v-col>
        <v-col cols="3">
          <amp-input text="ترتیب نمایش " v-model="form.sort" rules="number" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-upload-file v-model="form.images" :multiple="true" />
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
export default {
  props: {
    modelId: { default: null }
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/product-variation/insert",
    updateUrl: "/product-variation/update",
    showUrl: "/product-variation/show",
    product_categories: [],
    products: [],
    form: {
      id: "",
      sort: 1,
      value: "",
      variation_type_id: "",
      product_id: "",
      category_id: "",
      barcode: "",
      images: []
    },

    allVariations: [],
    category_id: ""
  }),

  mounted() {
    if (this.modelId) {
      this.loadData();
    }
    this.category_id = this.$route.params.variation_category_id;
    this.getCategories();
    this.getAllVariations();
  },
  watch: {
    'form.category_id'(){
      if(this.form.category_id){
        this.getProducts(this.form.category_id)
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      this.form["category_id"] = this.category_id;
      let form = this.$copyForm(this.form);
      if (!form.value || !form.variation_type_id) {
        this.$toast.error("Please check the input values.");
        this.loading = false;
        return;
      }
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then(response => {
          if (!this.modelId) {
            this.$toast.success(
              "The desired feature has been successfully added."
            );
          } else {
            this.$toast.success(
              "The property in question has been edited successfully."
            );
          }
          this.$router.push("/product/category/variation/" + this.category_id);
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(response => {
          response = response.model;
          this.form["id"] = response.id;
          this.form.barbarcode = response.barcode;
          this.form.sort = response.sort;
          this.form.value = response.value;
          this.form.variation_type_id = response.variation_type_id;
          this.form.images = response.images;
          this.loading = false;
        })
        .catch(error => {
          this.redirectPage();
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
    getCategories() {
      let form = {
        row_number: 2000
      };

      this.$reqApi("/category", form)
        .then(response => {
          this.product_categories = response.model.data.map(x => ({
            value: x.id,
            text: x.name
          }));

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getProducts(id) {
      let form = {
        row_number: 2000,
        filters:{
          categories_id:id
        }
      };

      this.$reqApi("/product", form)
        .then(response => {
          this.products = response.model.data.map(x => ({
            value: x.id,
            text: x.name
          }));

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getAllVariations() {
      this.loading = true;
      let form = {
        row_number: 100,
        filters: { key: "variation_type" }
      };

      this.$reqApi("/setting", form)
        .then(response => {
          this.allVariations = response.model.data.map(x => ({
            value: x.id,
            text: x.value
          }));
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

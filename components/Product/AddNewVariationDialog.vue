<template>
  <v-dialog v-model="dialog" persistent max-width="550">
    <v-card :disabled="loading">
      <v-col cols="12" class="text-center">
        <h1 class="my-4 font_17">ایجاد ویژگی جدید</h1>
        <v-divider v-for="i in 3" :key="i"></v-divider>
      </v-col>
      <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
        <v-container fluid class="px-8">
          <v-row dense>
            <v-col cols="12" md="12">
              <amp-select
                text="ویژگی"
                :items="allVariations"
                rules="require"
                title="Property"
                v-model="form.variation_type_id"
              />
            </v-col>
            <!-- <v-col cols="12" md="3">
            <amp-autocomplete
              rules="require"
              text="دسته بندی"
              v-model="form.category_id"
              :items="product_categories"
            />
          </v-col> -->
            <!-- <v-col cols="12" md="3">
            <amp-autocomplete
              :disabled="form.category_id.length < 0"
              rules="require"
              text="محصولات"
              v-model="form.product_id"
              :items="products"
            />
          </v-col> -->
            <v-col cols="12" md="12" v-if="!select_color">
              <amp-input text="مقدار" v-model="form.value" rules="require" />
            </v-col>
            <v-col
              v-if="Boolean(select_color)"
              cols="12"
              md="4"
              v-for="(i, index) in 3"
              :key="index"
            >
              <amp-autocomplete
                :rules="index == 0 ? 'require' : ''"
                :text="` مقدار ${index + 1} `"
                v-model="color_ids[index]"
                :items="colors"
              />
            </v-col>

            <v-col cols="12">
              <amp-input
                cClass="ltr-item"
                text="ترتیب نمایش "
                v-model="form.sort"
                rules="number"
              />
            </v-col>
            <!-- <v-col cols="12" md="3">
            <amp-upload-file v-model="images" :multiple="true" />
          </v-col> -->
          </v-row>

          <v-row dense>
            <v-col cols="12" md="12">
              <v-divider />
            </v-col>
            <v-col cols="12" md="12" class="text-center">
              <amp-button
                class="my-1"
                color="red darken-1"
                text="انصراف"
                @click="cloasDialog()"
              />
              <amp-button
                class="my-1"
                type="submit"
                color="green darken-1"
                :loading="loading"
                :disabled="!valid || loading"
                text="ثبت"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { default: null },
    productId: { default: "", type: String },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/product-variation/insert",
    updateUrl: "/product-variation/update",
    showUrl: "/product-variation/show",
    product_categories: [],
    products: [],
    images: [],
    color_ids: [],
    form: {
      id: "",
      sort: 1,
      value: "",
      variation_type_id: "",
      product_id: "",
    },

    allVariations: [],
    colors: [],
    category_id: "",
    select_color: false,
  }),
  mounted() {

    this.form.product_id = this.productId;
    this.getCategories();
    this.getAllVariations();
    this.getColors();
  },
  watch: {
    "form.variation_type_id": {
      deep: true,
      handler() {
        let find = this.allVariations.find(
          (f) => f.value == this.form.variation_type_id
        );
        if (Boolean(find) && find.value_2 == "product_colors") {
          this.select_color = true;
        } else {
          this.select_color = false;
        }
      },
    },
    "form.category_id"() {
      if (this.form.category_id) {
        this.getProducts(this.form.category_id);
      }
    },
    images() {
      if (this.images) {
        this.images.map((x) => {
          this.form.images.push({
            alt: "image",
            path: x,
          });
        });
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = this.$copyForm(this.form);
      if (Boolean(this.select_color)) {
        if (this.color_ids.length == 0) {
          this.$toast.error("انتخاب حداقل یک رنگ اجباری است");
          this.loading = false;
        }
        form.value = this.color_ids;
      }
      if (!form.value || !form.variation_type_id) {
        this.$toast.error("لطفا مقادیر ورودی را بررسی کنید");
        this.loading = false;
        return;
      }
      let url = this.createUrl;

      this.$reqApi(url, form)
        .then((response) => {
          this.$toast.success("ویژگی مورد نظر با موفقیت ویرایش شد");
          this.cloasDialog();
          this.$emit("reload")
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    cloasDialog() {
      this.$emit("cloasDialog");
    },
    
    getCategories() {
      let form = {
        row_number: 2000,
      };

      this.$reqApi("/category", form)
        .then((response) => {
          this.product_categories = response.model.data.map((x) => ({
            value: x.id,
            text: x.name,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getProducts(id) {
      let form = {
        row_number: 2000,
        filters: {
          categories_id: id,
        },
      };

      this.$reqApi("/product", form)
        .then((response) => {
          this.products = response.model.data.map((x) => ({
            value: x.id,
            text: x.name,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getAllVariations() {
      this.loading = true;
      let form = {
        row_number: 1000,
        filters: { key: "variation_type" },
      };

      this.$reqApi("/setting", form)
        .then((response) => {
          this.allVariations = response.model.data.map((x) => ({
            value: x.id,
            text: x.value,
            value_2: x.value_2,
          }));
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getColors() {
      let filter = {
        op: "=",
        key: "product_colors",
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
          this.colors = items;
        })
        .catch((err) => {});
    },
  },
};
</script>

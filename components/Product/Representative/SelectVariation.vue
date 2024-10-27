<template>
  <v-card style="overflow: hidden; border-radius: 10px" class="elevation-0">
    <v-row>
      <v-col cols="12" md="12">
        <v-autocomplete
          class="mx-2"
          prepend-inner-icon="shopping_basket"
          v-model="product_varcomb_id"
          :items="products"
          outlined
          dense
          :disabled="Boolean(load_item)"
          :loading="Boolean(load_item)"
          label="انتخاب محصول"
          placeholder="نام محصول مورد نظر را وارد کنید ..."
        />
        <v-col
          v-if="Boolean(check) && !loading"
          class="justify-center text-center"
          cols="12"
        >
          <v-icon color="red" size="50"> error </v-icon>
          <br />
          <small class="red--text">
            برای محصول انتخاب شده ویژگی تعیین شده</small
          >
        </v-col>
        <v-form v-model="valid_variations" v-if="!loading">
          <v-row>
            <v-col cols="12" md="4">
              <amp-select
                v-if="Boolean(step_var_1) && Boolean(product_sort_1)"
                :text="product_sort_1.title"
                rules="require"
                v-model="var_id_1"
                :items="product_sort_1.items"
                :loading="loading"
                :disabled="
                  (loading &&
                    !Boolean(step_var_1) &&
                    !Boolean(product_sort_1)) ||
                  !Boolean(product_varcomb_id)
                "
            /></v-col>
            <v-col cols="12" md="4">
              <amp-select
                v-if="Boolean(step_var_2) && Boolean(product_sort_2)"
                :text="product_sort_2.title"
                rules="require"
                v-model="var_id_2"
                :items="available_items_2"
                :loading="loading"
                :disabled="!Boolean(var_id_1) || loading"
              />
            </v-col>
            <v-col cols="12" md="4">
              <amp-select
                v-if="Boolean(step_var_3) && Boolean(product_sort_3)"
                :text="product_sort_3.title"
                rules="require"
                v-model="var_id_3"
                :items="available_items_3"
                :loading="loading"
                :disabled="!Boolean(var_id_2) || loading"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-row class="mt-8" v-if="loading">
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="text@2"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="text@2"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="text@2"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="12">
            <v-skeleton-loader v-bind="attrs" type="text@1"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>

      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10"> </v-col>
      </v-row>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    clear_vaue: {
      default: false,
      require: false,
    },
  },
  data: () => ({
    e1: 2,
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    number: 1,
    valid_variations: true,
    load_form: true,
    load_item: true,
    loading: false,
    check: false,
    show_basket_items: false,
    step_var_1: false,
    step_var_2: false,
    step_var_3: false,
    product_sort_1: {},
    product_sort_2: [],
    product_sort_3: [],
    products: [],
    variations_list: [],
    available_items_2: [],
    available_items_3: [],
    variations_Product: [],
    var_products: [],
    all_variatons_product: [],
    list_basket: [],
    parent_2: "",
    parent_3: "",
    var_id_1: "",
    var_id_2: "",
    var_id_3: "",
    main_image: "",
    first_name: "",
    last_name: "",
    username: "",
    user_id: "",
    main_price: "",
    sumb_price: "",
    product_name: "",
    product_varcomb_id: "",

    selected_product: {},
  }),
  beforeMount() {
    this.loadProduct();
  },
  mounted() {},
  watch: {
    clear_vaue() {
      if (!this.clear_vaue) {
        this.product_varcomb_id = "";
      }
    },
    product_varcomb_id() {
      let id = "";
      this.var_id_1 = "";
      this.var_id_2 = "";
      this.var_id_3 = "";
      this.sumb_price = "";
      this.main_price = "";
      this.number = 1;
      id = this.product_varcomb_id;
      if (Boolean(id)) {
        this.loadInfoProduct(id);
      }
    },
    var_id_1() {
      let items = [];
      this.var_id_2 = "";
      this.product_sort_2.items.filter((x) => {
        if (x.parent == this.var_id_1) {
          items.push({
            text: x.text,
            value: x.value,
          });
        }
      });
      this.available_items_2 = items;
    },
    var_id_2() {
      this.var_id_3 = "";
      let items = [];
      this.product_sort_3.items.filter((x) => {
        if (x.parent == this.var_id_2) {
          items.push({
            text: x.text,
            value: x.value,
          });
        }
      });
      this.available_items_3 = items;
    },
    valid_variations() {
      if (Boolean(this.valid_variations)) {
        let product = {};
        this.all_variatons_product.filter((f) => {
          if (Boolean(this.step_var_3)) {
            if (
              this.var_id_1 == f.variation_1_id &&
              this.var_id_2 == f.variation_2_id &&
              this.var_id_3 == f.variation_3_id
            ) {
              product = f;
            }
          }
          if (Boolean(this.step_var_2) && !Boolean(this.step_var_3)) {
            if (
              this.var_id_1 == f.variation_3_id &&
              this.var_id_2 == f.variation_2_id
            ) {
              product = f;
            }
          }
          if (
            Boolean(this.step_var_1) &&
            !Boolean(this.step_var_2) &&
            !Boolean(this.step_var_3)
          ) {
            if (this.var_id_1 == f.variation_1_id) {
              product = f;
            }
          }
          this.selected_product = product;
          this.$emit("validVariations", this.valid_variations);
          this.$emit("productId", product.id);
        });
      }
    },
    check() {
      this.$emit("haveVariation", this.check);
    },
  },
  methods: {
    addNumber(item, add, key) {
      if (key == "main") {
        if (Boolean(add)) {
          item++;
        } else {
          item--;
        }

        this.number = item;
      }
      if (key == "list") {
        if (Boolean(add)) {
          item.count += 1;
        } else {
          item.count -= 1;
        }
      }
      let arry = this.variations_list;
      this.variations_list = [];
      this.variations_list = arry;
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
    loadInfoProduct(id) {
      this.loading = true;
      this.step_var_1 = false;
      this.step_var_2 = false;
      this.step_var_3 = false;
      this.check = false;

      this.$reqApi("product-variation-combination/variety-list", {
        product_id: id,
      })
        .then((response) => {
          let set_title = [];
          this.all_variatons_product = response.model.data;
          // ساختار کلی variations

          if (Boolean(response.model.data[0])) {
            if (response.model.data[0].variation1) {
              this.step_var_1 = true;
              set_title[
                `var_${response.model.data[0].variation1.variation_type.sort}`
              ] = {
                title: response.model.data[0].variation1.variation_type.value,
              };
            }
            if (response.model.data[0].variation2) {
              this.step_var_2 = true;
              set_title[
                `var_${response.model.data[0].variation2.variation_type.sort}`
              ] = {
                title: response.model.data[0].variation2.variation_type.value,
              };
            }
            if (response.model.data[0].variation3) {
              this.step_var_3 = true;
              set_title[
                `var_${response.model.data[0].variation3.variation_type.sort}`
              ] = {
                title: response.model.data[0].variation3.variation_type.value,
              };
            }
          } else {
            this.check = true;
          }
          this.main_image =
            response.model.data[0].variation1.product.main_image;
          this.product_name = response.model.data[0].variation1.product.name;

          // set items variations
          let items_var_1 = [];
          let items_var_2 = [];
          let items_var_3 = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (Boolean(this.step_var_1) && Boolean(element.variation1)) {
              let text = Boolean(element.variation1.colors)
                ? element.variation1.colors
                : element.variation1.value;
              let value = element.variation1.value.startsWith("[/")
                ? JSON.parse(element.variation1.value)
                : element.variation1.id;
              items_var_1.push({
                text: text,
                value: value,
              });
            }

            if (Boolean(this.step_var_2) && Boolean(element.variation2)) {
              items_var_2.push({
                text: element.variation2.value,
                value: element.variation2.id,
                parent: element.variation_1_id,
              });
            }
            if (Boolean(this.step_var_3) && Boolean(element.variation3)) {
              items_var_3.push({
                text: element.variation3.value,
                value: element.variation3.id,
                parent: element.variation_2_id,
              });
            }
          }
          if (Boolean(this.step_var_1)) {
            this.product_sort_1["title"] = set_title.var_1.title;
            this.product_sort_1["items"] = items_var_1;
          }
          if (Boolean(this.step_var_2)) {
            this.product_sort_2["title"] = set_title.var_2.title;
            this.product_sort_2["items"] = items_var_2;
          }
          if (Boolean(this.step_var_3)) {
            this.product_sort_3["title"] = set_title.var_3.title;
            this.product_sort_3["items"] = items_var_3;
          }

          this.loading = false;
          this.load_form = false;
        })
        .catch((error) => {
          this.loading = false;
          this.load_form = false;
        });
    },

    loadVariationsCombinations() {
      let items = [];
      for (let index = 0; index < this.productVarcoms.length; index++) {
        const e = this.productVarcoms[index];
        let obj = {};
        obj["id"] = e.id;
        obj["count"] = e.count_product;
        if (Boolean(e.variation1)) {
          obj["variation1"] = {
            product: e.product,
            value: e.variation1.value,
          };
        }
        if (Boolean(e.variation2)) {
          obj["variation2"] = e.variation2;
        }
        if (Boolean(e.variation3)) {
          obj["variation3"] = e.variation3;
        }
        items.push(obj);
      }
      this.variations_list = items;
    },

    addVariation() {
      if (!Boolean(this.variations_list) || this.variations_list.length == 0) {
        this.selected_product["count"] = this.number;
        this.variations_list.push(this.selected_product);
        this.number = 1;
        this.product_varcomb_id = "";
        this.$toast.success(" محصول  اضافه شد");
      } else {
        let dublicate_variations = false;
        this.variations_list.find((x) => {
          if (x.id == this.selected_product.id) {
            dublicate_variations = true;
            this.$toast.info("این محصولا قبلا اضافه شده");
            return true;
          }
          if (!Boolean(dublicate_variations)) {
            this.selected_product["count"] = this.number;
            this.variations_list.push(this.selected_product);
            this.number = 1;
            this.product_varcomb_id = "";
            this.$toast.success(" محصول  اضافه شد");
          }
        });
      }
    },
    findSelectedProduct() {
      return new Promise((res, rej) => {
        if (Boolean(this.valid_variations)) {
          let product = {};
          this.all_variatons_product.filter((f) => {
            if (Boolean(this.step_var_3)) {
              if (
                this.var_id_1 == f.variation_1_id &&
                this.var_id_2 == f.variation_2_id &&
                this.var_id_3 == f.variation_3_id
              ) {
                product = f;
              }
            }
            if (Boolean(this.step_var_2) && !Boolean(this.step_var_3)) {
              if (
                this.var_id_1 == f.variation_3_id &&
                this.var_id_2 == f.variation_2_id
              ) {
                product = f;
              }
            }
            if (
              Boolean(this.step_var_1) &&
              !Boolean(this.step_var_2) &&
              !Boolean(this.step_var_3)
            ) {
              if (this.var_id_1 == f.variation_1_id) {
                product = f;
              }
            }
            if (Object.keys(product).length > 0) {
              res(product);
            }
          });
        }
      })
        .then((res) => {
          this.selected_product = res;
          this.$emit("validVariations", true);
          this.$emit("productId", res.id);
        })
        .catch((rej) => {
        });
    },
  },
};
</script>

<style></style>

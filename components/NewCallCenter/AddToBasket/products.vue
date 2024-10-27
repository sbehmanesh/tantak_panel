<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="12" md="12" class="mt-8 px-4">
      <v-autocomplete
        v-if="
          this.$store.state.auth.action.indexOf('product_requests/update') > -1
        "
        class="mx-2"
        prepend-inner-icon="search"
        v-model="product_varcomb_id"
        :items="products"
        outlined
        dense
        :disabled="Boolean(load_item)"
        :loading="Boolean(load_item)"
        label="جستوجوی سریع محصول"
        placeholder="نام محصول مورد نظر را وارد کنید ..."
      />
      <v-col
        v-if="Boolean(check) && !loading"
        class="justify-center text-center"
        cols="12"
      >
        <v-icon color="red" size="80"> production_quantity_limits </v-icon>
        <br />
        <small class="red--text"> عدم موجودی محصول </small>
      </v-col>
      <v-form v-model="valid_variations" v-if="!loading">
        <v-row>
          <v-col cols="12" md="4">
            <amp-select
              v-if="
                Boolean(step_var_1) &&
                Boolean(product_sort_1) &&
                Boolean(product_varcomb_id)
              "
              :text="product_sort_1.title"
              rules="require"
              v-model="var_id_1"
              :items="product_sort_1.items"
              :loading="loading"
              :disabled="
                loading && !Boolean(step_var_1) && !Boolean(product_sort_1)
              "
          /></v-col>
          <v-col cols="12" md="4">
            <amp-select
              v-if="
                Boolean(step_var_2) &&
                Boolean(product_sort_2) &&
                Boolean(product_varcomb_id)
              "
              :text="product_sort_2.title"
              rules="require"
              v-model="var_id_2"
              :items="available_items_2"
              :loading="loading"
              :disabled="!Boolean(var_id_1) || loading"
          /></v-col>
          <v-col cols="12" md="4">
            <amp-select
              v-if="
                Boolean(step_var_3) &&
                Boolean(product_sort_3) &&
                Boolean(product_varcomb_id)
              "
              :text="product_sort_3.title"
              rules="require"
              v-model="var_id_3"
              :items="available_items_3"
              :loading="loading"
              :disabled="!Boolean(var_id_2) || loading"
            />
          </v-col>

          <v-row
            class="align-center align-center"
            cols="12"
            v-if="
              Boolean(valid_variations) &&
              Boolean(step_var_1) &&
              Boolean(product_varcomb_id) &&
              !loading
            "
          >
            <v-spacer></v-spacer>
            <v-avatar size="80" class="mx-2">
              <img :src="$getImage(selected_product.img)" />
            </v-avatar>
            <v-spacer></v-spacer>
            <h1 :class="$vuetify.breakpoint.mdAndUp ? 'font_17' : 'font_13'">
              قیمت محصول :‌
              {{ $price(selected_product.product_price) }} ریال
            </h1>
            <v-spacer></v-spacer>
            <amp-button
              :block="$vuetify.breakpoint.mdAndUp ? false : true"
              v-if="
                Boolean(step_var_1) &&
                Boolean(product_sort_1) &&
                Boolean(product_varcomb_id)
              "
              height="40"
              :disabled="
                !Boolean(valid_variations) ||
                !Boolean(product_varcomb_id) ||
                loading_add
              "
              color="orange darken-4"
              text="افزودن"
              @click="addVariation()"
            />
            <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
          </v-row>
        </v-row>
        <v-col> </v-col>
      </v-form>

      <v-row class="mt-8" v-if="loading">
        <v-col cols="12" md="4">
          <v-skeleton-loader type="text@2"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="4">
          <v-skeleton-loader type="text@2"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="4">
          <v-skeleton-loader type="text@2"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="12">
          <v-skeleton-loader type="text@1"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" v-if="loading_add">
      <v-card class="elevation-0">
        <v-skeleton-loader height="120" class="mx-auto" type="card" />
      </v-card>
    </v-col>
    <v-col cols="12" md="12">
      <v-card
        outlined
        class="pa-5 my-4 card-style"
        v-for="(item, index) in variations_list"
        :key="index"
      >
        <v-row class="align-center">
          <v-avatar size="55">
            <img :src="$getImage(item.variation1.product.main_image)" />
          </v-avatar>
          <v-spacer></v-spacer>

          <h1
            :class="$vuetify.breakpoint.mdAndUp ? '' : 'font_11'"
            class="mr-3"
          >
            {{ item.variation1.product.name }}
          </h1>
          <v-spacer></v-spacer>

          <h1 :class="$vuetify.breakpoint.mdAndUp ? '' : 'font_11'">
            <span v-if="Boolean(item.variation1.colors)">
              {{ item.variation1.colors }}
            </span>
            <span v-else>
              {{ item.variation1.value }}
            </span>
            / {{ item.variation2.value }} /
            {{ item.variation3.value }}
          </h1>
          <v-spacer></v-spacer>

          <v-btn @click="deletVar(index)" text icon>
            <v-icon color=""> cancel </v-icon>
          </v-btn>
          <v-col cols="12" class="text-center">
            <v-divider class="mb-4"></v-divider>
            <v-row class="pa-2" v-if="$vuetify.breakpoint.mdAndUp">
              <strong :class="$vuetify.breakpoint.mdAndUp ? '' : 'font_11'">
                قیمت محصول :
                {{ $price(item.product_price) }} ریال
              </strong>
              <v-spacer></v-spacer>
              <v-row class="d-flex justify-center mt-1">
                <v-btn icon @click="addNumber(item, true, 'list')" x-small>
                  <v-chip>
                    <h1 class="font_18 mx-1 mt-1">+</h1>
                  </v-chip>
                </v-btn>
                <h1 class="font_18 mx-5">
                  {{ item.count }}
                </h1>
                <v-btn
                  :disabled="item.count == 1"
                  @click="addNumber(item, false, 'list')"
                  icon
                  x-small
                >
                  <v-chip>
                    <h1 class="font_20 mx-1">-</h1>
                  </v-chip>
                </v-btn>
              </v-row>
              <v-spacer></v-spacer>
              <strong :class="$vuetify.breakpoint.mdAndUp ? '' : 'font_11'">
                قیمت کل :
                {{ $price(item.count * item.product_price) }} ریال
              </strong>
            </v-row>
            <v-col cols="12" v-else class="text-center">
              <strong :class="$vuetify.breakpoint.mdAndUp ? '' : 'font_11'">
                قیمت محصول :
                {{ $price(item.product_price) }} ریال
              </strong>
              <v-spacer></v-spacer>
              <v-row class="d-flex justify-center mt-1 my-2">
                <v-btn icon @click="addNumber(item, true, 'list')" x-small>
                  <v-chip>
                    <h1 class="font_18 mx-1 mt-1">+</h1>
                  </v-chip>
                </v-btn>
                <h1 class="font_18 mx-5">
                  {{ item.count }}
                </h1>
                <v-btn
                  :disabled="item.count == 1"
                  @click="addNumber(item, false, 'list')"
                  icon
                  x-small
                >
                  <v-chip>
                    <h1 class="font_20 mx-1">-</h1>
                  </v-chip>
                </v-btn>
              </v-row>
              <strong :class="$vuetify.breakpoint.mdAndUp ? '' : 'font_11'">
                قیمت کل :
                {{ $price(item.count * item.product_price) }} ریال
              </strong>
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-row class="d-flex justify-center">
      <v-col cols="12" md="10"> </v-col>
    </v-row>
  </v-row>
</template>

<script>
export default {
  props: {
    basketId: {
      require: false,
      default: false,
    },
  },
  data: () => ({
    number: 1,
    valid_variations: true,
    load_form: true,
    load_item: true,
    loading: false,
    check: false,
    loading_package: false,
    show_basket_items: false,
    step_var_1: false,
    step_var_2: false,
    loading_add: false,
    step_var_3: false,
    packages_list: [],
    package_id: "",

    product_sort_1: {},
    selected_package: {},
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
    if (Boolean(this.basketId)) {
      this.loadItems();
    }
  },
  watch: {
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
      this.product_sort_2.items.filter((x) => {
        if (x.parent == this.var_id_1) {
          items.push({
            text: x.text,
            value: x.value,
          });
        }
      });
      this.available_items_2 = items;
      if (Boolean(this.valid_variations)) {
        this.findSelectedProduct();
      }
    },
    var_id_2() {
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
      if (Boolean(this.valid_variations)) {
        this.findSelectedProduct();
      }
    },
    var_id_3() {
      if (Boolean(this.valid_variations)) {
        this.findSelectedProduct();
      }
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
          if (Boolean(product) && Object.keys(product).length > 0) {
            this.selected_product = product;
            this.selected_product["product_price"] = "";
            this.selected_product["img"] =
              product.variation1.product.main_image;
            if (
              Boolean(product.variation1) &&
              Boolean(product.variation1.product) &&
              Boolean(product.variation1.product.base_price)
            ) {
              this.selected_product.product_price =
                product.variation1.product.base_price;
            } else {
              this.selected_product.product_price = product.price;
            }
          }
        });
      }
    },
  },
  methods: {
    loadItems() {
      this.$reqApi("product-request/show", { id: this.basketId })
        .then((res) => {
          this.$emit("data", res.data);
          let data = res.data.items;

          let item = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];

            if (x.section_name == "ProductVariationCombination") {
              let price = "";
              if (
                Boolean(x.variation1) &&
                Boolean(x.variation1.product) &&
                Boolean(x.variation1.product.base_price)
              ) {
                price = x.variation1.product.base_price;
              } else {
                price = x.price;
              }

              item.push({
                count: x.number,
                variation1: x.pro_var_com.variation1,
                variation2: x.pro_var_com.variation2,
                variation3: x.pro_var_com.variation3,
                id: x.pro_var_com.id,
                product_price: price,
              });
            }
          }

          this.variations_list = item;
          this.$emit("data", this.variations_list);

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
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
      this.$emit("data", this.variations_list);
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

    addVariation() {

      let check = this.variations_list.find(
        (f) => f.id == this.selected_product.id
      );

      if (Boolean(check)) {
        this.$toast.info("این محصولا قبلا اضافه شده");
        return;
      } else {
        this.loading_add = true;
        setTimeout(() => {
          this.selected_product["count"] = this.number;
          this.selected_product.variation1.value = Boolean(
            this.selected_product.variation1.colors
          )
            ? this.selected_product.variation1.colors
            : this.selected_product.variation1.value;
          this.variations_list.unshift(this.selected_product);
          this.number = 1;

          this.$toast.success(" محصول  اضافه شد");
          this.var_id_1 = "";
          this.var_id_2 = "";
          this.var_id_3 = "";
          this.sumb_price = "";
          this.main_price = "";
          this.product_varcomb_id = "";
          this.number = 1;
          this.$emit("data", this.variations_list);
          this.loading_add = false;
        }, 1000);
      }

      if (Array.isArray(this.variations_list)) {
      }
    },
    deletVar(key) {
      let items = this.variations_list;
      items.splice(key, 1);
      this.variations_list = items;
      this.$emit("data", this.variations_list);
    },

    sendVariation() {
      let variation_array = [];
      let ids = [];
      for (let index = 0; index < this.variations_list.length; index++) {
        const x = this.variations_list[index];
        ids.push({
          id: x.id,
          count: x.count,
        });
      }
      variation_array = ids;
      this.$emit("variation_array", variation_array);
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
          this.main_price = res.price ? res.price : res.product.base_price;
          this.sumb_price = this.main_price;
        })
        .catch((rej) => {
        });
    },
  },
};
</script>

<style>
.card-style {
  border: 1px solid #5c5c5c6c !important;
  border-radius: 7px !important;
}
</style>

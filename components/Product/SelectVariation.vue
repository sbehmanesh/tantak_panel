<template>
  <v-card style="overflow: hidden; border-radius: 7px" class="elevation-1">
    <v-col cols="12" class="primary">
      <span class="white--text font_20 mr-3"> محصولات </span>
    </v-col>
    <v-row class="d-flex justify-center mx-8 pb-8">
      <v-col
        cols="12"
        md="4"
        class="mt-8 px-4"
        style="border-left: 1px solid grey"
      >
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
          class="justify-center text-center "
          cols="12"
        >
          <v-icon color="red" size="80"> production_quantity_limits </v-icon>
          <br />
          <small class="red--text"> عدم موجودی محصول </small>
        </v-col>
        <v-form v-model="valid_variations" v-if="!loading">
          <v-row  v-if="Boolean(step_var_1) ">
            <v-col cols="12" md="4">
              <amp-select
                v-if="Boolean(step_var_1) && Boolean(product_sort_1)"
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
                v-if="Boolean(step_var_2) && Boolean(product_sort_2)"
                :text="product_sort_2.title"
                rules="require"
                v-model="var_id_2"
                :items="available_items_2"
                :loading="loading"
                :disabled="!Boolean(var_id_1) || loading"
            /></v-col>
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
          <v-col
            class="text-center"
            cols="12"
            v-if="
              Boolean(valid_variations) &&
              Boolean(product_varcomb_id) &&
              !loading
            "
          >
            <v-row class="d-flex justify-center px-5">
              <span class="font_15 primary--text"> تعداد محصول : </span>
              <v-spacer></v-spacer>
              <v-btn text @click="addNumber(number, true, 'main')" x-small>
                <h1 class="font_18 primary--text mt-2 mx-1">+</h1>
              </v-btn>
              <h1 class="font_14 primary--text mt-1 mx-1">{{ number }}</h1>
              <v-btn
                color="primary"
                :disabled="number == 1"
                @click="addNumber(number, false, 'main')"
                text
                x-small
              >
                <h1 class="font_20 primary--text mb-2 mx-1">_</h1>
              </v-btn>
            </v-row>
            <v-divider class="mt-4"></v-divider>
          </v-col>
        </v-form>

        <v-col
          cols="12"
          v-if="!loading && Boolean(step_var_1) && Boolean(product_sort_1)"
        >
          <amp-button
            block
            height="40"
            :disabled="
              !Boolean(valid_variations) ||
              !Boolean(product_varcomb_id) ||
              loading
            "
            icon="add"
            class="my-1"
            color="orange darken-4"
            text="افزودن"
            @click="addVariation()"
          />
        </v-col>
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

      <v-col cols="12" md="8" class="mt-8">
        <v-card-text
          v-for="(item, index) in variations_list"
          :key="index"
          outlined
          class="pa-3 ma-4 elevation-1 card-style d-flex align-center"
        >
 
        <div v-if="Boolean(item.variation1) && Boolean(item.variation2) ">
          <v-img
                  class="ma-1"
                  width="60"
                  height="65"
                  contain
                  :src="$getImage(item.variation1.product.main_image)"
                />
        </div>
          <v-row class="px-5 py-4 mr-3 align-center" v-if="Boolean(item.variation1) && Boolean(item.variation2) ">
            <h1 v-if="Boolean(item.variation1) &&Boolean(item.variation1.product)  ">
              {{ item.variation1.product.name }}
            </h1>
            <v-spacer></v-spacer>

            <h1 v-if="Boolean(item.variation1.colors)">
              {{ item.variation1.variation_type.value }}
              {{ item.variation1.colors }}
            </h1>
            <h1 v-else>
              {{ item.variation1.variation_type.value }}
              {{ item.variation1.value }}
            </h1>
            <v-spacer></v-spacer>

            <h1>
                {{ item.variation2.variation_type.value }}
                {{ item.variation2.value }}
            </h1>
            <v-spacer></v-spacer>

            <h1>
                {{ item.variation3.variation_type.value }}
                {{ item.variation3.value }}
            </h1>

            <v-spacer></v-spacer>
            <v-btn @click="deletVar(index)" small icon>
              <v-icon small> delete </v-icon>
            </v-btn>
            <v-col cols="12" class="ma-0 pa-0 my-2">
              <v-divider></v-divider>
              <v-divider></v-divider>
            </v-col>
            <v-col
              cols="12"
              class="d-flex justify-center align-center pa-0 ma-0 mt-3"
            >
              <h1>قیمت محصول {{ $price(item.price) }}ریال</h1>
              <v-spacer></v-spacer>
              <v-chip small @click="addNumber(item, true, 'list')">
                <h1 class="font_17">+</h1>
              </v-chip>
              <h1 class="font_18 mx-3">
                {{ item.count }}
              </h1>
              <v-chip
                small
                :disabled="item.count == 1"
                @click="addNumber(item, false, 'list')"
              >
                <h1 class="font_17">-</h1>
              </v-chip>
              <v-spacer></v-spacer>

              <h1>جمع کل : {{ $price(item.price * item.count) }} ریال</h1>
            </v-col>
          </v-row>
        </v-card-text>
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
    productVarcoms: {
      default: [],
      require: true,
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

          if (Boolean(product)) {
            this.selected_product = product;
            this.main_price;
            let price = product.price ? product.price : this.main_price;
            this.main_price = price;
            this.sumb_price = price;
          }
        });
      }
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
console.log("sddsdssd");
console.log("sddsdssd");

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
      let dublicate_variations = this.variations_list.find(
        (f) => f.id == this.selected_product.id
      );

      if (Boolean(dublicate_variations)) {
        this.$toast.info("این محصولا قبلا اضافه شده");
      } else {
        this.selected_product["count"] = this.number;
        this.variations_list.push(this.selected_product);
        this.number = 1;
        this.step_var_1 = false
        this.step_var_2 = false
        this.step_var_3 = false
        this.product_varcomb_id = "";
        this.$toast.success(" محصول  اضافه شد");
      }
    },
    deletVar(key) {
      let items = this.variations_list;
      items.splice(key, 1);
      this.variations_list = items;
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
        .catch((rej) => {});
    },
  },
};
</script>

<style scoped>
h1{
  font-size: 13px !important;
}
.card-style{
  border: 1px solid #0000002d;
  border-radius: 7px;
}

</style>

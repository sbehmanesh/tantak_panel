<template>
  <v-dialog
    persistent
    v-model="DialogAdd.show"
    :model-id="DialogAdd.items"
    width="850"
  >
    <v-card style="overflow: hidden">
      <v-row class="primary pt-5 mb-6 pb-2 px-4">
        <span class="white--text mt-1 font_16 mr-3">
          افزودن محصول به سبد خرید
        </span>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">
          <v-icon color="white"> close </v-icon>
        </v-btn>
      </v-row>
      <v-tabs>
        <v-row class="d-flex justify-center">
          <v-tab>
            <h1>ثبت محصول</h1>
          </v-tab>
          <v-tab>
            <h1>خرید پکیجی</h1>
          </v-tab>
        </v-row>

        <v-tab-item>
          <v-row class="d-flex justify-center mt-4">
            <v-col cols="10">
              <v-autocomplete
                prepend-inner-icon="shopping_basket"
                v-model="product_varcomb_id"
                :items="products"
                outlined
                dense
                :disabled="Boolean(load_item)"
                :loading="Boolean(load_item)"
                label="جستو جوی سریع محصول"
                placeholder="نام محصول مورد نظر را وارد کنید ..."
              />
            </v-col>
            <v-col
              v-if="Boolean(check) && !loading"
              class="justify-center text-center mb-10"
              cols="4"
            >
              <v-icon color="red" size="80">
                production_quantity_limits
              </v-icon>
              <br />
              <small class="red--text"> عدم موجودی محصول </small>
            </v-col>
            <v-row
              v-if="Boolean(step_var_1) && Boolean(product_sort_1) && !loading"
              class="d-flex justify-center pa-10"
            >
              <v-col cols="12" md="10">
                <v-form v-model="valid_variations">
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      v-if="Boolean(step_var_1) && Boolean(product_sort_1)"
                    >
                      <amp-select
                        :text="product_sort_1.title"
                        rules="require"
                        v-model="var_id_1"
                        :items="product_sort_1.items"
                        :loading="loading"
                        :disabled="loading"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      v-if="Boolean(step_var_2) && Boolean(product_sort_2)"
                    >
                      <amp-select
                        :text="product_sort_2.title"
                        rules="require"
                        v-model="var_id_2"
                        :items="available_items_2"
                        :loading="loading"
                        :disabled="!Boolean(var_id_1) || loading"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      v-if="Boolean(step_var_3) && Boolean(product_sort_3)"
                    >
                      <amp-select
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
              </v-col>
              <v-col cols="10" v-if="product_varcomb_id">
                <v-row class="d-flex justify-center align-center">
                  <v-col cols="12" md="2" calss="pa-3">
                    <v-img
                      calss="pa-3"
                      :src="$getImage(main_image)"
                      height="auto"
                    />
                  </v-col>

                  <v-col class="text-center pt-11" cols="4" md="3">
                    <span
                      >قیمت محصول : {{ $price(main_price) }}
                      <small> ریال </small>
                    </span>
                  </v-col>
                  <v-col class="text-center pt-11" cols="4" md="3">
                    <span>
                      مجموع قیمت : {{ $price(sumb_price) }}
                      <small> ریال </small>
                    </span>
                  </v-col>

                  <v-col class="text-center pt-8" cols="2">
                    <v-row class="d-flex justify-center py-5">
                      <v-btn text @click="addNumber(number, true)" x-small>
                        <h1 class="font_18 primary--text mt-2 mx-1">+</h1>
                      </v-btn>
                      <h1 class="font_14 primary--text mt-1 mx-1">
                        {{ number }}
                      </h1>
                      <v-btn
                        color="primary"
                        :disabled="number == 1"
                        @click="addNumber(number, false)"
                        text
                        x-small
                      >
                        <h1 class="font_20 primary--text mb-2 mx-1">_</h1>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-col cols="12" v-if="!Boolean(check) && !loading">
              <v-row class="d-flex justify-center my-6">
                <amp-button
                  v-if="product_varcomb_id"
                  icon="add_shopping_cart"
                  height="40"
                  @click="addBasket()"
                  color="orange darken-3 "
                  text="افزودن به سبد "
                  :disabled="!valid_variations || loading"
                />
              </v-row>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center" v-if="loading">
            <v-col cols="10">
              <v-skeleton-loader
                v-bind="attrs"
                type="text@2"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="10">
              <v-row>
                <v-col cols="4">
                  <v-skeleton-loader
                    v-bind="attrs"
                    type="text@2"
                  ></v-skeleton-loader>
                </v-col>
                <v-col cols="4">
                  <v-skeleton-loader
                    v-bind="attrs"
                    type="text@2"
                  ></v-skeleton-loader>
                </v-col>
                <v-col cols="4">
                  <v-skeleton-loader
                    v-bind="attrs"
                    type="text@2"
                  ></v-skeleton-loader>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row class="d-flex justify-center mt-4">
            <v-col cols="10">
              <v-autocomplete
                prepend-inner-icon="playlist_add_check"
                v-model="selected_package_id"
                :items="package_list"
                outlined
                dense
                :disabled="Boolean(load_item)"
                :loading="Boolean(load_item)"
                label="جستو جوی  پکیج"
                placeholder="نام پکیچ مورد نظر را وارد کنید ..."
              />
            </v-col>
            <v-col cols="10">
              <v-row v-if="Boolean(selected_package_id)" class="mb-2">
                <v-col cols="8">
                  <v-row>
                    <v-col cols="12">
                      <span>
                        قیمت پکیج : {{ $price(informations_package.price) }}
                      </span>
                      <small> ( ریال) </small>
                    </v-col>
                    <v-col cols="12">
                      <span>
                        پیش پرداخت :
                        {{ $price(informations_package.prepay_amount) }}

                        <small> (درصد / ریال) </small>
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <span>
                        تخفیف:
                        {{ $price(informations_package.discount_amount) }}
                        <small> (درصد / ریال) </small>
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <span>
                        وزن: {{ informations_package.weight }}
                        <small> ( گرم) </small>
                      </span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="4">
                  <v-col cols="12" md="12" calss="pa-3">
                    <v-img
                      calss="pa-3"
                      :src="$getImage(informations_package.logo)"
                      height="auto"
                    />
                  </v-col>

                  <v-col cols="12" md="12" calss="mt-4">
                    <v-row class="d-flex justify-center px-5">
                      <v-btn text @click="addCountPackage(true)" x-small>
                        <h1 class="font_18 primary--text mt-2 mx-1">+</h1>
                      </v-btn>
                      <h1 class="font_14 primary--text mt-1 mx-1">
                        {{ informations_package.count }}
                      </h1>
                      <v-btn
                        color="primary"
                        :disabled="informations_package.count == 1"
                        @click="addCountPackage(false)"
                        text
                        x-small
                      >
                        <h1 class="font_20 primary--text mb-2 mx-1">_</h1>
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-col>
                <v-col cols="12">
                  <amp-button
                    block
                    height="40"
                    :disabled="
                      !Boolean(selected_package_id) || load_item || loading
                    "
                    icon="add"
                    class="my-1"
                    color="orange darken-4"
                    text="افزودن به سبد"
                    @click="addPackage()"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    DialogAdd: {
      require: false,
      default: false,
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
    informations_package: {},
    product_sort_2: [],
    product_sort_3: [],
    products: [],
    package_list: [],
    available_items_2: [],
    available_items_3: [],
    variations_Product: [],
    var_products: [],
    all_variatons_product: [],
    list_basket: [],
    parent_2: "",
    selected_package_id: "",
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
    this.loadPackages();
  },
  watch: {
    selected_package_id() {
      this.loadInfoPackages(this.selected_package_id);
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
      this.product_sort_2.items.filter((x) => {
        if (x.parent == this.var_id_1) {
          items.push({
            text: x.text,
            value: x.value,
          });
        }
      });
      this.available_items_2 = items;
      this.var_id_2 = "";
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
      this.var_id_3 = "";
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
          this.main_price;
          let price = product.price ? product.price : this.main_price;
          this.main_price = price;
          this.sumb_price = price;
        });
      }
    },
  },
  methods: {
    addPackage() {
      this.$emit("createList", this.informations_package);
      this.closeDialog();
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/list-by-personnel", { row_number: 50000 })
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
    loadPackages() {
      this.load_item = true;
      this.$reqApi("/package", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.package_list = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },

    loadInfoPackages(package_id) {
      this.load_item = true;
      this.$reqApi("/package/show", { id: package_id })
        .then((response) => {
          // count: x.number,
          //     discount_amount: x.package.discount_amount,
          //     id: x.id,
          //     logo: x.package.logo,
          //     name: x.information,
          //     licence_break: access_barck,
          //     prepay_amount: x.package.prepay_amount,
          //     price: x.price,
          //     weight: x.weight,
          //     discount_type: x.package.discount_type,
          //     product_varcoms: x.package.product_varcoms,

          const res = response.data;
          let items = {};
          items["prepay_amount"] = res.prepay_amount;
          items["name"] = res.name;
          items["price"] = res.price;
          items["licence"] = res.licence_break;
          items["discount_amount"] = res.discount_amount;
          items["weight"] = res.weight;
          items["logo"] = res.logo;
          items["id"] = res.id;
          items["discount_type"] = res.discount_type;
          items["product_varcoms"] = res.product_varcoms;
          items["roles"] = res.roles;
          items["count"] = 1;
          items["users"] = res.users;
          this.informations_package = items;
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
         ///*******get price
          this.main_price =
            response.model.data[0].variation1.product.base_price;
          this.sumb_price = this.main_price;

          ///*******get price
    

          // *******set items variations
          let items_var_1 = [];
          let items_var_2 = [];
          let items_var_3 = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const element = response.model.data[index];

            if (Boolean(this.step_var_1)) {
              items_var_1.push({
                text: element.variation1.value,
                value: element.variation1.id,
              });
            }

            if (Boolean(this.step_var_2)) {
              items_var_2.push({
                text: element.variation2.value,
                value: element.variation2.id,
                parent: element.variation_1_id,
              });
            }
            if (Boolean(this.step_var_3)) {
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
    addNumber(numb, add) {
      if (Boolean(add)) {
        numb++;
        let price = this.main_price;
        let main_price = "";
        main_price = price * numb;
        this.sumb_price = main_price;
      } else {
        numb--;
        this.sumb_price = this.sumb_price - this.main_price;
      }

      this.number = numb;
    },
    addCountPackage(add) {
      if (Boolean(add)) {
        this.informations_package.count += 1;
      } else {
        this.informations_package.count -= 1;
      }
    },
    closeDialog() {
      this.DialogAdd.show = false;
      this.DialogAdd.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    addBasket() {
      let product = {};
      product = {
        id: this.selected_product.id,
        name: this.product_name,
        product: this.selected_product,
        number: this.number,
      };
      this.$emit("add", product);
      this.closeDialog();
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
          console.log(rej);
        });
    },
  },
};
</script>

<style></style>

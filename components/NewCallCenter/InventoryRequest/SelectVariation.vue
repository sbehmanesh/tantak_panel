<template>
  <div>
    <v-col cols="12">
      <v-row cols="12" class="center-div mt-1">
        <v-chip
          dark
          label
          class="ma-2 px-3"
          color="teal"
          v-for="item in items"
          :key="item.key"
          @click="tab = item.key"
          :outlined="tab != item.key"
        >
          <span class="font_16">
            {{ item.text }}
          </span>
          <v-icon class="mr-1">
            {{ item.icon }}
          </v-icon>
        </v-chip>
      </v-row>
    </v-col>
    <v-row class="d-flex justify-center align-center" v-if="tab == 'products'">
      <v-col cols="12" md="12" class="mt-8 px-4">
        <v-autocomplete
          v-if="
            this.$store.state.auth.action.indexOf('product_requests/update') >
            -1
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
            <v-col cols="12" md="3">
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
            <v-col cols="12" md="3">
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
            <v-col cols="12" md="3">
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
            <v-col cols="12" md="3">
              <amp-button
                v-if="
                  Boolean(step_var_1) &&
                  Boolean(product_sort_1) &&
                  Boolean(product_varcomb_id)
                "
                block
                height="40"
                :disabled="
                  !Boolean(valid_variations) ||
                  !Boolean(product_varcomb_id) ||
                  loading
                "
                class="mt-7"
                color="orange darken-4"
                text="افزودن"
                @click="addVariation()"
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
          </v-col>
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
      <v-col cols="12" md="12">
        <v-card
          v-for="(item, index) in variations_list"
          :key="index"
          class="mx-3"
        >
          <v-alert dense outlined color="grey darken-1">
            <v-row class="align-center">
              <v-col cols="2" class="text-end">
                {{ index + 1 }} -
                <v-avatar size="55">
                  <img :src="$getImage(item.variation1.product.main_image)" />
                </v-avatar>
              </v-col>
              <v-col cols="3" class="text-end">
                <h1 class="mr-3">
                  {{ item.variation1.product.name }}
                </h1>
              </v-col>
              <v-col cols="4" class="text-center">
                <h1>
                  {{ item.variation1.value }} / {{ item.variation2.value }} /
                  {{ item.variation3.value }}
                </h1>
              </v-col>
              <v-col cols="3" md="2" class="text-center">
                <v-row class="d-flex justify-center">
                  <v-btn text @click="addNumber(item, true, 'list')" x-small>
                    <h1 class="font_18 mx-1 mt-1">+</h1>
                  </v-btn>
                  <h1 class="font_14 mx-1">
                    {{ item.count }}
                  </h1>
                  <v-btn
                    :disabled="item.count == 1"
                    @click="addNumber(item, false, 'list')"
                    text
                    x-small
                  >
                    <h1 class="font_20 mx-1">-</h1>
                  </v-btn>
                </v-row>
              </v-col>
              <v-col cols="1" class="text-start">
                <v-btn @click="deletVar(index)" text icon>
                  <v-icon color=""> cancel </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-card>
      </v-col>

      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10"> </v-col>
      </v-row>
    </v-row>
    <v-row
      class="d-flex justify-center align-center mt-2"
      v-if="tab == 'packages'"
    >
      <v-col cols="12">
        <v-autocomplete
          v-if="
            this.$store.state.auth.action.indexOf('product_requests/update') >
            -1
          "
          class="mx-2"
          prepend-inner-icon="search"
          v-model="package_id"
          :items="packages_list"
          outlined
          dense
          :disabled="Boolean(loading_package)"
          :loading="Boolean(loading_package)"
          label="جستوجوی پکیج "
          placeholder="نام پکیج مورد نظر را وارد کنید ..."
        />
      </v-col>
      <v-row
        v-if="Boolean(package_id) && Object.keys(selected_package).length > 0"
        class="pa-4"
      >
        <v-col cols="12">
          <v-card outlined class="elevation-2" >
            <v-card class="d-flex align-center pa-3 elevation-0" >
              <v-col cols="12" md="6">
                <v-row class="align-center">
                  <v-avatar size="50" class="mx-2">
                    <img :src="$getImage(selected_package.logo)" />
                  </v-avatar>
                  <h1>
                    {{ selected_package.text }}
                    <br />
                    <small v-if="Boolean(selected_package.description)">
                      # {{ selected_package.description }}
                    </small>
                  </h1>
                </v-row>
              </v-col>
              <v-col
                md="6"
                class="text-end"
                v-if="
                  selected_package.products &&
                  selected_package.products.length > 0
                "
                cols="12"
              >
                <h1>محصولات موجود در پکیج :</h1>
                <div
                  v-for="(item, index) in selected_package.products"
                  :key="index"
                >
                  <small v-if="item.product">
                    <v-icon class="mx-1"> arrow_left </v-icon>
                    {{ item.product.name }} :
                    {{ item.product_variation_1.value }} /
                    {{ item.product_variation_2.value }} /
                    {{ item.product_variation_3.value }}
                  </small>
                  <br />
                </div>
              </v-col>
            </v-card>
            <v-col cols="12" class="text-center">
              <amp-button text="افزودن پکیج" height="37"  @click="addPackage" />
            </v-col>
          </v-card>
        </v-col>
      </v-row>
      <v-col
        cols="12"
        v-if="list_selected_packages.length > 0"
        v-for="(pack, index) in list_selected_packages"
        :key="index"
      >
        <v-card>
          <v-alert dense outlined color="grey darken-1">
            <v-row class="align-center">
              <v-col cols="2" class="text-end">
                {{ index + 1 }} -
                <v-avatar size="55">
                  <img :src="$getImage(pack.logo)" />
                </v-avatar>
              </v-col>
              <v-col cols="3" class="text-end">
                <h1 class="mr-3">
                  {{ pack.text }}
                </h1>
              </v-col>
              <v-col
                cols="4"
                class="text-end"
                v-if="pack.products && pack.products.length > 0"
              >
                <div v-for="(item, index) in pack.products" :key="index">
                  <small v-if="item.product">
                    <v-icon class="mx-1"> arrow_left </v-icon>
                    {{ item.product.name }}
                  </small>
                  <br />
                </div>
              </v-col>
              <v-col cols="3" md="2" class="text-center">
                <v-row class="d-flex justify-center">
                  <v-btn
                    text
                    @click="addNumberPack(pack, true, 'list')"
                    x-small
                  >
                    <h1 class="font_18 mx-1 mt-1">+</h1>
                  </v-btn>
                  <h1 class="font_14 mx-1">
                    {{ pack.count }}
                  </h1>
                  <v-btn
                    :disabled="pack.count == 1"
                    @click="addNumber(pack, false, 'list')"
                    text
                    x-small
                  >
                    <h1 class="font_20 mx-1">-</h1>
                  </v-btn>
                </v-row>
              </v-col>
              <v-col cols="1" class="text-start">
                <v-btn @click="deletPack(index)" text icon>
                  <v-icon color=""> cancel </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </div>
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
    e1: 2,
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    tab: "products",
    items: [
      { text: "محصول", key: "products", icon: "local_mall" },
      { text: "پکیج ", key: "packages", icon: "bento" },
    ],
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
    list_selected_packages: [],
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
    this.loadPackages();
    if (Boolean(this.basketId)) {
      this.loadItems();
    }
  },
  watch: {
    package_id() {
      if (Boolean(this.package_id)) {
        let selected_package = this.packages_list.find(
          (f) => f.value == this.package_id
        );
        if (Boolean(selected_package)) {
          this.selected_package = selected_package;
        }
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
    loadItems() {
      this.$reqApi("product-request/show", { id: this.basketId })
        .then((res) => {
          this.$emit("data", res.data);
          let data = res.data.items;

          let packages = [];
          let item = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];

            if (x.section_name == "Package") {
              let sub_product = JSON.parse(x.product_json);
              let new_data = [];
              for (let index = 0; index < sub_product.length; index++) {
                const element = sub_product[index];
                element["product"] = {};
                element.product["name"] = element.name;
                new_data.push(element);
              }

              packages.push({
                text: x.information,
                value: x.section_id,
                products: new_data,
                logo: x.package.logo,
                count: x.number,
              });
            } else if (x.section_name == "ProductVariationCombination") {
              item.push({
                count: x.number,
                variation1: x.pro_var_com.variation1,
                variation2: x.pro_var_com.variation2,
                variation3: x.pro_var_com.variation3,
                id: x.pro_var_com.id,
              });
            }
          }

          this.variations_list = item;
          this.list_selected_packages = packages;

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
    loadPackages() {
      this.loading_package = true;
      this.$reqApi("/package", { row_number: 50000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
              products: x.product_varcoms,
              description: x.description,
              logo: x.logo,
              count: 1,
            });
          }
          this.packages_list = items;
          this.loading_package = false;
        })
        .catch((error) => {
          this.loading_package = false;
        });
    },
    addVariation() {
      if (Array.isArray(this.variations_list)) {
        let check = this.variations_list.find(
          (f) => f.id == this.selected_product.id
        );
        if (Boolean(check)) {
          this.$toast.info("این محصولا قبلا اضافه شده");
          return;
        } else {
          this.selected_product["count"] = this.number;
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
        }
      }
    },
    deletVar(key) {
      let items = this.variations_list;
      items.splice(key, 1);
      this.variations_list = items;
    },
    deletPack(key) {
      let items = this.list_selected_packages;
      items.splice(key, 1);
      this.list_selected_packages = items;
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
          console.log(rej);
        });
    },

    addPackage() {
      if (this.list_selected_packages.length == 0) {
        this.list_selected_packages.push(this.selected_package);
        this.package_id = "";
        this.selected_package = {};
      } else {
        let dublicate = this.list_selected_packages.find(
          (f) => f.value == this.selected_package.value
        );
        if (Boolean(dublicate)) {
          this.$toast.info(`پکیج قبلا اضافه شده`);
        } else {
          this.list_selected_packages.push(this.selected_package);
          this.$toast.success(`پکیج  اضافه  شد`);
          this.package_id = "";
          this.selected_package = {};
        }
      }
    },
    addNumberPack(item, add) {
      if (Boolean(item)) {
        if (Boolean(add)) {
          item.count++;
        } else {
          item.count--;
        }
      }
    },
    callSubmit() {
      let form = {};
      if (
        this.variations_list &&
        Array.isArray(this.variations_list) &&
        this.variations_list.length > 0
      ) {
        let items = [];
        for (let index = 0; index < this.variations_list.length; index++) {
          const element = this.variations_list[index];
          items.push({
            id: element.id,
            count: element.count,
          });
        }
        form["product_varcom_ids"] = items;
      }
      if (this.list_selected_packages.length > 0) {
        let packages = [];
        for (
          let index = 0;
          index < this.list_selected_packages.length;
          index++
        ) {
          const element = this.list_selected_packages[index];
          packages.push({
            id: element.value,
            count: element.count,
          });
        }
        form["package_ids"] = packages;
      }
      if (
        this.list_selected_packages.length > 0 ||
        this.variations_list.length > 0
      ) {
        let url = this.basketId
          ? "product-request/update"
          : "product-request/insert";

        if (Boolean(this.basketId)) {
          form["id"] = this.basketId;
        }
        this.$reqApi(url, form).then((res) => {
          this.$emit("submit", true);
          if (Boolean(this.basketId)) {
            this.$toast.success("اطلاعات با موفقیت ویرایش شد");
          } else {
            this.$toast.success("درخواست با موفقیت ثبت شد");
          }
        });
      } else {
        this.$toast.error("موردی انتخواب نشده !");
      }
    },
  },
};
</script>

<style></style>

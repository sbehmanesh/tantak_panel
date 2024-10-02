<template>
  <div border="left" text>
    <v-row class="d-flex justify-center align-center">

      <v-col cols="12" md="12">
        <div v-for="(item, index) in variations_list" :key="index" class="mx-3">
          <v-alert dense border="left" outlined  color="grey darken-1">
            <v-row class="align-center">
              <v-col cols="2" class="text-end">
                {{ index + 1 }} -
                <v-avatar  size="55">
                  <img
                    :src="$getImage(item.variation1.product.main_image)"
                  />
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
        </div>
      </v-col>

      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10"> </v-col>
      </v-row>
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
          this.$emit("data" ,res.data )
          let data = res.data.items;
          let item = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            item.push({
              count: x.number,
              variation1: x.pro_var_com.variation1,
              variation2: x.pro_var_com.variation2,
              variation3: x.pro_var_com.variation3,
              id: x.pro_var_com.id,
            });
          }
          this.variations_list = item;
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
        }
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
        .catch((rej) => {
          console.log(rej);
        });
    },
    callSubmit() {
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
        let url = this.basketId
          ? "product-request/update"
          : "product-request/insert";
        let form = {};
        form["product_varcom_ids"] = items;
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
        this.$toast.error("محصولی انتخاب نشده");
      }
    },
  },
};
</script>

<style></style>

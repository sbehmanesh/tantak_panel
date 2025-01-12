<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel class="expan-style">
        <v-expansion-panel-header>
          <h1 class="font_17">جوایز جشنواره</h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row class="d-flex align-center justify-center">
            <v-col cols="12" md="4">
              <amp-autocomplete
                text="انتخاب محصول"
                :items="products"
                v-model="product_id"
              />
            </v-col>
            <v-col cols="12" md="4">
              <amp-autocomplete
                text="انتخاب پکیج"
                :items="package"
                v-model="package_id"
              />
            </v-col>
            <v-col cols="3">
              <amp-button text="تایید" color="green" @click="addItem" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" v-for="(x, i) in list_item" :key="i">
              <v-card
                style="border-right: 3px solid orange"
                outlined
                class="d-flex elevation-1 px-4 align-center"
              >
                <h1>{{ i + 1 }} - {{ x.text }}</h1>
                <v-spacer></v-spacer>
                <v-col cols="4">
                  <amp-input
                    text="تعداد"
                    cClass="ltr-item"
                    rules="number"
                    v-model="x.number"
                  />
                </v-col>
                <v-spacer></v-spacer>
                <v-btn icon @click="deleteItem(i)">
                  <v-icon size=""> delete</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: {
    package: {
      default: [],
      type: Array,
    },
    products: {
      default: [],
      type: Array,
    },
    loadItems: {
      default: () => ({}),
      type: Object,
    },
  },
  data: () => ({
    step: 1,
    package_id: "",
    product_id: "",
    list_item: [],
    packages_items: [],
    packages_items: [],
  }),
  mounted() {
    if (Object.keys(this.loadItems).length > 0) {
      if (this.loadItems.packages && this.loadItems.packages.length > 0) {
        this.loadItems.packages.map((x) => {
          this.list_item.push({
            number: x.number,
            is_pack: true,
            text: x.name,
            value: x.id,
          });
        });
      }if (this.loadItems.products && this.loadItems.products.length > 0) {
        this.loadItems.products.map((x) => {
          this.list_item.push({
            number: x.number,
            is_pack: false,
            text: x.name,
            value: x.id,
          });
        });
      }
    }
  },
  methods: {
    addItem() {
      console.log("this.product_id", this.product_id, this.list_item);
      // console.log("this.package_id", this.package_id);

      let selected_item_pack = {};
      let selected_item_product = {};
      let dublicate_pack = {};
      let dublicate_product = "";

      // ---------------------------------------------------------------------
      if (this.product_id) {
        dublicate_product = this.list_item.find(
          (x) => x.value == this.product_id
        );
        console.log(dublicate_product);

        if (Boolean(dublicate_product)) {
          this.$toast.info(`محصول  ${dublicate_product.text} قبلا اضافه شده`);
          this.product_id = "";
          selected_item_product = {};
        }
      }

      // ---------------------------------------------------------------------

      if (this.package_id) {
        dublicate_pack = this.list_item.find((x) => x.value == this.package_id);
        if (Boolean(dublicate_pack) && Object.keys(dublicate_pack).length > 0) {
          this.$toast.info(`پکیچ  ${dublicate_pack.text} قبلا اضافه شده`);
          this.package_id = "";
          dublicate_pack = {};
          selected_item_pack = {};
        }
      }
      // ---------------------------------------------------------------------

      if (Boolean(this.package_id)) {
        selected_item_pack = this.package.find(
          (x) => x.value == this.package_id
        );
        selected_item_pack["is_pack"] = true;
      }
      // ---------------------------------------------------------------------

      if (Boolean(this.product_id)) {
        selected_item_product = this.products.find(
          (y) => y.value == this.product_id
        );
        selected_item_product["is_pack"] = false;
      }

      if (
        Boolean(selected_item_pack) &&
        Object.keys(selected_item_pack).length > 0
      ) {
        selected_item_pack["number"] = "1";
        this.list_item.push(selected_item_pack);
        this.package_id = "";
        selected_item_pack = {};
      }

      if (
        Boolean(selected_item_product) &&
        Object.keys(selected_item_product).length > 0
      ) {
        selected_item_product["number"] = "1";
        this.list_item.push(selected_item_product);
        this.product_id = "";
        selected_item_product = {};
      }
    },
    deleteItem(index) {
      let items = this.list_item;
      items.splice(index, 1);
    },
    callSubmit() {
      let products = [];
      let packages = [];
      this.list_item.map((x) => {
        if (Boolean(x.is_pack)) {
          packages.push({
            id: x.value,
            number: x.number,
          });
        } else {
          products.push({
            id: x.value,
            number: x.number,
          });
        }
      });
      this.$emit("selectedIItems", {
        products: products,
        packages: packages,
      });
    },
  },
};
</script>
<style scoped>
.expan-style {
  border: 1px solid rgba(26, 25, 25, 0.473) !important;
  border-radius: 15px;
  background-color: rgb(252, 244, 234) !important;
}
</style>

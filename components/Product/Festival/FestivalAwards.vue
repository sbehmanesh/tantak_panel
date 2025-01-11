<template>
  <div>
    <v-expansion-panels >
      <v-expansion-panel class="expan-style">
        <v-expansion-panel-header>
          <h1 class="font_17">جوایز جشنواره</h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-col
            cols="12"
            class="d-flex text-cenetr align-center justify-center"
          >
            <v-btn
              :color="step == 1 ? 'blue-grey' : ''"
              @click="step--"
              class="mx-3"
            >
              <h1 :class="step == 1 ? 'white--text' : ''">محصولات</h1>
            </v-btn>
            <v-btn
              :color="step == 2 ? 'blue-grey' : ''"
              @click="step++"
              class="mx-3"
            >
              <h1 :class="step == 2 ? 'white--text' : ''">پکیج ها</h1>
            </v-btn>
          </v-col>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-col cols="12" md="12" class="mt-4">
                <Products
                  :basketId="basketId"
                  @data="getData($event, 'product')"
                />
              </v-col>
            </v-window-item>

            <v-window-item :value="2">
              <v-col cols="12" md="12">
                <Packages
                  :basketId="basketId"
                  @data="getData($event, 'package')"
                />
              </v-col>
            </v-window-item>
          </v-window>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import Packages from "@/components/NewCallCenter/AddToBasket/Packages.vue";
import Products from "@/components/NewCallCenter/AddToBasket/Products.vue";
export default {
  components: { Packages, Products },
  props: {
    package: {
      default: [],
      type: Array,
    },
    products: {
      default: [],
      type: Array,
    },
  },
  data: () => ({
    step: 1,
    package_id: "",
    product_id: "",
    packages_items: [],
    packages_items: [],
  }),
  methods: {
    getData(data, type) {
      if (type == "package") {
        this.packages_items = data;
      } else if (type == "product") {
        this.products_items = data;
      }
    },
    callSubmit() {
      let products = [];
      let packages = [];
      this.packages_items.map((x) => {
        packages.push({
          id: x.value,
          number: x.count,
        });
      });
      this.products_items.map((x) => {
        products.push({
          id: x.id,
          number: x.count,
        });
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

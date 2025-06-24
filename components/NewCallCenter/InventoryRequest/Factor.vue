<template>
  <v-dialog v-model="dialog" width="800" persistent>
    <v-card :disabled="isLoading" class="pa-5">
      <v-card style="overflow: hidden" class="border-card elevation-3">
        <div class="pa-10">
          <v-row>
            <v-col cols="12" class="ma-0 pa-0">
              <v-card class="elevation-0 pa-3 text-center rounded-0" outlined>
                <strong>
                  نمای کلی سفارش
                  <br />

                  بدون اعمال تخفیف مجموع کل سفارش
                  {{
                    this.$price(
                      total_packages_price +
                        total_products_price +
                        total_boxes_price
                    )
                  }}
                  ریال
                </strong>
              </v-card>
            </v-col>
            <v-col cols="4" class="ma-0 pa-0">
              <v-card class="text-center pa-3 elevation-0 rounded-0" outlined>
                <v-icon color="green darken-1"> task_alt </v-icon>
                <h1>
                  <small> تعداد محصولات : {{ total_products }}</small>

                  <br />
                  <small>
                    مجموع قیمت :
                    {{ $price(total_products_price) }} ریال
                  </small>
                  <br />
                  <small class="grey--text">
                    مجموع درصد تخفیف : بدون تخفیف
                  </small>
                </h1>
              </v-card>
            </v-col>
            <v-col cols="4" class="ma-0 pa-0">
              <v-card class="text-center elevation-0 pa-3 rounded-0" outlined>
                <v-icon color="green darken-1" v-if="total_packages > 0">
                  task_alt
                </v-icon>
                <v-icon color="red darken-1" v-else> close </v-icon>
                <h1>
                  <small> تعداد پکیج : {{ total_packages }}</small>

                  <br />
                  <small>
                    مجموع قیمت :
                    {{ $price(total_packages_price) }} ریال
                  </small>
                  <br />
                  <small class="grey--text" v-if="packages.length > 0">
                    مجموع درصد تخفیف :
                    {{
                      (
                        ((total_packages_price - discount_package) /
                          total_packages_price) *
                        100
                      ).toFixed(2)
                    }}
                    %
                  </small>
                  <small v-else class="grey--text">
                    مجموع درصد تخفیف : بدون تخفیف
                  </small>
                </h1>
              </v-card>
            </v-col>
            <v-col cols="4" class="ma-0 pa-0">
              <v-card class="text-center elevation-0 pa-3 rounded-0" outlined>
                <v-icon color="green darken-1" v-if="total_boxes > 0">
                  task_alt
                </v-icon>
                <v-icon color="red darken-1" v-else> close </v-icon>
                <h1>
                  <small> تعداد جعبه : {{ total_boxes }}</small>

                  <br />
                  <small>
                    مجموع قیمت :
                    {{ $price(total_boxes_price) }} ریال
                  </small>
                  <br />

                  <small v-if="boxes.length > 0" class="grey--text">
                    مجموع درصد تخفیف :
                    {{
                      (
                        ((total_boxes_price - discount_box) /
                          total_boxes_price) *
                        100
                      ).toFixed(2)
                    }}
                    %
                  </small>
                  <small v-else class="grey--text">
                    مجموع درصد تخفیف : بدون تخفیف
                  </small>
                </h1>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              class="ma-0 pa-0"
              v-if="packages.length > 0 || boxes.length > 0"
            >
              <v-card
                class="elevation-0 pa-3 text-center rounded-0 grey lighten-2"
                outlined
              >
                <strong>
                  قیمت پس از مصاحبه تخفیف
                  {{
                    this.$price(
                      discount_box + total_products_price + discount_package
                    )
                  }}
                  ریال
                </strong>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-col cols="12" class="ma-0 pa-0 mt-6">
              <div class="mt-5 d-flex" v-if="products.length > 0">
                <v-card
                  outlined
                  class="elevation-1 d-flex ma-0 px-2 align-center rounded-0"
                >
                  <h1>محصول</h1>
                </v-card>
                <v-col cols="11" class="ma-0 pa-0">
                  <v-card
                    outlined
                    class="elevation-1 d-flex ma-0 py-2 align-center rounded-0"
                    v-for="(product, index) in products"
                    :key="`product_${index}`"
                  >
                    <v-avatar size="33" class="mr-2">
                      <v-img
                        :src="$getImage(product.variation1.product.main_image)"
                      />
                    </v-avatar>
                    <v-spacer></v-spacer>
                    <small>
                      {{ product.variation1.product.name }} (
                      {{ product.count }} عدد)
                    </small>
                    <v-spacer></v-spacer>

                    <small> {{ $price(product.product_price) }} ریال </small>
                    <v-spacer></v-spacer>
                    <small>
                      جمع مبلغ
                      {{ $price(product.product_price * product.count) }} ریال
                    </small>
                    <v-spacer></v-spacer>

                    <!-- <v-col cols="12" md="3" class="ma-0 pa-0">
                    <small v-if="product.variation1.codes">
                  {{ product.variation1.variation_type.value }}
                  {{ product.variation1.colors }}
                </small>            
                    <small v-else>
                  {{ product.variation1.variation_type.value }}
                  {{ product.variation1.value }}
                </small>
                <br>
                <small >
                  {{ product.variation2.variation_type.value }}
                  {{ product.variation2.value }}
                </small>          
                      <br>
                <small >
                  {{ product.variation3.variation_type.value }}
                  {{ product.variation3.value }}
                </small>
                  </v-col > -->
                  </v-card>
                </v-col>
              </div>

              <div class="mt-5 d-flex" v-if="packages.length > 0">
                <v-card
                  outlined
                  class="elevation-1 d-flex ma-0 px-4 align-center rounded-0"
                >
                  <h1>پکیج</h1>
                </v-card>
                <v-col cols="11" class="ma-0 pa-0">
                  <v-card
                    outlined
                    class="elevation-1 d-flex ma-0 py-2 align-center rounded-0"
                    v-for="(pack, index) in packages"
                    :key="`pack_${index}`"
                  >
                    <v-avatar size="33" class="mr-2">
                      <v-img :src="$getImage(pack.logo)" />
                    </v-avatar>
                    <v-spacer></v-spacer>
                    <small> {{ pack.text }} ( {{ pack.count }} عدد) </small>

                    <v-spacer></v-spacer>
                    <small> {{ $price(pack.discount_value) }} ریال </small>
                    <v-spacer></v-spacer>
                    <small>
                      جمع مبلغ
                      {{ $price(pack.discount_value * pack.count) }} ریال
                    </small>
                    <v-spacer></v-spacer>
                  </v-card>
                </v-col>
              </div>
              <div class="mt-5 d-flex" v-if="boxes.length > 0">
                <v-card
                  outlined
                  class="elevation-1 d-flex ma-0 px-4 align-center rounded-0"
                >
                  <h1>جعبه</h1>
                </v-card>
                <v-col cols="11" class="ma-0 pa-0">
                  <v-card
                    outlined
                    class="elevation-1 d-flex ma-0 py-2 align-center rounded-0"
                    v-for="(box, index) in boxes"
                    :key="`box_${index}`"
                  >
                    <v-avatar size="33" class="mr-2">
                      <v-img :src="$getImage(box.logo)" />
                    </v-avatar>
                    <v-spacer></v-spacer>
                    <small> {{ box.text }} ( {{ box.count }} عدد) </small>
                    <v-spacer></v-spacer>

                    <small> {{ $price(box.discount_value) }} ریال </small>
                    <v-spacer></v-spacer>

                    <small>
                      جمع مبلغ {{ $price(box.discount_value * box.count) }} ریال
                    </small>
                    <v-spacer></v-spacer>
                  </v-card>
                </v-col>
              </div>
            </v-col>
          </v-row>
        </div>
        <v-row class="d-flex justify-center mx-5 mb-1">
          <v-col
            cols="12"
            v-if="
              this.$store.state.auth.action.indexOf(
                'product_requests/amani_shopping') > -1
            "
          >
            <amp-select
              text="خرید امانی"
              :items="$store.state.static.bool_en"
              v-model="amani_shopping"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-button
              text="برگشت"
              height="38"
              block
              color="red darken-2"
              @click="closeDialog"
              class="ma-1"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-button
              text="ثبت درخواست"
              @click="submit"
              height="38"
              block
              :disabled="isLoading"
              color="green darken-1"
              type="submit"
              class="ma-1"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  components: {},
  props: {
    dialog: {
      default: false,
      required: false,
    },
    totalPrice: {
      default: false,
      required: false,
    },
    isLoading: {
      default: false,
      required: false,
    },
    selectedItems: {
      default: {},
      type: Object,
    },
  },
  data: () => ({
    loading: true,
    total_price: "",
    amani_shopping: "no",
    total_packages: "",
    total_boxes: "",
    total_boxes_price: "",
    total_products: "",
    total_packages_price: "",
    total_products_price: "",
    discount_package: "",
    discount_box: "",
    packages: [],
    boxes: [],
    products: [],
  }),
  watch: {
    amani_shopping() {
      this.$emit("amaniShopping", this.amani_shopping);
    },
  },
  mounted() {
    if (Object.keys(this.selectedItems).length > 0) {
      this.InvoiceCalculation(this.selectedItems.data);
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    submit() {
      this.$emit("submit");
    },
    InvoiceCalculation(data) {
      this.calculatePackages(data.packages);
      this.calculateBoxes(data.boxes);
      this.calculateProducts(data.products);
    },
    calculatePackages(packages) {
      this.packages = packages;
      let count = 0;
      let price = 0;
      let discount_value = 0;
      for (let i = 0; i < packages.length; i++) {
        const pack = packages[i];
        count += pack.count;
        price += pack.price * pack.count;
        discount_value += pack.discount_value * pack.count;
      }

      this.discount_package = discount_value;
      this.total_packages = count;
      this.total_packages_price = price;
    },
    calculateBoxes(boxes) {
      this.boxes = boxes;
      let count = 0;
      let price = 0;
      let discount_value = 0;
      for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        count += box.count;
        price += box.price * box.count;
        discount_value += box.discount_value * box.count;
      }
      this.total_boxes = count;
      this.discount_box = discount_value;
      this.total_boxes_price = price;
    },
    calculateProducts(products) {
      this.products = products;
      let count = 0;
      let price = 0;
      let total_price = 0;
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        count += product.count;
        price += product.product_price * product.count;
      }
      this.total_products_price = price;
      this.total_products = count;
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.border-card {
  border: 7px double #0000005b !important;
}
</style>

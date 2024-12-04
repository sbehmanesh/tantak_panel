<template>
  <v-row class="d-flex justify-center align-center mt-2 pa-5">
    <v-col cols="12">
    </v-col>
    <v-col cols="12">
      <v-autocomplete
        v-if="
          this.$store.state.auth.action.indexOf('product_requests/update') > -1
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
    >
      <v-col cols="12" class="">
        <v-card outlined class="elevation-2 grey lighten-3">
          <v-card
            class="align-center pa-3 elevation-0 grey lighten-3"
            :class="$vuetify.breakpoint.mdAndUp ? 'd-flex' : ''"
          >
            <v-row>
              <v-col cols="12" class="text-end">
              </v-col>
              <v-col cols="12" md="5">
                <v-row class="align-center">
                  <v-avatar size="50" class="mx-2">
                    <img :src="$getImage(selected_package.logo)" />
                  </v-avatar>
                  <h1>
                    {{ selected_package.text }}
                    <br />
                    <small>
                      قیمت پکیج : {{ $price(selected_package.price) }} ریال
                    </small>
                    <div v-if="selected_package.discount_type != 'none'">
                      <small v-if="selected_package.discount_type == 'amount'">
                        مقدار تخفیف :‌
                        {{ $price(selected_package.discount) }} ریال
                      </small>
                      <small v-if="selected_package.discount_type == 'percent'">
                        مقدار تخفیف :‌ ٪ {{ selected_package.discount }}
                      </small>
                      <br />
                      <small class="teal--text">
                        قیمت با تخفیف محاسبه شده :‌
                        {{ $price(selected_package.discount_value) }} ریال
                      </small>
                    </div>
                    <br v-if="selected_package.discount_type == 'none'" />

                    <small v-if="Boolean(selected_package.description)">
                      # {{ selected_package.description }}
                    </small>
                  </h1>
                </v-row>
              </v-col>
              <v-col
                md="7"
                cols="12"
                class="text-end"
                v-if="
                  selected_package.products &&
                  selected_package.products.length > 0
                "
              >
                <h1>محصولات موجود در پکیج :</h1>
                <div
                  v-for="(item, index) in selected_package.products"
                  :key="index"
                >
                  <small v-if="item.product">
                    <v-icon class="mx-1"> arrow_left </v-icon>
                    {{ item.product.name }} :
                    <span v-if="Boolean(item.product_variation_1.colors)">
                      {{ item.product_variation_1.colors }}</span
                    >
                    <span v-else> {{ item.product_variation_1.value }}</span>
                    /
                    {{ item.product_variation_2.value }} /
                    {{ item.product_variation_3.value }}
                  </small>
                  <small class="">
                    ( تعداد محصول : {{ item.count_product }} )
                  </small>
                  <br />
                </div>
              </v-col>
            </v-row>
          </v-card>
          <v-col cols="12" class="text-center">
            <amp-button
              text="افزودن پکیج"
              height="37"
              @click="addPackage"
              :disabled="loading_add"
            />
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12" class="ma-0 pa-0 mt-5" v-if="loading_add">
      <v-card class="elevation-0">
        <v-skeleton-loader height="200" class="mx-auto" type="card" />
      </v-card>
    </v-col>

    <v-col
      class="ma-0 pa-0 mt-5"
      cols="12"
      v-if="list_selected_packages.length > 0"
      v-for="(pack, index) in list_selected_packages"
      :key="index"
    >
      <v-card class="pa-5 elevation-0 card-style">
        <div
          v-if="!$vuetify.breakpoint.mdAndUp"
          class="d-flex justify-center align-center"
        >
          <h1 class="mx-2">
            {{ pack.text }}
          </h1>
          <v-btn @click="deletPack(index)" text icon>
            <v-icon color=""> delete </v-icon>
          </v-btn>
        </div>
        <v-row class="align-center">
          <v-col cols="1" class="text-end" v-if="$vuetify.breakpoint.mdAndUp">
            <v-avatar size="55">
              <img :src="$getImage(pack.logo)" />
            </v-avatar>
          </v-col>
          <v-col
            cols="1"
            class="text-center"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            <h1>
              <br />
              <small>
                {{ pack.text }}
              </small>
            </h1>
          </v-col>

          <v-col cols v-if="pack.products && pack.products.length > 0">
            <v-card
              outlined
              v-for="(item, index) in pack.products"
              :key="index"
              class="text-end pa-1 pr-3 elevation-0 ma-1"
            >
              <h1>
                <small v-if="item.product">
                  {{ index + 1 }} -
                  {{ item.product.name }}

                  <small class="grey--text" v-if="item.product.info">
                    ( {{ item.product.info }} )
                  </small>
                </small>
                <div v-if="item.product_variation_1">
                  <small v-if="item.product_variation_1.colors">
                    - {{ item.product_variation_1.colors }}
                  </small>

                  <small v-else> - {{ item.product_variation_1.value }} </small>
                </div>
                <small v-if="item.product_variation_2">
                  - {{ item.product_variation_2.value }}</small
                >
                <small v-if="item.product_variation_3">
                  - {{ item.product_variation_3.value }}</small
                >
                <small class="grey--text" v-if="item.count_product">
                  <small> ( تعداد محصول : {{ item.count_product }} ) </small>
                </small>
                <br />
              </h1>
            </v-card>
          </v-col>

          <v-col cols="1" class="text-start" v-if="$vuetify.breakpoint.mdAndUp">
            <v-btn @click="deletPack(index)" text icon>
              <v-icon color=""> delete </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-divider class="mb-4"></v-divider>
            <v-row class="pa-2" v-if="$vuetify.breakpoint.mdAndUp">
              <strong>
                قیمت پکیج :
                {{ $price(pack.discount_value) }} ریال
              </strong>
              <v-spacer></v-spacer>
              <v-row class="d-flex justify-center mt-1">
                <v-btn icon @click="addNumberPack(pack, true, 'list')" x-small>
                  <v-chip>
                    <h1 class="font_18 mx-1 mt-1">+</h1>
                  </v-chip>
                </v-btn>
                <h1 class="font_18 mx-5">
                  {{ pack.count }}
                </h1>
                <v-btn
                  :disabled="pack.count == 1"
                  @click="addNumberPack(pack, false, 'list')"
                  icon
                  x-small
                >
                  <v-chip>
                    <h1 class="font_20 mx-1">-</h1>
                  </v-chip>
                </v-btn>
              </v-row>
              <v-spacer></v-spacer>
              <strong>
                قیمت کل :
                {{ $price(pack.count * pack.discount_value) }} ریال
              </strong>
            </v-row>
            <v-col cols="12" v-if="!$vuetify.breakpoint.mdAndUp">
              <strong>
                قیمت پکیج :
                {{ $price(pack.discount_value) }} ریال
              </strong>
              <v-row class="d-flex justify-center my-3">
                <v-btn icon @click="addNumberPack(pack, true, 'list')" x-small>
                  <v-chip>
                    <h1 class="font_18 mx-1 mt-1">+</h1>
                  </v-chip>
                </v-btn>
                <h1 class="font_18 mx-5">
                  {{ pack.count }}
                </h1>
                <v-btn
                  :disabled="pack.count == 1"
                  @click="addNumberPack(pack, false, 'list')"
                  icon
                  x-small
                >
                  <v-chip>
                    <h1 class="font_20 mx-1">-</h1>
                  </v-chip>
                </v-btn>
              </v-row>
              <strong>
                قیمت کل :
                {{ $price(pack.count * pack.discount_value) }} ریال
              </strong>
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
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
    load_form: true,
    loading_add: false,
    load_item: true,
    loading: false,
    loading_package: false,
    packages_list: [],
    package_id: "",
    selected_package: {},
    products: [],
    list_selected_packages: [],
    selected_product: {},
    favorit: {},
  }),
  beforeMount() {
    this.loadPackages();
    if (Boolean(this.basketId)) {
      this.loadItems();
    }
  },
  watch: {
    package_id() {
      this.favorit = {};
      if (Boolean(this.package_id)) {
        let selected_package = this.packages_list.find(
          (f) => f.value == this.package_id
        );
        if (Boolean(selected_package)) {
          this.selected_package = selected_package;
          this.favorit = selected_package;
        }
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
                element.product["info"] = `تعداد محصول :‌${element.count}`;
                new_data.push(element);
              }
              packages.push({
                text: x.information,
                value: x.section_id,
                products: new_data,
                logo: x.package.logo,
                count: x.number,
                price: x.price,
                discount_value: x.base_price,
              });
            }
          }
          this.list_selected_packages = packages;
          this.$emit("data", this.list_selected_packages);

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    loadPackages() {
      this.loading_package = true;
      let filter = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      this.$reqApi("/package", { filters: filter, row_number: 50000 })
        .then((res) => {
          let data = res.model.data;

          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            let discount_value = "بدون تخفیف";
            let discount_precent = 0;
            if (x.discount_type == "amount") {
              discount_value = x.price - x.discount_amount;
            }
            if (x.discount_type == "percent") {
              discount_precent = (x.discount_amount / 100) * x.price;
              discount_value = x.price - discount_precent;
            }
            if (x.discount_type == "none") {
              discount_value = x.price;
            }
            items.push({
              text: x.name,
              value: x.id,
              products: x.product_varcoms,
              description: x.description,
              logo: x.logo,
              price: x.price,
              discount: x.discount_amount,
              discount_type: x.discount_type,
              type: x.type,
              discount_value: discount_value,
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

    deletPack(key) {
      let items = this.list_selected_packages;
      items.splice(key, 1);
      this.list_selected_packages = items;
      this.$emit("data", this.list_selected_packages);
    },

    addPackage() {
      let dublicate = this.list_selected_packages.find(
        (f) => f.value == this.selected_package.value
      );
      if (Boolean(dublicate)) {
        this.$toast.info(`پکیج قبلا اضافه شده`);
        return;
      } else {
        this.loading_add = true;

        this.$emit("data", this.list_selected_packages);
        setTimeout(() => {
          this.package_id = "";
          this.loading_add = false;
          this.$toast.success(`پکیج  اضافه  شد`);

          this.list_selected_packages.unshift(this.selected_package);

          this.selected_package = {};
        }, 1000);
      }
    },
    addNumberPack(item, add) {
      if (Boolean(item)) {
        if (Boolean(add)) {
          item.count++;
        } else {
          item.count--;
        }
        this.$emit("data", this.list_selected_packages);
      }
    },
  },
};
</script>

<style scoped>
.card-style {
  border: 1px solid #5c5c5c6c !important;
  border-radius: 7px;
}
</style>

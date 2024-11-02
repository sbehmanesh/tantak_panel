<template>
  <v-row class="d-flex justify-center align-center pa-5">
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
        <v-card class="elevation-0 card-style">
          <v-card class="align-center pa-3 elevation-0">
            <v-col cols="12" md="12">
              <v-row class="align-center">
                <v-avatar size="80" class="mx-2">
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
              md="12"
              cols="12"
              class="text-end"
              v-if="
                selected_package.products &&
                selected_package.products.length > 0
              "
            >
              <v-divider></v-divider>
              <v-divider></v-divider>
              <v-divider></v-divider>

              <h1 class="mt-2">محصولات موجود در پکیج :</h1>
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
          </v-card>
        </v-card>
      </v-col>
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
  }),
  beforeMount() {
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
          this.$emit("section", {
            id: selected_package.value,
            section_name: "Package",
          });
          this.$emit("validVariations", true);
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
                price: x.package.price,
                discount_value: x.price,
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
      this.$reqApi("/package", { row_number: 50000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            let discount_value = "بدون تخفیف";
            if (x.discount_type == "amount") {
              discount_value = x.price - x.discount_amount;
            }
            if (x.discount_type == "percent") {
              discount_value = (x.discount_amount / 100) * x.price;
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
  },
};
</script>

<style scoped>
.card-style {
  border: 7px double #2c2c2c36 !important;
  border-radius: 7px;
}
</style>

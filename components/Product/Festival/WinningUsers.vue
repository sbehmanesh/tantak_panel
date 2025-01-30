<template>
  <div>
    <v-expansion-panels v-for="(x, i) in peoples" :key="i" class="my-2">
      <v-expansion-panel class="expan-style">
        <v-expansion-panel-header>
          <h1 class="font_17">
            نفر {{ x.number }}
            <small v-if="x.gift_items.length == 0">
              ( جایزه ای ثبت نشده )
            </small>
          </h1>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-row class="align-center">
            <v-col md="12" cols="12" class="text-center">
              <v-btn
                @click="addGift(y.value, y, x, i)"
                v-for="y in types"
                :key="y.value"
                class="mx-1"
              >
                <h1 class="mx-2 blue-grey--text">
                  {{ y.text }}
                </h1>
              </v-btn>
              <v-col cols="12"></v-col>
              <div v-if="x.gift_items.label != 0" class="pa-3 text-center">
                <v-row
                  v-for="gift in x.gift_items"
                  :key="gift.key"
                  class="align-center"
                >
                  <v-col cols="12" v-if="gift.type == 'coupon_items'">
                    <v-row class="justify-center">
                      <v-col
                        cols="12"
                        md="12"
                        v-for="(item, i_coupon) in gift.items"
                        :key="i_coupon"
                        class="py-0"
                      >
                        <v-card
                          class="d-flex align-center pa-3 my-1 elevation-2"
                          style="border-right: 3px solid grey !important"
                          outlined
                        >
                          <v-icon color="green"> task_alt </v-icon>
                          <v-spacer></v-spacer>
                          <h1>
                            {{ item.text }}
                          </h1>
                          <v-spacer></v-spacer>
                          <h1>
                            <small>
                              {{ item.date }}
                            </small>
                          </h1>
                          <v-spacer></v-spacer>

                          <h1>
                            <small>
                              مقدار تخفیف : {{ item.discount_value }}
                            </small>
                          </h1>
                          <v-spacer></v-spacer>
                          <v-btn
                            small
                            icon
                            @click="saveCoupon(item)"
                            class="blue-grey mx-1"
                          >
                            <v-icon x-small color="white">content_copy</v-icon>
                          </v-btn>
                          <v-btn
                            small
                            icon
                            @click="deleteItem(i, gift.type, i_coupon)"
                            class="blue-grey mx-1"
                          >
                            <v-icon x-small color="white">delete</v-icon>
                          </v-btn>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col
                    cols="12"
                    v-if="gift.type == 'cash' || gift.type == 'credit'"
                  >
                    <v-card
                      style="border-right: 3px solid grey !important"
                      outlined
                      width="100%"
                      class="d-flex align-center pa-3 elevation-2"
                      cols="12"
                      v-if="gift.type == 'cash'"
                    >
                      <v-icon color="green"> task_alt </v-icon>
                      <v-spacer></v-spacer>

                      <h1>شارژ کیف پول نقدی</h1>
                      <v-spacer></v-spacer>
                      <h1>مبلغ {{ $price(gift.value) }} ریال</h1>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        icon
                        @click="deleteItem(i, gift.type)"
                        class="blue-grey mx-1"
                      >
                        <v-icon x-small color="white">delete</v-icon>
                      </v-btn>
                    </v-card>
                    <v-card
                      outlined
                      style="border-right: 3px solid grey !important"
                      width="100%"
                      cols="12"
                      class="d-flex align-center pa-3 elevation-2"
                      v-if="gift.type == 'credit'"
                    >
                      <v-icon color="green"> task_alt </v-icon>
                      <v-spacer></v-spacer>
                      <h1>شارژ کیف پول اعتباری</h1>
                      <v-spacer></v-spacer>
                      <h1>مبلغ {{ $price(gift.value) }} ریال</h1>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        icon
                        @click="deleteItem(i, gift.type)"
                        class="blue-grey mx-1"
                      >
                        <v-icon x-small color="white">delete</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>
                  <v-col cols="12" v-if="gift.type == 'product_var_com_items'">
                    <v-card
                      outlined
                      style="border-right: 3px solid grey !important"
                      v-for="(product, i_product) in gift.items"
                      :key="i_product"
                      width="100%"
                      class="d-flex align-center pa-3 my-1 elevation-2"
                      cols="12"
                    >
                      <v-avatar size="35" class="mx-2">
                        <img
                          contain
                          v-if="product.img && Boolean(product.img)"
                          :src="$getImage(product.img)"
                        />
                        <img
                          contain
                          v-else
                          :src="
                            $getImage(product.variation1.product.main_image)
                          "
                        />
                      </v-avatar>
                      <h1>
                        <small> {{ product.variation1.product.name }} </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <h1>
                        <small> تعداد :‌ {{ product.number }} </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <h1>
                        <small
                          v-if="
                            product.product_price &&
                            Boolean(product.product_price)
                          "
                        >
                          قیمت محصول :‌ {{ $price(product.product_price) }} ریال
                        </small>
                        <small
                          v-else-if="product.price && Boolean(product.price)"
                        >
                          قیمت محصول :‌ {{ $price(product.price) }} ریال
                        </small>
                        <small
                          v-else-if="
                            product.variation1 &&
                            Boolean(product.variation1.product.base_price)
                          "
                        >
                          قیمت محصول :‌
                          {{ $price(product.variation1.product.base_price) }}
                          ریال
                        </small>
                      </h1>
                      <v-spacer></v-spacer>

                      <v-col cols="5">
                        <h1>
                          <small v-if="Boolean(product.variation1.colors)">
                            {{ product.variation1.variation_type.value }}
                            {{ product.variation1.colors }} /
                          </small>

                          <small>
                            {{ product.variation2.variation_type.value }}
                            {{ product.variation2.value }} /
                          </small>
                          <small>
                            {{ product.variation3.variation_type.value }}
                            {{ product.variation3.value }}
                          </small>
                        </h1>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        icon
                        @click="deleteItem(i, gift.type, i_product)"
                        class="blue-grey mx-1"
                      >
                        <v-icon x-small color="white">delete</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>
                  <v-col cols="12" v-if="gift.type == 'package_items'">
                    <v-card
                      style="border-right: 3px solid grey !important"
                      outlined
                      v-for="(pack, i_pack) in gift.items"
                      :key="i_pack"
                      width="100%"
                      class="d-flex align-center pa-3 my-1 elevation-2"
                      cols="12"
                    >
                      <v-avatar size="35" class="mx-2">
                        <img contain :src="$getImage(pack.logo)" />
                      </v-avatar>
                      <v-spacer></v-spacer>
                      <h1>
                        <small> پکیج ‌ {{ pack.text }} </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <h1>
                        <small> تعداد :‌ {{ pack.number }} </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <h1>
                        <small>
                          قیمت محصول :‌ {{ $price(pack.price) }} ریال
                        </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <h1>
                        <small>
                          قیمت پس از تخفیف :‌
                          {{ $price(pack.discount_value) }} ریال
                        </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        icon
                        @click="deleteItem(i, gift.type, i_pack)"
                        class="blue-grey mx-1"
                      >
                        <v-icon x-small color="white">delete</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>     
                  
                  <v-col cols="12" v-if="gift.type == 'not_system_product_ids'">
                    <v-card
                      style="border-right: 3px solid grey !important"
                      outlined
                      v-for="(pr_items, i_pr_item) in gift.items"
                      :key="i_pr_item"
                      width="100%"
                      class="d-flex align-center pa-3 my-1 elevation-2"
                      cols="12"
                    >
       
                      <h1>
                        <small> نام محصول ( غیر سیستمی ) ‌ {{ pr_items.text }} </small>
                      </h1>
                      <v-spacer></v-spacer>
                      <h1>
                        <small> تعداد :‌ {{ pr_items.number }} </small>
                      </h1>
                      <v-spacer></v-spacer>
                
                    
              
                 
                      <v-btn
                        small
                        icon
                        @click="deleteItem(i, gift.type, i_pr_item)"
                        class="blue-grey mx-1"
                      >
                        <v-icon x-small color="white">delete</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog persistent width="750" v-model="dialog">
      <v-card class="pa-10">
        <div>
          <v-col cols="12" class="d-flex align-center">
            <v-divider style="border: 1px dashed #bababa"></v-divider>
            <h1 class="mx-4 font_12 text-center">
              <v-icon size="50" color="grey" >
               assignment_ind
              </v-icon>
              <br />
              {{ dialog_title }}
            </h1>
            <v-divider style="border: 1px dashed #bababa"></v-divider>
          </v-col>

          <div class="pa-4">
            <div v-if="dialog_key == 'not_system_product_ids'">
              <NotSystemProducts
                v-if="dialog_key == 'not_system_product_ids' && dialog"
                ref="NotSystemProductsItems"
                @selectedIItemsShow="getData($event, 'not_system_product')"
                :datas="not_system_products"
                size-card="small"
                :load-items="[]"
              />
            </div>
            <div
              v-if="dialog_key == 'coupon_items'"
              class="d-flex align-center"
            >
              <v-col cols="12" class="mt-1">
                <v-autocomplete
                  clearable
                  multiple
                  outlined
                  dense
                  prepend-inner-icon="newspaper"
                  v-model="coupon_ids"
                  :items="coupon_list"
                  label="کد های تخفیف"
                >
                  <template v-slot:item="data">
                    <v-list-item-content>
                      <v-list-item-title>
                        <h1>
                          {{ data.item.text }}
                        </h1>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <h1>
                          <small class="blue-grey--text">
                            مقدار تخفیف :‌ {{ data.item.discount_value }}
                          </small>
                          <br />
                          <small> {{ data.item.date }} </small>
                        </h1>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </div>

            <div
              v-if="dialog_key == 'cash' || dialog_key == 'credit'"
              class="text-center"
            >
              <amp-input
                text="مبلغ به ریال"
                v-model="wallet"
                cClass="ltr-item"
                is-price
              ></amp-input>
            </div>
            <div v-if="dialog_key == 'product_var_com_items'">
              <Products
                ref="LattryProduct"
                @data="getData($event, 'product')"
              />
            </div>
            <div v-if="dialog_key == 'package_items'">
              <Packages
                ref="LattryPackage"
                @data="getData($event, 'package')"
              />
            </div>
          </div>

          <v-col cols="12" class="d-flex justify-center">
            <v-col cols="12" md="3">
              <amp-button
                text="تایید"
                height="36"
                block
                color="teal darken-2"
                @click="submit(dialog_key, dialog_user)"
                class="ma-1"
              />
            </v-col>
            <v-col cols="12" md="3">
              <amp-button
                text="انصراف"
                height="36"
                block
                color="red darken-2"
                @click="dialog = false"
                class="ma-1"
              />
            </v-col>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Packages from "@/components/Product/Festival/LotteryGift/Packages.vue";
import Products from "@/components/Product/Festival/LotteryGift/Products.vue";
import NotSystemProducts from "@/components/Product/Festival/LotteryGift/NotSystemProducts.vue";

export default {
  components: { Products, Packages, NotSystemProducts },
  props: {
    usersCount: {
      default: "",
      type: String,
    },
    loadData: {
      default: [],
      type: Array,
    },
  },
  data: () => ({
    types: [
      { text: "اعتباری", value: "credit" },
      { text: "پکیج ", value: "package_items" },
      { text: "کد تخفیف", value: "coupon_items" },
      { text: "شارژ کیف پول نقدی", value: "cash" },
      { text: "محصول ", value: "product_var_com_items" },
      { text: "محصولات سیستمی ", value: "not_system_product_ids" },
    ],
    dialog: false,
    step: 1,
    package_id: "",
    product_id: "",
    wallet: "",
    dialog_title: "",
    dialog_key: "",
    dialog_user: {},
    coupon_ids: [],
    peoples: [],
    products: [],
    coupon_list: [],
    package: [],
    not_system_products: [],
  }),
  mounted() {
    this.loadPackages();
    this.loadProduct();
    this.getProductsSetting();
    this.loadFestivalCoupon();
    if (Boolean(this.loadData) && this.loadData.length > 0) {
      this.peoples = this.loadData;
    }
    if (Boolean(this.usersCount) && this.loadData.length == 0) {
      let people_count = +Number(this.usersCount);
      let peoples = [];
      for (let i = 1; i <= people_count; i++) {
        peoples.push({
          number: i,
          gift_items: [],
        });
      }
      this.peoples = peoples;
    }
  },

  methods: {
    addGift(key, type, user, index) {
      let check_action = null;
      if (key == "credit") {
        check_action = user.gift_items.find((x) => x.type == "credit");
      }
      if (key == "cash") {
        check_action = user.gift_items.find((x) => x.type == "cash");
      }
      if (Boolean(check_action)) {
        this.$toast.error("شما این نوع هدیه را قبلا ثبت کرده اید");
        check_action = null;
        return;
      }

      this.dialog = true;
   
      this.dialog_title = `${type.text} ( نفر ${user.number} )`;
      this.dialog_key = key;
      this.dialog_user = user;
    },
    submit(key, user) {
      switch (key) {
        case "product_var_com_items":
          this.$refs.LattryProduct.addVariation();
          this.dialog = false;

          break;
        case "package_items":
          this.$refs.LattryPackage.addPackage();
          this.dialog = false;

          break;
        case "not_system_product_ids":
          this.$refs.NotSystemProductsItems.callSubmit();

          this.dialog = false;

          break;
        case "coupon_items":
          let items = [];
          for (let i in this.coupon_ids) {
            let coupon_key = user.gift_items.find((f) => f.type == key);
            let find = this.coupon_list.find(
              (x) => x.value == this.coupon_ids[i]
            );
            if (Boolean(find)) {
              if (Boolean(coupon_key)) {
                coupon_key.items.push(find);
                items = coupon_key;
              } else {
                items.push(find);
                user.gift_items.push({
                  type: key,
                  user_number: user.number,
                  type_name: this.dialog_title,
                  value: this.coupon_ids,
                  items: items,
                });
              }
            }
          }
          this.$toast.success("کد تخفیف با موفقیت برای کاربر ثبت شد");
          this.dialog = false;
          this.coupon_ids = false;
          break;
        case "cash":
          user.gift_items.push({
            type: key,
            user_number: user.number,
            type_name: this.dialog_title,
            value: this.wallet,
          });
          this.$toast.success("شارژ کیف پول نقدی با موفقیت انجام شد");

          this.wallet = "";
          this.dialog = false;

          break;
        case "credit":
          user.gift_items.push({
            type: key,
            user_number: user.number,
            type_name: this.dialog_title,
            value: this.wallet,
          });
          this.$toast.success("شارژ کیف پول اعتباری  با موفقیت انجام شد");

          this.wallet = "";
          this.dialog = false;

          break;
      }
    },
    getProductsSetting() {
      let filter = {
        op: "=",
        key: "not_system_products",
      };
      this.$reqApi("/setting", { filters: filter, row_number: 30000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.value,
              value: x.id,
            });
          }

          this.not_system_products = items;
        })
        .catch((err) => {});
    },
    deleteItem(key_user, type, item_index = null) {
      if (item_index != null) {
        let items = this.peoples[key_user].gift_items.find(
          (x) => x.type == type
        );
        items.items = items.items.filter((x, i) => i != item_index);
        this.peoples[key_user].gift_items = this.peoples[
          key_user
        ].gift_items.filter(
          (f) => typeof f.items == "undefined" || f.items.length != 0
        );
      } else {
        this.peoples[key_user].gift_items = this.peoples[
          key_user
        ].gift_items.filter((x) => x.type != type);
      }
      this.$toast.success("   حذف   با موفقیت انجام شد");
    },
    saveCoupon(code) {
      if (code && Boolean(code)) {
        navigator.clipboard.writeText(code.coupon);
        this.$toast.success(" کپی شد");
      }
    },
    loadPackages() {
      let filter = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      this.$reqApi("/package", { filters: filter, row_number: 2000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.package = items;
        })
        .catch((error) => {});
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
    loadFestivalCoupon() {
      this.load_item = true;
      let filters = {
        is_festival: {
          op: "=",
          value: true,
        },
      };
      this.$reqApi("/coupon", { row_number: 50000, filters: filters })
        .then((response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            let discount_value =
              x.type == "amount"
                ? `${this.$price(x.value)} ریال`
                : `${x.value} درصد`;
            let start = this.$toJalali(
              x.start_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
            let end = this.$toJalali(x.end_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
            let date = `قابل استفاده از تاریخ ${start} تا ${end}`;
            items.push({
              text: x.for_title,
              date: date,
              coupon: x.coupon,
              value: x.id,
              discount_value: discount_value,
            });
          }
          this.coupon_list = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    getData(data, type) {
      if (type == "package") {
        let package_key = this.dialog_user.gift_items.find(
          (f) => f.type == this.dialog_key
        );
        if (Boolean(package_key)) {
          package_key.items.push(data);
        } else {
          this.dialog_user.gift_items.push({
            type: this.dialog_key,
            user_number: this.dialog_user.number,
            type_name: this.dialog_title,
            items: [data],
          });
        }
      } else if (type == "product") {
        let product_key = this.dialog_user.gift_items.find(
          (f) => f.type == this.dialog_key
        );
        if (Boolean(product_key)) {
          product_key.items.push(data);
        } else {
          this.dialog_user.gift_items.push({
            type: this.dialog_key,
            user_number: this.dialog_user.number,
            type_name: this.dialog_title,
            items: [data],
          });
        }
      } else if (type == "not_system_product") {

        let product_key = this.dialog_user.gift_items.find(
          (f) => f.type == this.dialog_key
        );
        if (Boolean(product_key)) {
          product_key.items.push(data);
        } else {
          this.dialog_user.gift_items.push({
            type: this.dialog_key,
            user_number: this.dialog_user.number,
            type_name: this.dialog_title,
            items: data,
          });
        }
      }
    },
    callSubmit() {
      this.$emit("winingUsers", this.peoples);
    },
  },
};
</script>
<style scoped>
.expan-style {
  background: linear-gradient(
    to left,
    #fffffff1,
    #f8f8f86c,
    #ffffff6c
  ) !important;
}
</style>

<template>
  <v-row class="my-3">
    <v-col cols="12" class="pa-0">
      <v-card outlined class="pa-2 text-center rounded-0">
        <h1>
          <v-icon> call </v-icon>
          {{ user.username }}
        </h1>
        <h1 v-if="Boolean(user.first_name)" class="grey--text">
          <v-icon> account_circle </v-icon>
          <small> {{ user.first_name }} {{ user.last_name }} </small>
        </h1>
      </v-card>
    </v-col>
    <v-col cols="12" class="d-flex pa-0">
      <v-card outlined class="pa-2 text-center rounded-0" width="50%">
        <h1>{{ product.title }}</h1>
        <h1 class="font_11 grey--text">
          تعداد کل {{ product.title }} انتخاب شده {{ product.count }}
        </h1>
        <h1 class="font_11 grey--text">
          قیمت کل{{ $price(product.price) }} ریال
        </h1>
      </v-card>
      <v-card outlined class="pa-2 text-center rounded-0" width="50%">
        <h1>{{ package.title }}</h1>
        <h1 class="font_11 grey--text">
          تعداد کل {{ package.title }} انتخاب شده {{ package.count }}
        </h1>
        <h1 class="font_11 grey--text">
          قیمت کل{{ $price(package.price) }} ریال
        </h1>
      </v-card>
    </v-col>
    <v-col cols="12" class="d-flex align-center justify-center mt-5">
      <v-col cols="5">
        <amp-select text="نوع پرداخت" :items="pay_type" v-model="kind_set" />
      </v-col>
      <v-col cols="5">
        <amp-input v-model="coupon" text="اعمال کد تخفیف" cClass="ltr-item" />
      </v-col>
      <amp-button
        text="تایید"
        height="38"
        @click="payFactor(true)"
        color="blue-grey"
        type="submit"
        class="ma-1"
      />
    </v-col>
    <div class="text-center">
      <v-overlay :value="overlay" :dark="false">
        <v-row class="d-flex justify-center">
          <v-card class="pa-5" width="650">
            <v-col cols="12">
              <v-card
                class="elevation-0 d-flex justify-space-between align-center pa-2"
                style="border-right: 3px solid teal"
                outlined
              >
                <h1 class="font_11">جمع کل فاکتور</h1>
                <v-chip>
                  <h1 class="font_11">ریال{{ $price(wallet.price) }}</h1>
                </v-chip>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card
                class="elevation-0 d-flex justify-space-between align-center pa-2"
                style="border-right: 3px solid teal"
                outlined
              >
                <h1 class="font_11">مبلغ قابل پرداخت</h1>
                <v-chip>
                  <h1 class="font_11">ریال{{ $price(wallet.buy_online) }}</h1>
                </v-chip>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card
                class="elevation-0 d-flex justify-space-between align-center pa-2"
                style="border-right: 3px solid teal"
                outlined
              >
                <h1 class="font_11">مقدار کسر شده از کیف پول نقدی</h1>
                <v-chip>
                  <h1 class="font_11">ریال{{ $price(wallet.cash_wallt) }}</h1>
                </v-chip>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card
                class="elevation-0 d-flex justify-space-between align-center pa-2"
                style="border-right: 3px solid teal"
                outlined
              >
                <h1 class="font_11">مقدار کسر شده از کیف پول اعتباری</h1>
                <v-chip>
                  <h1 class="font_11">ریال{{ $price(wallet.credit_wallt) }}</h1>
                </v-chip>
              </v-card>
            </v-col>

            <div class="d-flex justify-center">
              <v-col cols="4">
                <v-card
                  class="elevation-0 text-center pa-2"
                  style="border-top: 3px solid teal"
                  outlined
                >
                  <h1 class="font_13">قیمت اصلی سبد خرید</h1>
                  <br />

                  <v-chip>
                    <h1 class="font_11">
                      ریال{{ $price(wallet.original_price) }}
                    </h1>
                  </v-chip>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  class="elevation-0 text-center pa-2"
                  style="border-top: 3px solid teal"
                  outlined
                >
                  <h1 class="font_12">مقدار استفاده شده از کد تخفیف</h1>
                  <br />

                  <v-chip>
                    <h1 class="font_11">
                      ریال{{ $price(wallet.amount_coupon) }}
                    </h1>
                  </v-chip>
                </v-card>
              </v-col>

              <v-col cols="4">
                <v-card
                  class="elevation-0 text-center pa-2"
                  style="border-top: 3px solid teal"
                  outlined
                >
                  <h1 class="font_13">مجموع کل تخفیفات</h1>
                  <br />
                  <v-chip>
                    <h1 class="font_11">ریال{{ $price(wallet.off_amount) }}</h1>
                  </v-chip>
                </v-card>
              </v-col>
            </div>

            <v-row class="d-flex justify-center pa-4">
              <v-col cols="12" md="2" class="ma-2">
                <amp-button
                  text="پرداخت سبد"
                  height="38"
                  @click="payFactor(false)"
                  color="teal darken-2"
                  type="submit"
                />
              </v-col>

              <v-col cols="12" md="4" class="ma-2">
                <amp-button
                  text="انصراف و ذخیره سبد"
                  height="38"
                  block
                  color="blue-grey"
                  @click="saveBasket()"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </v-overlay>
    </div>
  </v-row>
</template>

<script>
export default {
  props: {
    data: {
      default: {},
      require: false,
    },
    user: {
      default: {},
      require: false,
    },
    formData: {
      default: {},
      require: false,
    },
  },
  data: () => ({
    pay_type: [
      { text: "نقد", value: "naghd" },
      { text: "پرداخت با کارتخوان", value: "pos" },
    ],
    overlay: false,
    product: { title: "محصولات ", count: 0, price: "" },
    package: { title: "پکیج ها ", count: 0, price: "" },
    sumb_price: 0,
    kind_set: "naghd",
    coupon: "",
    loading: false,
    basket_id: "",
    wallet: {},
    only_price: false,
  }),
  watch: {
    basket_id() {
      let only_price_show = this.only_price;
      if (Boolean(only_price_show)) {
        this.overlay = true;
      }

      if (Boolean(this.basket_id)) {
        this.$reqApi("basket/sale-agency/seller/payment", {
          only_price: only_price_show,
          kind_set: this.kind_set,
          basket_id: this.basket_id,
          coupon: this.coupon,
        })
          .then((res) => {
            if (Boolean(only_price_show)) {
              this.wallet = res;

              return;
            }
            this.$toast.success("سفارش با موفقیت ثبت شد");
            this.$router.push("/in-person-shopping");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      let count_product = 0;
      let price_product = 0;
      let count_pack = 0;
      let price_pack = 0;
      for (let i = 0; i < this.data.length; i++) {
        const x = this.data[i];
        if (x.section_name == "ProductVariationCombination") {
          let count_item = +Number(x.count);
          count_product += count_item;

          let price_item = Boolean(x.only_product_var.price)
            ? +Number(x.count * x.only_product_var.price)
            : +Number(x.count * x.only_product_var.product.base_price);
          price_product += price_item;

          this.product.count = count_product;
          this.product.price = price_product;
        } else if (Boolean(x.package)) {
          count_pack = +x.count;
          let price = +Boolean(x.package.final_price)
            ? +Number(x.package.final_price * x.count)
            : +Number(x.package.price * x.count);
          price_pack += price;

          this.package.count = count_pack;
          this.package.price = price_pack;
        }
      }
    },
    listItems() {
      let array = [];
      if (Object.keys(this.information).length > 0) {
        let i = 0;
        do {
          let id = this.information.selected_item[i];
          i++;
          array.push(this.information.list.find((x) => x.id == id));
        } while (i < this.information.selected_item.length);
      }
      this.list_items = array;
    },
    payFactor(only_price) {
      this.only_price = only_price;
      this.$reqApi("basket/sale-agency/seller/insert", this.formData)
        .then((res) => {
          if (Boolean(res.basket_id)) {
            this.basket_id = res.basket_id;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.editBasket();
        });
    },
    saveBasket() {
      let find = this.data.find((x) => x.skock < x.count);
      if (Boolean(find)) {
        this.$toast.info(
          "سفارشی بیشتر از موجودی ثبت شده لطفا آن را اصلاح کنید "
        );
        this.editBasket();
        return;
      }

      this.$toast.info("سبد خرید دخیره شد");
      this.$router.push("/in-person-shopping");
    },
    editBasket() {
      this.$emit("editBasket");
    },
  },
};
</script>
<style scoped>
.clicabel :hover {
  color: rgb(240, 70, 70);
  border-bottom: 1px solid rgb(240, 70, 70);
  cursor: pointer;
}
</style>

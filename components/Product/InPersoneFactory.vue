<template>
  <div>
    <v-row class="d-flex justify-center pa-5">
      <v-col cols="8" md="6" class="text-center">
        <v-card class="pa-8 elevation-0 card-style">
          <v-row class="d-flex" v-if="factor_list.user && !loading_factor">
            <v-col cols="12" md="12" class="box-items">

              <v-card class="pa-2 child-card elevation-1" >
                نام کاربر :
                {{ factor_list.user.first_name }}
                {{ factor_list.user.last_name }}
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
              شماره همراه :
              {{ factor_list.user.username }}
            </v-card> </v-col>
       
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                مجموع وزن :
                {{ factor_list.total_weight }}
                <small> گرم </small>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                نام گیرنده:
                {{ factor_list.geter_first_name }}
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                نام خانوادگی گیرنده: {{ factor_list.geter_last_name }}
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                شماره همراه گیرنده: {{ factor_list.geter_phone_number }}
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" > کد پستی : {{ factor_list.postal_code }} </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                زمان ارسال : {{ $toJalali(factor_list.send_at) }}
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" > مجموع قیمت : {{ $price(factor_list.price) }} 
                <small> ریال </small> </v-card>

         
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                تخفیف :
                {{ $price(factor_list.products_discount) }}
                <small> ریال </small>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" >
                مقدار پیش پرداخت :
                {{ $price(factor_list.prepay_amount) }}
                <small> ریال </small></v-card
              >
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" > شماره فاکتور : {{ factor_list.factor_number }} </v-card>
            </v-col>
            <v-col cols="12" md="6" class="box-items">
              <v-card class="pa-2 child-card elevation-1" > آدرس : {{ factor_list.address }} </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center" v-if="loading_factor">
      <v-col cols="8">
        <v-row class="d-flex justify-center" v-if="loading_factor">
          <v-col cols="12">
            <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader>
          </v-col>
          <v-col cols="6">
            <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader
          ></v-col>
          <v-col cols="6">
            <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader
          ></v-col>
          <v-col cols="6">
            <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader
          ></v-col>
          <v-col cols="6">
            <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader
          ></v-col>
          <v-col cols="12">
            <v-skeleton-loader class="mx-auto" type="text"></v-skeleton-loader
          ></v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-overlay v-model="overlay" class="d-flex justify-center align-center">
      <v-card class="white pa-6">
        <v-card-title class="black--text d-flex justify-center align-center">
          تایید فاکتور پرداخت
        </v-card-title>
        <v-divider></v-divider>

        <v-row>
          <v-col
            cols="12"
            md="12"
            v-for="(item, index) in factor_data"
            :key="index"
            class="d-flex justify-space-between"
          >
            <span class="black--text">{{ item.text }}</span>
            <span class="black--text">{{
              item.value ? `${$price(item.value)} ریال` : "__"
            }}</span>
          </v-col>
          <v-col cols="12" md="12" class="d-flex justify-center align-center">
            <amp-button
              icon="credit_card"
              height="40"
              @click="overlay = false"
              color="error"
              class="ma-1"
              text="انصراف "
            />
            <amp-button
              icon="credit_card"
              :loading="loading"
              height="40"
              @click="pay(false)"
              color="info  "
              class="ma-1"
              text="پرداخت "
            />
          </v-col>
        </v-row>
      </v-card>
    </v-overlay>
    <v-form v-model="valid_pay">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="5">
          <amp-select
            text="مقدار پرداخت "
            rules="require"
            v-model="price_value"
            :items="type_pay"
          />
          <amp-input
            v-if="price_value == 'prepayment'"
            text="مبلغ پیش پرداخت (ریال)"
            rules="require"
            is-price
            cClass="ltr-item"
            v-model="prepayment"
          />
          <amp-select
            text="نوع پرداخت"
            rules="require"
            v-model="kind_set"
            :items="kind_set_item"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-row class="my-4 d-flex justify-center">
      <amp-button
        icon="arrow_circle_right"
        height="40"
        @click="backStep()"
        class="ma-1"
        color="red darken-3"
        text="برگشت "
      />
      <amp-button
        icon="credit_card"
        height="40"
        @click="pay()"
        color="info  "
        class="ma-1"
        text="پرداخت "
        :loading="loading"
        :disabled="loading || !valid_pay"
      />
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      default: false,
      require: false,
    },
    basketCostumerId: {
      default: false,
      require: false,
    },
  },
  data: () => ({
    e1: 1,

    kind_set_item: [
      { text: "کارت به کارت", value: "cardToCard" },
      { text: "ارسال لینک", value: "send_pay_link" },
    ],
    price_value: "",
    type_pay: [
      { text: "پرداخت به صورت کامل", value: "full" },
      { text: "پیش پرداخت", value: "prepayment" },
    ],
    number: 1,
    valid_add_user: true,
    valid_pay: true,
    show_btn: false,
    show_btn_nex: false,
    loading: false,
    loading_factor: false,
    list_basket: {},
    factor_list: {},
    prepayment: "",
    first_name: "",
    last_name: "",
    username: "",
    user_id: "",
    kind_set: "",
    product_varcomb_id: "",
    basket_id: "",
    length_item: "",
    overlay: false,
    title: " ثبت خرید حضوری",
    basket_form: {
      user_id: "",
    },
    factor_data: [],
  }),
  watch: {
    price_value() {
      if (this.price_value == "prepayment") {
        this.prepayment = this.factor_list.prepay_amount;
      }
    },
  },
  mounted() {
    this.loadFactor();
  },
  methods: {
    pay(pay = true) {
      this.loading = true;
      let form = {};
      form["id"] = this.basket_id;
      if (this.price_value == "prepayment") {
        form["price"] = this.prepayment;
      } else {
        form["price"] = this.factor_list.price;
      }
      form["kind_set"] = this.kind_set;
      form["only_price"] = pay;
      this.$reqApi("basket/manual-pay", form)
        .then((response) => {
          if (pay) {
            let data = response;
            this.factor_data = [
              {
                text: "پرداخت آنلاین",
                value: data.buy_online,
              },
              {
                text: "پرداخت درب منزل",
                value: data.buy_post,
              },
              {
                text: "کیف پول نقدی",
                value: data.cash_wallt,
              },
              {
                text: "کیف پول اعتباری",
                value: data.credit_wallt,
              },
              {
                text: "مبلغ",
                value: data.price,
              },
            ];
            this.overlay = true;
          } else {
            this.$toast.success("پرداخت با مو فقیت انجام شد");
            this.loading = false;
            this.e1 = 1;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    backStep() {
      this.$emit("back");
    },
    loadFactor() {
      this.loading = true;

      let info_basket = {};
      let filters = {};
      filters = {
        id: {
          op: "=",
          value: this.basketCostumerId,
        },
      };
      this.$reqApi("basket/list-personnel", {
        user_id: this.userId,
        filters: filters,
      })
        .then((response) => {
          let information = "";
          let info_user = "";
          if (response.model.data[0].delivery_info) {
            information = response.model.data[0].delivery_info;
            info_user = JSON.parse(information);
          }
          this.basket_id = response.model.data[0].id;
          this.prepayment;
          info_basket = {
            discount: response.model.data[0].discount,
            factor_number: response.model.data[0].factor_number,
            products_discount: response.model.data[0].products_discount,
            total_weight: response.model.data[0].total_weight,
            price: response.model.data[0].price,
            user: response.model.data[0].user,
            prepay_amount: response.model.data[0].prepay_amount,
            address: info_user.address,
            delivery_time: info_user.delivery_time,
            geter_first_name: info_user.first_name,
            geter_last_name: info_user.last_name,
            geter_phone_number: info_user.phone_number,
            postal_code: info_user.postal_code,
            send_at: info_user.send_at,
          };

          this.factor_list = info_basket;

          this.loading = false;
          this.show_factor = true;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.card-style {
  border-bottom: 2px dashed #00000065 !important;
}
.child-card{
border-radius: 8px;
border-right: 2px solid orange;
}
</style>

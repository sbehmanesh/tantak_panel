<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-stepper v-model="e1">
        <v-row class="d-flex justify-center">
          <v-col cols="10" class="mt-4">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1"> انتخاب کاربر </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2"> سبد خرید </v-stepper-step>

              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 2" step="3">تکمیل اطلاعات</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 3" step="4"> مشاهده فاکتور </v-stepper-step>
            </v-stepper-header>
          </v-col>
        </v-row>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="d-flex justify-center mb-8">
              <v-col md="3" cols="8" class="ma-0 pa-0 text-center">
                <v-tabs v-model="tab" centered icons-and-text>
                  <v-tab>
                    <h1>
                      انتخاب کاربر
                      <v-icon> person </v-icon>
                    </h1>
                  </v-tab>
                  <v-spacer> </v-spacer>
                  <v-tab>
                    <h1>
                      ایجاد کاربر
                      <v-icon> person_add </v-icon>
                    </h1>
                  </v-tab>
                </v-tabs></v-col
              >
            </v-row>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-row class="d-flex justify-center">
                  <v-col cols="12" md="6">
                    <UserSelectForm
                      v-if="tab == 0"
                      text="انتخاب کاربر"
                      v-model="user"
                      url="/user"
                      rules="require"
                      :role-id="[]"
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-form v-model="valid_add_user">
                  <v-row class="d-flex justify-center">
                    <v-col cols="12" md="3">
                      <amp-input text="نام" v-model="first_name" rules="require" />
                    </v-col>
                    <v-col cols="12" md="3">
                      <amp-input
                        text="نام خانوادگی"
                        rules="require"
                        v-model="last_name"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <amp-input
                        class="ltr-item"
                        text=" شماره همراه "
                        rules="phone,require"
                        v-model="username"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-tab-item>
            </v-tabs-items>

            <v-col cols="12" class="text-center mt-10">
              <amp-button
                v-if="tab == 1"
                icon="add_circle"
                height="40"
                @click="addUser(tab, true)"
                color="primary "
                text="افزودن "
                :loading="loading"
                :disabled="tab == 0 ? !user[0] || loading : loading || !valid_add_user"
              />
              <amp-button
                v-if="(tab == 1 && show_btn_nex) || tab == 0"
                icon="arrow_circle_left"
                height="40"
                @click="addUser(tab, false)"
                color="info darken-3"
                text="بعدی"
                :disabled="tab == 0 ? !user[0] || loading : loading || !valid_add_user"
              />
            </v-col>
          </v-stepper-content>

          <v-stepper-content step="2">
            <Basket
              ref="have_item"
              @next_step="goToStep($event)"
              @basket_costumer_id="basket_costumer_id = $event"
              @backStep="backStep()"
              :UserId="user_id"
              @list="showBtn($event)"
              @chek_save="changeNumber($event)"
            />

            <v-row class="my-4 d-flex justify-center" v-if="show_btn">
              <amp-button
                icon="arrow_circle_right"
                height="40"
                @click="e1 = 1"
                class="ma-1"
                color="red darken-2"
                text="برگشت "
              />
              <amp-button
                icon="verified"
                height="40"
                @click="save = true"
                color="success darken-2 "
                class="ma-1"
                text="ثبت سبد خرید "
                :loading="loading_factor"
                :disabled="loading || save"
              />
              <amp-button
                v-if="next_btn"
                icon="arrow_circle_left"
                height="40"
                @click="e1 = 3"
                color="info darken-3 "
                class="ma-1"
                text="بعدی "
                :loading="loading"
                :disabled="loading || !save || loading_factor"
              />
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row v-if="e1 == 3" class="d-flex justify-center">
              <v-col cols="12" md="10">
                <CompleteInfo
                  :basket_costumer_id="basket_costumer_id"
                  @nextStep="e1 = 4"
                  @backStep="e1 = 2"
                  :user_id="user_id"
                />
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-row class="d-flex justify-center">
              <v-col cols="8">
                <v-row
                  class="d-flex justify-center"
                  v-if="factor_list.user && !loading_factor"
                >
                  <v-col cols="12" class="box-items text-center">
                    نام کاربر :
                    {{ factor_list.user.first_name }}
                    {{ factor_list.user.last_name }}
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    شماره همراه :
                    {{ factor_list.user.username }}
                  </v-col>

                  <v-col cols="6" class="box-items text-center">
                    مجموع وزن :
                    {{ factor_list.total_weight }}
                    <small> گرم </small>
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    نام گیرنده:
                    {{ factor_list.geter_first_name }}
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    نام خانوادگی گیرنده:
                    {{ factor_list.geter_last_name }}
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    شماره همراه گیرنده:
                    {{ factor_list.geter_phone_number }}
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    کد پستی :
                    {{ factor_list.postal_code }}
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    زمان ارسال :
                    {{ $toJalali(factor_list.send_at) }}
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    مجموع قیمت :
                    {{ $price(factor_list.price) }}
                    <small> ریال </small>
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    تخفیف :
                    {{ $price(factor_list.products_discount) }}
                    <small> ریال </small>
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    شماره فاکتور :
                    {{ factor_list.factor_number }}</v-col
                  >
                  <v-col cols="12" class="box-items text-center">
                    آدرس :
                    {{ factor_list.address }}</v-col
                  >
                </v-row>
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
                @click="e1 = 3"
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
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";
import Basket from "@/components/Product/Basket.vue";
import CompleteInfo from "@/components/Product/CompleteInfo.vue";
export default {
  components: { UserSelectForm, Basket, CompleteInfo },
  data: () => ({
    e1: 1,
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
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
    load_list: true,
    loading: false,
    next_btn: false,
    save: false,
    loading_factor: false,
    tab: null,
    user: [],
    products: [],
    list_basket: {},
    factor_list: {},
    main_image: "",
    basket_costumer_id: "",
    prepayment: "",
    first_name: "",
    last_name: "",
    username: "",
    user_id: "",
    kind_set: "",
    product_varcomb_id: "",
    basket_id: "",
    length_item: "",
    title: "ثبت فروش",
    basket_form: {
      user_id: "",
    },
    dialog_add_product: { show: false, items: null },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },

  watch: {
    tab() {
      (this.user = []),
        (this.first_name = ""),
        (this.last_name = ""),
        (this.username = "");
    },
    user_id() {
      this.$refs.have_item.cleareBasket();
    },
    e1() {
      if (this.e1 == 4) {
        this.loadFactor();
      }
    },
    save() {
      if (Boolean(this.save)) {
        this.$refs.have_item.saveBasket();
        this.next_btn = true;
      }
    },
  },
  methods: {
    addUser(tab, add) {
      this.loading = true;
      if (tab == 1 && Boolean(add)) {
        let form = {};
        form["first_name"] = this.first_name;
        form["last_name"] = this.last_name;
        form["phone"] = this.username;
        this.$reqApi("user/insert-customer", form)
          .then((response) => {
            this.user_id = response.id;
            this.$toast.success("کاربر با موفقیت ایجاد شد ");
            this.loading = false;
            this.show_btn_nex = true;
          })
          .catch((error) => {
            this.loading = false;
          });
        if (!Boolean(this.show_btn_nex)) {
          this.e1 = 2;
        }
      } else if (tab == 0) {
        this.user_id = this.user[0].id;
      }
      if (!Boolean(add)) {
        this.e1 = 2;
      }

      this.loading = false;
      this.basket_form.user_id = this.user_id;
    },

    pay() {
      this.loading = true;
      let form = {};
      form["user_id"] = this.user_id;
      if (this.price_value == "prepayment") {
        form["price"] = this.prepayment;
      } else {
        form["price"] = this.factor_list.price;
      }
      form["kind_set"] = this.kind_set;
      this.$reqApi("basket/manual-pay", form)
        .then((response) => {
          this.$toast.success("پرداخت با مو فقیت انجام شد");
          this.loading = false;
          this.e1 = 1;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    showBtn(event) {
      this.show_btn = event;
      this.save = false;
    },
    loadFactor() {
      this.loading = true;

      let info_basket = {};
      this.$reqApi("basket/list-personnel", { user_id: this.user_id })
        .then((response) => {
          let information = "";
          let info_user = "";
          if (response.model.data[0].delivery_info) {
            information = response.model.data[0].delivery_info;
            info_user = JSON.parse(information);
          }

          info_basket = {
            discount: response.model.data[0].discount,
            factor_number: response.model.data[0].factor_number,
            products_discount: response.model.data[0].products_discount,
            total_weight: response.model.data[0].total_weight,
            price: response.model.data[0].price,
            user: response.model.data[0].user,
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
    backStep() {
      this.e1 = 1;
    },
    changeNumber() {
      this.save = false;
    },
  },
};
</script>
<style scoped>
.box-basket {
  border: 3px dotted #00000059;
}
.box-items {
  border: 0.001cm solid #00000031;
}
.size-img {
  width: 100%;
  height: 100%;
}
</style>

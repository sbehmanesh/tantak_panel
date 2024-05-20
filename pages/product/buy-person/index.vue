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

              <v-stepper-step :complete="e1 > 3" step="3"> مشاهده فاکتور </v-stepper-step>
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
                :disabled="loading"
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
                :disabled="loading || !save"
              />
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row
              v-if="factor_list.user && !loading_factor"
              class="d-flex justify-center my-10"
            >
              <v-col cols="12" md="6">
                <v-row class="d-flex justify-center">
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
                    مجموع قیمت :
                    {{ $price(factor_list.price) }}
                    <small> ریال </small>
                  </v-col>
                  <v-col cols="6" class="box-items text-center">
                    تخفیف :
                    {{ $price(factor_list.products_discount) }}
                    <small> ریال </small>
                  </v-col>
                  <v-col cols="12" class="box-items text-center">
                    شماره فاکتور :
                    {{ factor_list.factor_number }}</v-col
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
                <v-col cols="12" md="3">
                  <amp-select
                    text="نوع پرداخت"
                    rules="require"
                    v-model="kind_set"
                    :items="kind_set_item"
                  />
                </v-col>
                <v-col cols="12" v-if="kind_set == 'cardToCard'" md="3">
                  <AmpUploadFile title="بارگذاری رسید" v-model="receipt_img" />
                </v-col>
              </v-row>
            </v-form>
            <v-row class="my-4 d-flex justify-center">
              <amp-button
                icon="arrow_circle_right"
                height="40"
                @click="e1 = 2"
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
export default {
  components: { UserSelectForm, Basket },
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
    first_name: "",
    last_name: "",
    username: "",
    user_id: "",
    receipt_img: "",
    kind_set: "",
    product_varcomb_id: "",
    length_item: "",
    title: "ثبت خرید",
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
    save() {
      if (Boolean(this.save)) {
        this.$refs.have_item.saveBasket();

        this.loadFactor();
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
      if (this.kind_set == "cardToCard") {
        if (!Boolean(this.receipt_img)) {
          this.$toast.error("بارگذاری رسید اجباریست");
          this.loading = false;
          return;
        } else {
          form["receipt_img"] = this.receipt_img;
        }
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
      this.loading_factor = true;

      let info_basket = {};
      this.$reqApi("basket/list-personnel", { user_id: this.user_id })
        .then((response) => {
          info_basket = {
            discount: response.model.data[0].discount,
            factor_number: response.model.data[0].factor_number,
            products_discount: response.model.data[0].products_discount,
            total_weight: response.model.data[0].total_weight,
            price: response.model.data[0].price,
            user: response.model.data[0].user,
          };
          this.factor_list = info_basket;
       
          
          this.next_btn = true;
          this.e1 = 3;
          this.loading_factor = false;
    
        })
        .catch((error) => {
          this.loading_factor = false;
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

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-stepper v-model="e1">
        <v-row class="d-flex justify-center">
          <v-col cols="10" md="5" class="mt-4">
            <v-stepper-header class="elevation-0">
              <v-stepper-step :complete="e1 > 1" step="1">
                انتخاب کاربر
              </v-stepper-step>

              <v-stepper-step :complete="e1 > 2" step="2">
                سبد خرید
              </v-stepper-step>

              <v-stepper-step :complete="e1 > 2" step="3"
                >تکمیل اطلاعات</v-stepper-step
              >

              <v-stepper-step :complete="e1 > 3" step="4">
                مشاهده فاکتور
              </v-stepper-step>
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
                      <amp-input
                        text="نام"
                        v-model="first_name"
                        rules="require"
                      />
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
                :disabled="
                  tab == 0 ? !user[0] || loading : loading || !valid_add_user
                "
              />
              <amp-button
                v-if="(tab == 1 && show_btn_nex) || tab == 0"
                icon="arrow_circle_left"
                height="40"
                @click="addUser(tab, false)"
                color="info darken-3"
                text="بعدی"
                :disabled="
                  tab == 0 ? !user[0] || loading : loading || !valid_add_user
                "
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
              <InPersoneFactory
                :basket-costumer-id="basket_costumer_id"
                :user-id="user_id"
                v-if="show_factory"
                @back="e1 = 3"
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
import InPersoneFactory from "@/components/Product/InPersoneFactory.vue";
export default {
  components: { UserSelectForm, Basket, CompleteInfo, InPersoneFactory },
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
    show_factory: false,
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
    overlay: false,
    title: "ثبت فروش",
    basket_form: {
      user_id: "",
    },
    factor_data: [],
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
        this.show_factory = true;
      } else {
        this.show_factory = false;
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

    showBtn(event) {
      this.show_btn = event;
      this.save = false;
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

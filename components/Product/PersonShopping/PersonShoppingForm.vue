<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-stepper v-model="e1">
        <v-row class="d-flex justify-center align-center">
          <v-col cols="10" md="6" class="mt-4">
            <v-stepper-header class="elevation-0">
              <v-stepper-step :complete="e1 > 1" step="1" color="blue-grey">
                انتخاب کاربر
              </v-stepper-step>

              <v-stepper-step color="blue-grey" :complete="e1 > 2" step="2">
                سبد خرید
              </v-stepper-step>

              <v-stepper-step color="blue-grey" :complete="e1 > 2" step="3">
                ثبت سبد خرید</v-stepper-step
              >

              <v-stepper-step color="blue-grey" :complete="e1 > 3" step="4">
                مشاهده فاکتور و پرداخت
              </v-stepper-step>
            </v-stepper-header>
          </v-col>
          <v-col cols="12" md="7" class="text-center">
            <v-btn text outlined v-if="e1 > 1" color="blue-grey" @click="e1--">
              <v-icon class="mx-2" color="blue-grey">
                arrow_circle_right
              </v-icon>
              برگشت به مرحله قبل
            </v-btn>
            <v-divider class="mt-4"></v-divider>
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="justify-center">
              <v-col cols="12" md="4">
                <CustomerInfo
                  @customer="customer_infos = $event"
                  @nextStep="e1 = 2"
                />
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <CreateBasket @selected_data="selectedData($event)" />
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="8" v-if="e1 == 3">
                <Factor
                  :information="selected_list"
                  :customer-infos="customer_infos"
                  @basketItems="basketItems($event)"
                  @nextStep="e1++"
                  :kind-set="kind_set"
                  @formData="setForm($event)"
                  ref="submitFinal"
                />
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-row class="d-flex justify-center" v-if="e1 == 4">
              <v-col cols="12" md="7">
                <PayFactory
                  :data="factor_data"
                  :form-data="form_data"
                  :user="customer_infos"
                  :user-id="user_id"
                  @payBasket="callPayApi($event)"
                  @backStep="e1--"
                  @editBasket="e1 = 2"
                />
              </v-col>
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
import InPersoneFactory from "~/components/Product/PersonShopping/InPersoneFactory.vue";
import CustomerInfo from "~/components/Product/PersonShopping/CustomerInfo.vue";
import CreateBasket from "~/components/Product/PersonShopping/CreateBasket.vue";
import Factor from "~/components/Product/PersonShopping/Factor.vue";
import PayFactory from "~/components/Product/PersonShopping/PayFactory.vue";
export default {
  components: {
    UserSelectForm,
    Basket,
    CompleteInfo,
    InPersoneFactory,
    CustomerInfo,
    CreateBasket,
    Factor,
    PayFactory,
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
    form_data: {},
    customer_infos: {},
    selected_list: {},
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
    selectedData(event) {
      this.selected_list = event;
      this.e1 = 3;
    },
    basketItems(event) {
      this.factor_data = event;
    },
    callPayApi(kind_set) {
      this.kind_set = kind_set;
    },
    setForm(event) {
      this.form_data = event;
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

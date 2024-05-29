<template>
  <v-card>
    <v-dialog
      persistent
      v-model="BasketDialog.show"
      :model-id="BasketDialog.items"
      fullscreen
    >
      <v-card style="overflow: hidden">
        <v-toolbar class="white--text" color="primary">
          <span class="font_20"> ثبت فروش فروش تلفنی </span>

          <v-spacer></v-spacer>
          <v-icon @click="closeDialog" color="white" size="26"> close </v-icon>
        </v-toolbar>

        <v-window v-model="step">
          <v-window-item :value="1">
            <AddProduct
              @add="addBasket($event)"
              v-if="dialog_add_product.show"
              :DialogAdd="dialog_add_product"
            />

            <v-row
              v-if="
                list_basket &&
                list_basket.items &&
                list_basket.items.length > 0 &&
                !loading
              "
            >
              <v-col cols="12">
                <div>
                  <AddProduct
                    @add="addBasket($event)"
                    v-if="dialog_add_product.show"
                    :DialogAdd="dialog_add_product"
                  />

                  <v-row
                    v-if="
                      list_basket &&
                      list_basket.items &&
                      list_basket.items.length > 0 &&
                      !loading
                    "
                  >
                    <v-col cols="12">
                      <amp-section text=" موجودی سبد خرید" />

                      <v-col cols="12" class="text-start">
                        <amp-button
                          icon="add_circle"
                          height="40"
                          @click="dialog_add_product.show = true"
                          color="orange darken-3"
                          text="افزودن محصول"
                        />
                      </v-col>
                      <div>
                        <v-row class="orange lighten-3 py-2 my-2">
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small> نام محصول</small>
                          </v-col>
                          <v-spacer />

                          <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                            <small> ویژگی های انتخابی محصول </small>
                          </v-col>
                          <v-spacer />
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small> تعداد</small>
                          </v-col>
                          <v-spacer />
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small> بارکد</small>
                          </v-col>
                          <v-spacer />
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small> قیمت محصول</small>
                          </v-col>
                          <v-spacer />
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small> مجموع قیمت</small>
                          </v-col>
                          <v-spacer />
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small>تصویر</small>
                          </v-col>
                          <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                            <small> حذف </small>
                          </v-col>
                        </v-row>
                        <v-col
                          v-if="loading && load_list"
                          v-for="i in 5"
                          :key="i"
                          class="ma-0 pa-0 text-center"
                          md="12"
                          cols="12"
                        >
                          <v-skeleton-loader
                            v-bind="attrs"
                            type="text"
                          ></v-skeleton-loader>
                        </v-col>
                        <div v-if="list_basket && list_basket.items">
                          <v-col
                            cols="12"
                            md="12"
                            v-for="(item, index) in list_basket.items"
                            :key="index"
                          >
                            <v-row>
                              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                                <small> {{ item.name }}</small>
                              </v-col>

                              <v-spacer />
                              <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                                <small> {{ item.information }}</small>
                              </v-col>

                              <v-spacer> </v-spacer>
                              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                                <v-row class="d-flex justify-center mt-1">
                                  <v-btn @click="addNumber(item, true)" x-small text>
                                    <v-icon small> add </v-icon>
                                  </v-btn>
                                  <small> {{ item.number }}</small>
                                  <v-btn
                                    :disabled="item.number == 1"
                                    @click="addNumber(item, false)"
                                    x-small
                                    text
                                  >
                                    <v-icon small> remove </v-icon>
                                  </v-btn>
                                </v-row>
                              </v-col>

                              <v-spacer />
                              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                                <small> {{ item.full_barcode }}</small>
                              </v-col>

                              <v-spacer />
                              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                                <small> {{ $price(item.price) }}</small>
                              </v-col>

                              <v-spacer />
                              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                                <small> {{ $price(item.price * item.number) }}</small>
                              </v-col>

                              <v-spacer />
                              <v-col class="ma-0 pa-0 text-center pr-13" md="1" cols="4">
                                <v-card
                                  elevation="0"
                                  max-width="50"
                                  class="mb-3 justify-center"
                                  max-height="50"
                                >
                                  <v-img
                                    class="size-img justify-center"
                                    :src="$getImage(item.main_image)"
                                    height="auto"
                                  />
                                </v-card>
                              </v-col>

                              <v-col class="ma-0 pa-0 text-center pr-3" md="1" cols="4">
                                <v-btn
                                  @click="deleFromCard(index, item)"
                                  x-small
                                  text
                                  class="justify-center"
                                >
                                  <v-icon small> delete </v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                            <v-divider></v-divider>
                          </v-col>
                        </div>
                        <v-row class="d-flex justify-center my-4">
                          <amp-button
                            icon="verified"
                            height="40"
                            @click="saveBasket"
                            color="success darken-2 "
                            class="ma-1"
                            text="ثبت سبد خرید "
                            :loading="loading"
                            :disabled="loading"
                          />
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>
                  <v-col
                    class="text-center"
                    cols="12"
                    v-if="
                      list_basket &&
                      (!list_basket.items || list_basket.items.length < 1) &&
                      !loading
                    "
                  >
                    <v-icon
                      @click="dialog_add_product.show = true"
                      class="justify-center"
                      size="180"
                      color="orange darken-1"
                    >
                      shopping_basket
                    </v-icon>

                    <v-row class="d-flex justify-center">
                      <small class="orange--text"> برای افزودن محصول کلیک کنید </small>
                    </v-row>
                    <br />
                    <br />

                    <v-row class="d-flex justify-center">
                      <v-btn plain color="red darken-3" text @click="backStep()">
                        برگشت
                        <v-icon size="18" class="mr-1"> arrow_circle_right </v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                </div>
              </v-col>
            </v-row>
            <v-col
              class="text-center"
              cols="12"
              v-if="
                list_basket &&
                (!list_basket.items || list_basket.items.length < 1) &&
                !loading
              "
            >
              <v-icon
                @click="dialog_add_product.show = true"
                class="justify-center"
                size="180"
                color="orange darken-1"
              >
                shopping_basket
              </v-icon>

              <v-row class="d-flex justify-center">
                <small class="orange--text"> برای افزودن محصول کلیک کنید </small>
              </v-row>
              <br />
              <br />
            </v-col>
          </v-window-item>

          <v-window-item :value="2">
            <v-row v-if="step_2" class="d-flex justify-center my-10">
              <v-col cols="12">
                <amp-section text="تکمیل اطلاعات" />
              </v-col>

              <v-col cols="12" md="10">
                <CompleteInfo
                  @load="loadFactor"
                  :basket_costumer_id="basket_costumer_id"
                  :user_id="this.user_basket.id"
                  :hide_btn="true"
                />
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item :value="3">
            <v-row class="d-flex justify-center">
              <v-col cols="12" v-if="factor_list.user && !loading && show_factor">
                <amp-section text="فاکتور فروش تلفنی" />
              </v-col>
              <v-col cols="12" md="6" v-if="factor_list.user && !loading && show_factor">
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

                <v-col cols="12">
                  <v-divider> </v-divider>
                </v-col>
                <v-col cols="12">
                  <v-form v-model="valid_pay">
                    <v-row class="d-flex justify-center">
                      <v-col cols="12" md="12">
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
                      icon="credit_card"
                      height="40"
                      @click="pay()"
                      color="info  "
                      class="ma-1"
                      text="پرداخت "
                      :loading="loading"
                      :disabled="loading || !valid_pay"
                    /> </v-row
                ></v-col>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <v-row class="d-flex justify-center mt-4">
           
              <v-col cols="2">
                <amp-button
                  block
                  height="40"
                  @click="step--"
                  color="red  "
                  class="ma-1"
                  text="برگشت"
                  :loading="loading"
                  :disabled="loading || step === 1"
                />
     
              </v-col> 
              <v-col cols="2">
              <amp-button
                  block
                  height="40"
                  @click="step++"
                  color="info  "
                  class="ma-1"
                  text=" بعدی"
                  :loading="loading"
                  :disabled="loading || step === 3"
                />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import AddProduct from "@/components/Product/AddProduct.vue";
import CompleteInfo from "@/components/Product/CompleteInfo.vue";
export default {
  props: {
    user_basket: {
      require: true,
    },
    BasketDialog: {
      require: false,
      default: false,
    },
  },
  components: { AddProduct, CompleteInfo },
  data: () => ({
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    number: 1,
    step: 1,
    valid_add_user: true,
    valid_pay: true,
    load_list: true,
    loading: false,
    next_btn: false,
    tab: null,
    user: [],
    products: [],
    list_basket: { items: [] },
    factor_list: {},
    main_image: "",
    first_name: "",
    last_name: "",
    username: "",
    show_factor: false,
    step_2: false,
    product_varcomb_id: "",
    length_item: "",
    basket_costumer_id: "",
    price_value: "",
    type_pay: [
      { text: "پرداخت به صورت کامل", value: "full" },
      { text: "پیش پرداخت", value: "prepayment" },
    ],
    prepayment: "",
    kind_set: "",
    kind_set_item: [
      { text: "کارت به کارت", value: "cardToCard" },
      { text: "ارسال لینک", value: "send_pay_link" },
    ],
    dialog_add_product: { show: false, items: null },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },

  watch: {
    "list_basket.items"() {
      let check = false;
      if (this.list_basket.items.length > 0) {
        check = true;
      } else {
        check = false;
      }
    },
    tab() {
      (this.user = []),
        (this.first_name = ""),
        (this.last_name = ""),
        (this.username = "");
    },

    // "list_basket.items"() {
    //   if (this.e1 == 3 ) {
    //     this.loadFactor()
    //   }
    // },
  },
  methods: {
    addBasket(event) {
      this.loading = true;
      let repetitious_item = false;

      for (let index = 0; index < this.list_basket.items.length; index++) {
        const element = this.list_basket.items[index];
        if (element.id == event.product.id) {
          element.number = element.number + event.number;
          repetitious_item = true;
          this.$toast.success(`${event.name} بروزرسانی شد `);
        }
      }

      if (!Boolean(repetitious_item)) {
        this.list_basket.items.unshift({
          information:
            event.product.variation1.variation_type.value +
            " " +
            event.product.variation1.value +
            " - " +
            event.product.variation2.variation_type.value +
            " " +
            event.product.variation2.value +
            " - " +
            event.product.variation3.variation_type.value +
            " " +
            event.product.variation3.value,
          number: event.number,
          price: event.product.price
            ? event.product.price
            : event.product.variation1.product.base_price,

          full_barcode: event.product.full_barcode,
          discount: event.product.discount,
          id: event.product.id,
          name: event.product.variation1.product.name,
          main_image: event.product.variation1.product.main_image,
        });
        this.$toast.success("محصول به سبد خرید اضافه شد");
      }
      this.$emit("list", this.list_basket);
      this.loading = false;
    },

    deleFromCard(key, item) {
      this.loading = true;
      let product = this.list_basket.items;
      product.splice(key, 1);
      this.$toast.success(`${item.name} از لیست خرید  حذف شد`);
      this.loading = false;
    },
    addNumber(item, add) {
      this.loading = true;
      if (Boolean(add)) {
        item.number++;
      } else {
        item.number--;
      }
      this.show_factor = false;
      this.loading = false;
    },
    saveBasket() {
      this.loading = true;
      let form = {};
      let items = [];
      form["user_id"] = this.user_basket.id;
      for (let index = 0; index < this.list_basket.items.length; index++) {
        const x = this.list_basket.items[index];
        items.push({
          number: x.number,
          product_varcomb_id: x.id,
        });
      }
      form["array_items"] = items;
      this.$reqApi("basketitem/insert", form)
        .then((response) => {
          this.basket_costumer_id = response;
          this.$toast.success("سبد خرید با موفقیت ثبت سبد");
          this.loading = false;
          this.step_2 = true;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    cleareBasket() {
      this.list_basket.items = [];
    },
    loadFactor() {
      this.loading = true;

      let info_basket = {};
      this.$reqApi("basket/list-personnel", { user_id: this.user_basket.id })
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
    pay() {
      this.loading = true;
      let form = {};
      form["user_id"] = this.user_basket.id;
      if (this.price_value == "prepayment") {
        form["price"] = this.prepayment;
      } else {
        form["price"] = this.factor_list.price;
      }

      form["kind_set"] = this.kind_set;
      this.$reqApi("basket/manual-pay", form)
        .then((response) => {
          this.$toast.success("پرداخت با مو فقیت انجام شد");
          this.closeDialog();
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    closeDialog() {
      this.BasketDialog.show = false;
      this.BasketDialog.items = null;
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

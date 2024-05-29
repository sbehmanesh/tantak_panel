<template>
  <div>
    <v-dialog
      persistent
      v-model="DialogCustomer.show"
      :model-id="DialogCustomer.items"
      fullscreen
    >
      <v-card>
        <v-card color="primary">
          <v-card-title>
            <span style="font-size: 21px" class="white--text"> اطلاعات مشتری</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog">
              <v-icon color="white" size="26"> cancel </v-icon>
            </v-btn>
          </v-card-title>

          <v-stepper v-model="step_index">
            <v-row class="justify-center mt-4">
              <v-stepper-step complete editable edit-icon="content_paste_search" step="1">
                <span class="font_16"> سوابق خرید </span>
                <small class="pt-2">
                  خریدهای ثبت شده برای
                  {{ username }}
                </small>
              </v-stepper-step>
              <v-stepper-step complete editable edit-icon="comment" step="2">
                <span class="font_16">نظرات </span>
                <small class="pt-2">نظرات ثبت شده برای مشتری</small>
              </v-stepper-step>

              <v-stepper-step complete editable edit-icon="account_circle" step="3">
                <span class="font_16"> تکمیل پروفایل </span>
                <small class="pt-2">
                  در صورت مغایرت اطلاعات ,اطلاعات را تکمیل کنید
                </small></v-stepper-step
              >
              <v-stepper-step complete editable edit-icon="account_circle" step="4">
                <span class="font_16"> سفارشات </span>
                <small class="pt-2"> لیست سفارشات باز مشتری </small></v-stepper-step
              >
            </v-row>

            <v-row class="justify-center">
              <v-col cols="9">
                <v-divider />
                <v-divider />
              </v-col>
            </v-row>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-window v-model="step_basket">
                  <v-row class="d-flex justify-center">
                    <v-col cols="6" class="center-div">
                  <v-row class="d-flex justify-center  mt-3 py-3 grey lighten-3">
                
                <span class="font_16">
                شما فقط سبد خرید های با
                <span class="font_17 primary--text">
                  وضعیت باز
                </span>
          
                 را میتوانید بروزرسانی کنید
                
                </span>
                </v-row>
                </v-col>
                  </v-row>
    

                  <v-window-item :value="1">
                    <v-col cols="12">
                      <BaseTable
                        url="basket/list-personnel"
                        :rootBody="root_body"
                        :headers="headers"
                        :BTNactions="item_basket"
                      />
                    </v-col>
                  </v-window-item>

                  <v-window-item :value="2">
                    <v-col cols="12" class="mt-5">
                      <!-- <BaseTable
                        url="basket-item"
                        :rootBody="{ basket_id: product_id }"
                        :headers="baskets"
                      /> -->
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
                        <v-col
                          v-if="show_update_btn"
                          class="ma-0 pa-0 text-center"
                          md="1"
                          cols="4"
                        >
                          <small> حذف </small>
                        </v-col>
                      </v-row>

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
                                <v-btn
                                  v-if="show_update_btn"
                                  @click="addNumber(item, true)"
                                  x-small
                                  text
                                >
                                  <v-icon small> add </v-icon>
                                </v-btn>
                                <small> {{ item.number }}</small>
                                <v-btn
                                  v-if="show_update_btn"
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

                            <v-col
                              v-if="show_update_btn"
                              class="ma-0 pa-0 text-center pr-3"
                              md="1"
                              cols="4"
                            >
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
                    </v-col>
                    <v-row class="d-flex justify-center">
                      <v-col cols="2">
                        <amp-button
                          block
                          height="40"
                          @click="step_basket--"
                          color="red darken-1 "
                          class="ma-1"
                          :text="disabl_update ? 'برگشت' : 'انصراف'"
                        />
                      </v-col>
                      <v-col cols="2" v-if="show_update_btn">
                        <amp-button
                          block
                          :disabled="loading || disabl_update"
                          :loading="loading"
                          height="40"
                          @click="updateBasket"
                          color="info darken-1 "
                          class="ma-1"
                          text="بروزرسانی"
                        />
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <v-col cols="12">
                      <BaseTable
                        url="user-comment"
                        :rootBody="root_body"
                        :headers="header_comments"
                        :BTNactions="btn_actions"
                      />
                    </v-col>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-col cols="12" v-for="(item, index) in question_form" :key="index">
                      <v-row>
                        <v-col cols="6" class="mr-2">
                          <h1 class="black--text font_13">
                            {{ index + 1 }} -
                            {{ item.question }}
                          </h1>

                          <small class="black--text mr-5">
                            {{ item.answer }}
                          </small>
                        </v-col>
                      </v-row>
                      <v-divider class="grey mt-2 lighten-3"></v-divider>
                    </v-col>
                    <v-row class="d-flex justify-center mt-4">
                      <v-col cols="3">
                        <amp-button
                          block
                          height="40"
                          @click="step--"
                          color="red darken-1 "
                          class="ma-1"
                          text="برگشت"
                        />
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-row class="d-flex justify-center">
                  <v-col md="9" cols="12" clss="center-div">
                    <v-row class="d-flex justify-center">
                      <v-col md="4" cols="12">
                        <amp-input text="نام مشتری" v-model="form.first_name" />
                      </v-col>
                      <v-col md="4" cols="12">
                        <amp-input v-model="form.last_name" text=" نام خانوادگی" />
                      </v-col>
                      <v-col md="4" cols="12">
                        <amp-input
                          v-model="form.email"
                          text="آدرس الکترونیکی"
                          rules="email"
                        />
                      </v-col>
                      <v-col md="12" cols="12">
                        <amp-textarea text="آدرس" v-model="form.address"></amp-textarea>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="d-flex justify-center mb-4">
                  <amp-button
                    text="تایید"
                    @click="profileCustomer()"
                    icon="done"
                    class="ma-1"
                    :disabled="loading"
                    :loading="loading"
                  ></amp-button>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="4">
                <BaseTable
                  url="basket/list-personnel"
                  :rootBody="root_body"
                  :headers="headers_basket"
                  :filters="filters"
                />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    DialogCustomer: {
      require: false,
      default: false,
    },
    customer: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    headers: [],
    headers_basket: [],
    item_basket: [],
    btn_actions: [],
    question_form: [],
    baskets: [],
    root_body: "",
    list_basket: { items: [] },
    comment: "",
    username: "",
    product_id: "",
    basket_id: "",
    overlay: false,
    disabl_update: true,
    filters: {},
    steps: 1,
    e1: 1,
    step_index: 1,
    step: 1,
    step_basket: 1,
    loading: false,
    show_update_btn: false,
    form: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
    },
  }),
  beforeMount() {
    this.root_body = { user_id: this.customer.id };
    this.btn_actions = [
      {
        text: "پاسخ های داده شده",
        icon: "chat",
        color: "info darken-2",
        fun: (body) => {
          this.step++;
          this.loadQusestions(body.answers);
        },
      },
    ];
    this.item_basket = [
      {
        text: "موجودی سبد خرید",
        icon: "shopping_basket",
        color: "info darken-2",
        fun: (body) => {
          this.step_basket++;
          this.product_id = body.id;

          this.loadListBAskets(body.id);
          if (body.status == "open") {
            this.show_update_btn = true;
          }else{
            this.show_update_btn = false;
          }
        },
      },
    ];
    this.filters = {
      status: {
        op: "=",
        value: "open",
      },
    };
    this.baskets = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      {
        text: "نام محصول",
        value: (body) => {
          if (body.product) {
            if (body.product.name) {
              return body.product.name;
            }
          }
        },
      },
      {
        text: "مشخصات محصول  ",

        value: "information",
      },
      {
        text: "قیمت محصول (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "تعداد محصول",
        value: "number",
      },
      {
        text: "جمع کل (ریال)",
        type: "price",
        value: (body) => {
          return body.price * body.number;
        },
      },

      {
        text: "بارکد",

        value: "full_barcode",
      },
    ];
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },

      {
        text: "وضعیت  سبد خرید",
        value: "status",
        filterType: "select",
        items: [
          {
            text: "پرداخت شده",
            value: "payed",
          },
          {
            text: "باز ",
            value: "open",
          },
          {
            text: "در انتظار",
            value: "waiting",
          },

          {
            text: "تکمیل شده ",
            value: "completed",
          },
          {
            text: "کنسل شده",
            value: "canceled",
          },
          {
            text: "ترکیبی ",
            value: "mixture",
          },
        ],
      },

      {
        text: "قیمت (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "تخفیف (ریال)",
        type: "price",
        value: "products_discount",
      },
      {
        text: "شماره فاکتور",

        value: "factor_number",
      },
    ];
    this.header_comments = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "ثبت کننده",
        value: (body) => {
          if (body.personnel) {
            if (body.personnel.first_name && body.personnel.last_name) {
              return body.personnel.first_name + " " + body.personnel.last_name;
            } else {
              return body.personnel.username;
            }
          }
        },
      },
      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "توضیحات",
        filterCol: "comment",
        type: "tooltip",
        function: (body) => {
          if (body.comment) {
            return body.comment;
          }
        },
        value: (body) => {
          if (typeof body.comment == "string") {
            if (body.comment.length < 25) {
              return body.comment;
            }
            return body.comment.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.headers_basket = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "قیمت (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "تخفیف (ریال)",
        type: "price",
        value: "products_discount",
      },
      {
        text: "شماره فاکتور",

        value: "factor_number",
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      // {
      //   text: "شماره همراه مشتری",
      //   value: (body) => {
      //     if (body.user) {
      //       if (body.user.username) {
      //         let start = body.user.username.slice(0, 3);
      //         let end = body.user.username.slice(-4);
      //         let phone_number = end + "****" + start;
      //         return phone_number;
      //       }
      //     }
      //   },
      // },
      // {
      //   text: "توضیحات",
      //   filterCol: "comment",
      //   type: "tooltip",
      //   function: (body) => {
      //     if (body.comment) {
      //       return body.comment;
      //     }
      //   },
      //   value: (body) => {
      //     if (typeof body.comment == "string") {
      //       if (body.comment.length < 25) {
      //         return body.comment;
      //       }
      //       return body.comment.slice(0, 25) + "...";
      //     } else {
      //       return "-";
      //     }
      //   },
      // },
    ];

    if (this.customer.username) {
      this.phoneNumber(this.customer.username);
    }
  },
  watch: {
    step_basket() {
      this.disabl_update = true;
    },
  },
  mounted() {
    this.loadProfile();
  },
  methods: {
    profileCustomer() {
      this.loading = true;
      let form = { ...this.form };
      form["id"] = this.customer.id;
      let url = "/user/profile";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("اطلاعات مشتری با موفقیت ویرایش شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadProfile() {
      this.loading = true;
      let url = "/user/profile";
      this.$reqApi(url, { id: this.customer.id })
        .then((res) => {
          this.loading = false;
          for (let key in res.user) {
            this.form[key] = res.user[key];
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.DialogCustomer.show = false;
      this.DialogCustomer.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    phoneNumber(username) {
      let start = username.slice(0, 3);
      let end = username.slice(-4);

      let phone_number = end + "****" + start;
      let name = this.customer.first_name
        ? this.customer.first_name + " " + this.customer.last_name
        : phone_number;
      this.username = name;
    },
    loadQusestions(answers) {
      // --------------------------
      this.loading = true;
      let ids = [];
      ids = JSON.parse(answers);
      this.$reqApi(`comment-question`)
        .then((res) => {
          let questions = [];
          for (let index = 0; index < res.model.data.length; index++) {
            const x = res.model.data[index];

            x.answers.map((y) => {
              questions.push({
                title: x.question,
                answer: y.answer,
                id: y.id,
              });
            });
          }
          this.loading = false;
          this.ctrateFormQuestions(ids, questions);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    ctrateFormQuestions(ids, questions) {
      let items = [];
      for (let index = 0; index < questions.length; index++) {
        const element = questions[index];
        ids.map((x) => {
          if (x == element.id) {
            items.push({
              question: element.title,
              answer: element.answer,
            });
          }
        });
      }
      this.question_form = items;
    },
    deleFromCard(key, item) {
      this.loading = true;
      let product = this.list_basket.items;
      product.splice(key, 1);
      this.$toast.success(`${item.name} از لیست خرید  حذف شد`);
      this.loading = false;
      this.disabl_update = false;
    },
    addNumber(item, add) {
      this.loading = true;
      if (Boolean(add)) {
        item.number++;
      } else {
        item.number--;
      }
      this.disabl_update = false;
      this.loading = false;
    },
    loadListBAskets(id) {
      this.loading = true;
      this.list_basket.items = [];
      this.$reqApi("basket-item", { basket_id: id })
        .then((response) => {
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            this.list_basket.items.push({
              information: x.information,

              number: x.number,
              price: x.price,

              full_barcode: x.full_barcode,
              discount: x.discount,
              id: x.product_varcomb_id,
              name: x.product.name,
              main_image: x.product.main_image,
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      // this.list_basket.items.unshift({
      //     information:
      //       event.product.variation1.variation_type.value +
      //       " " +
      //       event.product.variation1.value +
      //       " - " +
      //       event.product.variation2.variation_type.value +
      //       " " +
      //       event.product.variation2.value +
      //       " - " +
      //       event.product.variation3.variation_type.value +
      //       " " +
      //       event.product.variation3.value,
      //     number: event.number,
      //     price: event.product.price
      //       ? event.product.price
      //       : event.product.variation1.product.base_price,

      //     full_barcode: event.product.full_barcode,
      //     discount: event.product.discount,
      //     id: event.product.id,
      //     name: event.product.variation1.product.name,
      //     main_image: event.product.variation1.product.main_image,
      //   });
    },
    updateBasket() {
      this.loading = true;
      let form = {};
      let items = [];
      form["id"] = this.product_id;
      for (let index = 0; index < this.list_basket.items.length; index++) {
        const x = this.list_basket.items[index];
        items.push({
          number: x.number,
          product_varcomb_id: x.id,
        });
      }
      form["array_items"] = items;
      this.$reqApi("basket/update", form)
        .then((response) => {
          this.$toast.success("سبد خرید با موفقیت ویراش سبد");
          this.$emit("basket_costumer_id", response);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
  },
};
</script>

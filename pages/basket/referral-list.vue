<template>
  <v-window v-model="step">
    <RefralDialog
      :refralDialog="refral_basket"
      v-if="refral_basket.show"
      :basketId="ref_basket_id"
      @relod="refresh"
    />

    <PickedUp
      @closeDialog="closeDialog"
      @refresh="refresh"
      v-if="show_picked_up"
      :dialog="show_picked_up"
      :basketId="basket_id"
    />
    <v-window-item :value="1">
      <div>
        <v-row class="d-flex justify-center align-center mt-5">
          <v-col cols="12" md="4" class="text-center grey lighten-3">
            <span class="font_13">
              درصورت
              <span class="orange--text font_15"> حذف سبد خرید </span>

              , سفارش بسته شده و مبلغ به کیف پول کاربر برگردانده میشود
            </span>
          </v-col>
        </v-row>
        <v-col>
          <v-row cols="12" class="center-div mt-5">
            <v-chip
              dark
              label
              class="ma-2 px-3"
              color="teal"
              v-for="item in items"
              :key="item.key"
              @click="tab = item.key"
              :outlined="tab != item.key"
            >
              {{ item.text }}
            </v-chip>
          </v-row>
        </v-col>

        <BaseTable
          url="/basket/referral-list"
          :autoDelete="delete_url"
          :headers="headers"
          :actions="actions"
          :BTNactions="btn_actions"
          :rootBody="rootBody"
          :actionsList="actionsList"
          :filters="filter"
          ref="changeTable"
        />
        <v-dialog v-model="dialog_itesm.show">
          <v-card class="white pa-3">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>تاریخچه پرداخت ها</span>
              <v-btn icon color="error" @click="dialog_itesm.show = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text clsas="pa-5">
              <v-row>
                <v-col cols="12" md="12"> </v-col>
                <v-col cols="12" md="12" class="pa-8">
                  <template>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">مبلغ</th>
                            <th class="text-center">تاریخ پرداخت</th>
                            <th class="text-center">نوع پرداخت</th>
                            <th class="text-center">وضعیت</th>
                            <th class="text-center">توضیحات</th>
                            <th class="text-center">شناسه پرداخت</th>
                            <th class="text-center">عکس رسید</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in dialog_itesm.item"
                            :key="index"
                          >
                            <td dir="ltr">{{ $toJalali(item.created_at) }}</td>
                            <td><small>ریال</small>{{ $price(item.price) }}</td>
                            <td>{{ setKind(item.kind_set) }}</td>
                            <td>{{ setStatus(item.status) }}</td>
                            <td>{{ item.text }}</td>
                            <td>{{ item.transaction_number }}</td>
                            <td
                              class="d-flex justify-center align-center"
                              v-if="item.receipt_img"
                            >
                              <v-btn
                                @click="openFIle(item.receipt_img)"
                                color="primary"
                              >
                                <v-icon>image</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </template>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="wallet_transactoin.show">
          <v-card class="white pa-3">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>تاریخچه کیف پول</span>
              <v-btn
                icon
                color="error"
                @click="wallet_transactoin.show = false"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text clsas="pa-5">
              <v-row>
                <v-col cols="12" md="12"> </v-col>
                <v-col cols="12" md="12" class="pa-8">
                  <template>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">تاریخ پرداخت</th>
                            <th class="text-center">مبلغ</th>
                            <th class="text-center">نوع پرداخت</th>
                            <th class="text-center">توضیحات</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in wallet_transactoin.item"
                            :key="index"
                          >
                            <td dir="ltr">{{ $toJalali(item.created_at) }}</td>
                            <td>
                              <small>ریال</small>{{ $price(item.amount) }}
                            </td>
                            <td>
                              {{ item.type == "remove" ? "کاهش" : "افزایش" }}
                            </td>
                            <td>{{ item.description }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </template>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="change" max-width="500">
          <v-card class="px-6">
            <v-card-title>
              <span>ارجاع به واحد مالی</span>
            </v-card-title>
            <v-card-text>
              <amp-select
                text="تغییر وضعیت"
                v-model="form_change_step.step"
                :items="items_chagne"
              ></amp-select>
              <amp-textarea
                text="پیام"
                v-model="form_change_step.message"
              ></amp-textarea>
            </v-card-text>
            <v-card-actions class="center-div">
              <amp-button
                text="تایید"
                color="success"
                @click="changeStep"
                :disabled="valid"
                :loading="loading_for_chagne_status"
              />
              <amp-button text="انصراف" color="error" @click="change = false" />
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="show_history">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span> تاریخچه ارجاعات </span>
              <v-btn icon color="error" @click="show_history = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <BaseTable
                url="basket/referral-history"
                :rootBody="root_body_history"
                :headers="header_history"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-window-item>

    <v-window-item :value="2">
      <v-row class="d-flex justify-center">
        <v-col cols="12" class="mx-5">
          <Basket
            @backStep="step--"
            :itemsBasket="items_basket"
            :basketId="basket_id"
            :basketPrice="basket_price"
            :deliveryInfo="delivery_info"
            v-if="step == 2"
            @refresh="refresh"
          />
        </v-col>
      </v-row>
    </v-window-item>
  </v-window>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
import Basket from "@/components/Product/Coordiantor/Basket.vue";
import RefralDialog from "@/components/CallCenter/RefralDialog.vue";
import PickedUp from "@/components/CallCenter/PickedUp.vue";
import Dialog from "~/components/Tsaks/Dialog.vue";

let jmoment = require("moment");

export default {
  components: { BaseTable, Basket, RefralDialog, PickedUp, Dialog },
  props: {
    rootBody: { default: () => ({}) },
    filters: { default: () => ({}) },
    btnActions: { type: Array, default: () => [] },
    actionsList: { type: Array, default: () => [] },
  },
  data: () => ({
    delete_url: "",
    basket_id: "",
    ref_basket_id: "",
    step: 1,
    headers: [],
    filter: {},
    items: [],
    change: false,
    valid: false,
    is_coordinator: false,
    actions: [],
    form_change_step: {
      message: "",
      id: "",
      fiscal_manager_id: "",
    },
    tab: "all",
    items: [
      { text: "همه", key: "all" },
      { text: "کارهای امروز من", key: "my_today_work" },
      { text: "کارهای دارای تاخیر", key: "my_late_work" },
    ],
    loading_for_chagne_status: false,
    form: {},
    wallet_transactoin: {
      show: false,
      item: null,
    },
    firacl_memebers: [],
    items_chagne: [
      {
        text: "برگشت سبد خرید",
        value: "reject_fiscal_manager",
      },
      {
        text: "تایید سبد خرید",
        value: "accept_fiscal_manager",
      },
    ],
    kind_set_item: [
      { text: "کارت به کارت", value: "cardToCard" },
      { text: "ارسال لینک", value: "send_pay_link" },
      { text: "دستی", value: "manual" },
      { text: "پرداخت به اداره پست", value: "post" },
    ],
    
    status_items: [
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
        value: "wait",
      },
      {
        text: "عودت وجه",
        value: "owdat",
      },
      {
        text: "تکمیل شده ",
        value: "completed",
      },
      {
        text: "کنسل شده",
        value: "cancled",
      },
      {
        text: "ترکیبی ",
        value: "mixture",
      },
    ],
    title: "سبد های خرید",
    dialog_itesm: {
      show: false,
      item: null,
    },
    btn_actions: [],
    items_basket: [],
    item_id: "",
    basket_price: "",
    delivery_info: "",
    show_history: false,
    show_picked_up: false,
    root_body_history: {},
    refral_basket: { show: false, items: null },
    header_history: [],
    wallet_data: {
      show: false,
      item: null,
    },
    form: {
      fa_name: "",
      en_name: "",
      code: "",
    },
  }),
  watch: {
    tab() {
      switch (this.tab) {
        case "all":
          this.filter = {};
          break;
        case "my_today_work":
          this.filter = {
            allocation_at: {
              op: "=",
              value: (this.now = jmoment().format("YYYY-MM-DD")),
            },
          };
          break;
        case "my_late_work":
          this.filter = {
            allocation_at: {
              op: "<",
              value: jmoment(this.now).add(-1, "days").format("YYYY-MM-DD"),
            },
          };
          break;
      }
    },
  },
  beforeMount() {
    if (this.$route.query.filter == "my_today_work") {
      this.tab = "my_today_work";
    }
    if (this.$route.query.filter == "my_late_work") {
      this.tab = "my_late_work";
    }
    if (this.$route.query.filter == "all") {
      this.tab = "all";
    }
    if (this.$checkRole(this.$store.state.auth.role.coordinator_id)) {
      this.is_coordinator = true;
      this.delete_url = "basket/special-delete";
      this.items_chagne = [
        { text: "برگشت سبد خرید", value: "reject_coordinator" },
      ];
    }

    this.$store.dispatch("setPageTitle", this.title);
    this.header_history = [
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
        text: "پیام",
        value: "message",
      },
      {
        text: "نوع ارجاع",
        value: "text",
      },
      {
        text: "ارجاع دهنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.sender) {
            return `<span class='success--text mx-2'>${body.sender.first_name} ${body.sender.last_name} | ${body.sender.username}</span>`;
          }
        },
      },
      {
        text: "گیرنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.geter) {
            return `<span class='info--text mx-2'>${body.geter.first_name} ${body.geter.last_name} | ${body.geter.username}</span>`;
          } else {
            return "ندارد";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        color: "orange",
        icon: "change_circle",
        text: "برسی سفارش",
        fun: (body) => {
          if (body.id) {
            this.refral_basket.show = true;
            this.ref_basket_id = body.id;
          }
        },
        show_fun: (body) => {
          if (body.step == "agency_to_stockclerk") {
            if (body.status_stock == "done") {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        },
      },
      {
        text: "تاریخچه پرداخت",
        icon: "list",
        color: "info darken-2",
        fun: (body) => {
          if (body.payments.length > 0) {
            this.dialog_itesm.show = true;
            this.dialog_itesm.item = body.payments;
          }
        },
        show_fun: (body) => {
          if (body.payments.length > 0) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تاریخچه کیف پول",
        icon: "account_balance_wallet",
        color: "success darken-2",
        fun: (body) => {
          if (body.wallet_transactions.length > 0) {
            this.wallet_transactoin.show = true;
            this.wallet_transactoin.item = body.wallet_transactions;
          }
        },
        show_fun: (body) => {
          if (body.wallet_transactions.length > 0) {
            return true;
          } else {
            return false;
          }
        },
      },

      {
        color: "primary",
        icon: "list",
        text: "تاریخچه ارجاعات",
        fun: (body) => {
          if (body.id) {
            this.history_basket_id = body.id;
            this.show_history = true;
            this.root_body_history = { basket_id: body.id };
          }
        },
      },
      {
        text: "برداشت از انبار",
        icon: "change_circle",
        color: "success",
        fun: (body) => {
          this.show_picked_up = true;
          this.basket_id = body.id;
        },
        show_fun: (body) => {
          if (
            body.step == "agency_to_stockclerk" &&
            body.status_stock == "wait"
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      // {
      //   text: "تغییر وضعیت",
      //   icon: "change_circle",
      //   color: "teal",
      //   fun: (body) => {
      //     this.change = true;
      //     this.item_id = body.id;
      //   },
      //   show_fun: (body) => {
      //     if (body.step == "refer_coordinator") {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   },
      // },
      {
        text: "جزییات سبد ",
        icon: "shopping_basket",
        color: "red darken-3",
        fun: (body) => {
          this.step++;
          this.items_basket = body.items;
          this.basket_price = body.price;
          this.basket_id = body.id;
          this.delivery_info = body.delivery_info;
        },
        show_fun: (body) => {
          if (body.status != "wait_discount") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  mounted() {
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
        disableSort: "true",
        filterable: false,
        text: "نام",
        value: (body) => {
          if (body.user) {
            return body.user.first_name;
          }
        },
      },
      {
        disableSort: "true",
              filterCol: "created_at",

        text: "نام خانوادگی",
        value: (body) => {
          if (body.user) {
            return body.user.last_name;
          }
        },
      },
      {
        text: "شماره تماس",
        type: "phone",
        value: (body) => {
          if (body.user) {
            return body.user.username;
          }
        },
        show_fun: (body) => {
          if (
            this.$store.state.auth.action.indexOf(
              "messages/issabel_request_call"
            ) > -1
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "شماره فاکتور",
        value: "factor_number",
      },
      {
        text: "مبلغ قابل پرداخت",
        filterCol: "price",
        value: (body) => {
          if (body.price) {
            return `${this.$price(body.price)} ریال`;
          } else {
            return "__";
          }
        },
      },

      {
        text: "جمع کل سبد خرید",
        filterCol: "base_price",
        value: (body) => {
          if (body.base_price) {
            return `${this.$price(body.base_price)} ریال`;
          } else {
            return "__";
          }
        },
      },
      {
        text: "تخفبف هماهنگ کننده",
        filterCol: "discount_coordinat",
        value: (body) => {
          if (body.discount_coordinat) {
            return `${this.$price(body.discount_coordinat)} ریال`;
          } else {
            return "__";
          }
        },
      },
      {
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.$store.state.static.step_basket_refral,
      },
      {
        text: " زمان تخصیص",
        filterType: "date",
        filterCol: "allocation_at",
        value: (body) => {
          if (body.allocation_at) {
            return this.$toJalali(body.allocation_at);
          }
          return "";
        },
      },
      {
        text: "وضعیت سبد",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_basket_refral
        

      },
      {
        text: "وزن",
        value: "total_weight",
      },
      {
        text: "وضعیت  انبار",
        filterType: "select",
        value: "status_stock",
        items: this.$store.state.static.status_stock

      },

      {
        text: "کیف پول",
        filterCol: "wallet",
        value: (body) => {
          let items = [];
          items.push(
            `<span class="green--text font_10">کیف پول نقدی : ${body.user.cash_wallt.toLocaleString()} ریال</span>`
          );
          items.push(
            `<span class="primary--text font_10">کیف پول اعتباری  : ${body.user.credit_wallt.toLocaleString()} ریال</span>`
          );

          return items.join("<br>");
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.show_picked_up = false;
    },
    loadFiscal() {
      this.$reqApi("/user/fiscal-manager", { row_number: 300 })
        .then((res) => {
          let user = [];
          let data = res.model.data;
          data.map((x) => {
            user.push({
              text: `${x.first_name} ${x.last_name} | ${x.username}`,
              value: x.id,
            });
          });
          this.firacl_memebers = user;
        })
        .catch((err) => {
          return err;
        });
    },
    setKind(value) {
      let text = "-";
      this.kind_set_item.map((x) => {
        if (x.value == value) {
          text = x.text;
        }
      });
      return text;
    },
    openFIle(img) {
      window.open(`${this.$store.state.file_url}/${img}`);
    },
    setStatus(value) {
      let text = "-";
      this.status_items.map((x) => {
        if (x.value == value) {
          text = x.text;
        }
      });
      return text;
    },
    changeStep() {
      this.loading_for_chagne_status = true;
      let form = {};
      if (Boolean(this.is_coordinator)) {
        form["id"] = this.item_id;
        form["step"] = this.form_change_step.step;
        form["message"] = this.form_change_step.message;
      } else {
        this.form_change_step.id = this.item_id;
        form = { ...this.form_change_step };
      }

      this.$reqApi("/basket/referral", form)
        .then((res) => {
          this.loading_for_chagne_status = false;
          this.change = false;
          this.$toast.success("سفارش با موفقیت ارجاع داده شد");
          this.$refs.changeTable.getDataFromApi();
        })
        .catch((err) => {
          this.loading_for_chagne_status = false;
          return err;
        });
    },
    refresh() {
      this.$refs.changeTable.getDataFromApi();
      this.step = 1;
    },
  },
};
</script>

<style>
.counter_col {
  border: 1px solid gray;
  margin: 5px 0px;
}
</style>

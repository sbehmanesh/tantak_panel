<template>
  <v-window v-model="step">
    <RefralDialog
      :refralDialog="refral_basket"
      v-if="refral_basket.show"
      :basketId="ref_basket_id"
      @relod="refresh"
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

        <BaseTable
          url="/basket/referral-list"
          :autoDelete="delete_url"
          :headers="headers"
          :actions="actions"
          :BTNactions="btn_actions"
          :rootBody="rootBody"
          :actionsList="actionsList"
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

export default {
  components: { BaseTable, Basket, RefralDialog },
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
    step_status: [
      { text: "ثبت اولیه", value: "init" },
      { text: "بسته شده", value: "reject" },
      { text: "ارجاع به مدیر واحد مالی", value: "refer_fiscal_manager" },
      { text: "یرگشت از مدیر واحد مالی", value: "reject_fiscal_manager" },
      {
        text: "ارجاع از مدیر واحد مالی به سرپرست",
        value: "manager_supervisor_fiscal",
      },
      {
        text: "برگشت از سرپرست به مدیر واحد مالی",
        value: "supervisor_manager_fiscal",
      },
      { text: "ارجاع از سرپرست به واحد مالی", value: "supervisor_to_fiscal" },
      { text: "برگشت از واحد مالی به سرپرست", value: "fiscal_to_supervisor" },
      { text: "تایید واحد مالی", value: "accept_fiscal" },
      {
        text: "ارجاع به مدیر هماهنگ کننده",
        value: "admin_manager_coordinator",
      },
      {
        text: "برگشت از مدیر هماهنگ کننده به ادمین",
        value: "manager_admin_coordinator",
      },
      {
        text: "ارجاع مدیر به سرپرست هماهنگ کننده",
        value: "manager_supervisor_coordinator",
      },
      {
        text: "برگشت سرپرست به مدیر هماهنگ کننده",
        value: "supervisor_manager_coordinator",
      },
      {
        text: "ارجاع سرپرست هماهنگ کننده به هماهنگ کننده",
        value: "supervisor_to_coordinator",
      },
      {
        text: "برگشت از هماهنگ کننده به سرپرست",
        value: "coordinator_to_supervisor",
      },

      {
        text: "تایید واحد هماهنگی",
        value: "accept_coordinator",
      },
      {
        text: "ادمین به مدیر هماهنگی ارسال ",
        value: "admin_manager_send",
      },
      {
        text: "مدیر هماهنگی به ادمین",
        value: "manager_admin_send",
      },
      {
        text: "مدیر به سرپرست هماهنگی ارسال",
        value: "manager_supervisor_send",
      },
      {
        text: "سرپست به مدیر هماهنگی ارسال ",
        value: "supervisor_manager_send",
      },
      {
        text: "سرپرست به هماهنگی ارسال",
        value: "supervisor_to_send",
      },
      {
        text: " هماهنگی ارسال به سرپرست",
        value: "send_to_supervisor",
      },
      {
        text: "ارجاع به نمایندگی",
        value: "send_to_agency",
      },
      {
        text: "برگشت به هماهنگ کننده ارسال",
        value: "agency_to_send",
      },
      {
        text: "agency_to_stockclerk",
        value: "ارجاع از نمایندگی به انبار دار",
      },
      {
        text: "برگشت از انبار دار به نمایندگی",
        value: "stockclerk_to_agency",
      },
      {
        text: "کارمند به انبار دار",
        value: "employee_to_stockclerk",
      },
      {
        text: "stockclerk_to_employee",
        value: "ارجاع انبار دار به کارمند نمایندگی",
      },
      {
        text: "ارجاع کارمند به پیک",
        value: "employee_to_courier",
      },
      {
        text: "ارجاع از پیک به کارمند",
        value: "courier_to_employee",
      },
      {
        text: "تحویل داده شده",
        value: "done",
      },
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
  beforeMount() {
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
      // {
      //   text: "تغییر وضعیت",
      //   icon: "change_circle",
      //   color: "success",
      //   fun: (body) => {
      //     this.change = true;
      //     this.item_id = body.id;
      //   },
      //   show_fun: (body) => {
      //     if (body.step == "refer_fiscal_manager") {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   },
      // },
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
        filterable: false,
        text: "نام خانوادگی",
        value: (body) => {
          if (body.user) {
            return body.user.last_name;
          }
        },
      },
      {
        disableSort: "true",
        filterable: false,
        text: "شماره تماس",
        value: (body) => {
          if (body.user) {
            return body.user.username;
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
        items: this.step_status,
      },
      {
        text: "وضعیت سبد",
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
          {
            text: "منتظر تایید تخفیف ",
            value: "wait_discount",
          },
        ],
      },
      {
        text: "وزن",
        value: "total_weight",
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

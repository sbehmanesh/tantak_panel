<template>
  <div>
    <BaseTable
      url="/basket/referral-list"
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
                        <th class="text-center">نوع پرداخت</th>
                        <th class="text-center">تاریخ پرداخت</th>
                        <th class="text-center">وضعیت</th>
                        <th class="text-center">توضیحات</th>
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
          <v-btn icon color="error" @click="wallet_transactoin.show = false">
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
                        <td><small>ریال</small>{{ $price(item.amount) }}</td>
                        <td>{{ item.type == "remove" ? "کاهش" : "افزایش" }}</td>
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
    <v-overlay v-if="change">
      <v-card min-width="600" class="px-6 primary lighten-1">
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
    </v-overlay>
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
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  props: {
    rootBody: { default: () => ({}) },
    filters: { default: () => ({}) },
    btnActions: { type: Array, default: () => [] },
    actionsList: { type: Array, default: () => [] },
  },
  data: () => ({
    headers: [],
    items: [],
    change: false,
    valid: false,
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
    ],
    step_status: [
      {
        text: "ارجاع به واحد مالی",
        value: "refer_fiscal_manager",
      },
      {
        text: "تایید واحد مالی",
        value: "accept_fiscal_manager",
      },
      {
        text: "عدم تایید واحد مالی",
        value: "reject_fiscal_manager",
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
    title: "سبد های خرید",
    dialog_itesm: {
      show: false,
      item: null,
    },
    btn_actions: [],
    item_id: "",
    show_history: false,
    root_body_history: {},
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
        text: "تاریخچه پرداخت",
        icon: "list",
        color: "info darken-2",
        fun: (body) => {
          if (body.payments.length > 0) {
            this.dialog_itesm.show = true;
            this.dialog_itesm.item = body.payments;
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
        text: "تغییر وضعیت",
        icon: "change_circle",
        color: "success",
        fun: (body) => {
          this.change = true;
          this.item_id = body.id;
        },
        show_fun: (body) => {
          if (body.step == "refer_fiscal_manager") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  mounted() {
    // this.loadFiscal()
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
        text: "مبلغ",
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
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.step_status,
      },
      {
        text: "محصول",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.items) {
            let items = [];
            body.items.map((x) => {
              items.push(`${x.product.name} | ${x.information}`);
            });
            return items.join(" , ");
          } else {
            return "-";
          }
        },
      },
      {
        text: "وزن",
        value: "total_weight",
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
      this.form_change_step.id = this.item_id;
      this.$reqApi("/basket/referral", this.form_change_step)
        .then((res) => {
          this.loading_for_chagne_status = false;
          this.change = false;
          this.$refs.changeTable.getDataFromApi();
        })
        .catch((err) => {
          this.loading_for_chagne_status = false;
          return err;
        });
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

<template>
  <v-row class="d-flex justify-center mt-5">
    <v-col cols="12">
      <BaseTable
        url="/product-request"
        :headers="headers"
        :extraBtn="extra_btn"
        :BTNactions="btn_actions"
        :actionsList="actions_list"
        ref="ProductRequest"
      />
    </v-col>
    <v-col cols="12" md="8">
      <Dialog
        :dialog="show_dialog"
        :request="request"
        :basketId="basket_id"
        v-if="show_dialog"
        @closeDialog="show_dialog = false"
        @reload="refresh"
      />
      <CheckOrder
        :dialog="check_order"
        :basketId="basket_id"
        v-if="check_order"
        @closeDialog="check_order = false"
        @reload="refresh"
      />
      <HistoryInventoryRequest
        v-if="dialog_history.show"
        :dialogHistory="dialog_history"
        :messageId="id_message"
      />
      <DialogRefral
        :dialog="show_refral"
        :basketId="basket_id"
        :stepInvitor="step_invitor"
        :statusPayment="status_payment"
        v-if="show_refral"
        @closeDialog="show_refral = false"
        @reload="refresh"
      />
      <DialogTransactions
        :dialog="add_transaction"
        :data="all_data"
        v-if="add_transaction"
        @closeDialog="add_transaction = false"
        @reload="refresh"
      />
      <DialogCancel
        :dialog="show_cansel"
        :getApi="get_api"
        v-if="show_cansel"
        @closeDialog="show_cansel = false"
        @reload="refresh"
      />
      <HistoryWallet
        :walletDialog="show_wallet"
        :walletData="wallet_data"
        v-if="show_wallet"
        @closeDialog="show_wallet = false"
        @reload="refresh"
      />
    </v-col>
  </v-row>
</template>

<script>
import Dialog from "@/components/NewCallCenter/InventoryRequest/Dialog.vue";
import HistoryInventoryRequest from "~/components/NewCallCenter/InventoryRequest/HistoryInventoryRequest.vue";
import DialogCancel from "~/components/NewCallCenter/InventoryRequest/DialogCancel.vue";
import DialogRefral from "@/components/NewCallCenter/InventoryRequest/DialogRefral.vue";
import DialogTransactions from "@/components/NewCallCenter/InventoryRequest/DialogTransactions.vue";
import HistoryWallet from "~/components/NewCallCenter/InventoryRequest/HistoryWallet.vue";
import CheckOrder from "~/components/NewCallCenter/InventoryRequest/CheckOrder.vue";
export default {
  components: {
    Dialog,
    DialogRefral,
    DialogTransactions,
    HistoryInventoryRequest,
    DialogCancel,
    HistoryWallet,
    CheckOrder,
  },
  data: () => ({
    title: "درخواست موجودی",
    headers: [],
    payments: [],
    all_data: [],
    extra_btn: [],
    actions_list: [],
    btn_actions: [],
    show_dialog: false,
    show_refral: false,
    add_transaction: false,
    request: "",
    step_invitor: "",
    show_cansel: false,
    check_order: false,
    get_api: "",
    basket_id: "",
    show_wallet: false,
    wallet_data: null,
    dialog_history: {
      show: false,
      items: null,
    },
    status_payment: "",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
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
        text: "مجموع قیمت (ریال)",
        type: "price",
        value: "total_price",
      },
      {
        text: "وزن (گرم)",
        type: "price",
        value: "total_weight",
      },
      {
        text: "شماره فاکتور",
        value: "order_number",
      },
      {
        text: "کد نمایندگی",
        value: "agency_code",
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_invitor,
      },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.step_invitor,
      },
      {
        text: "نوع",
        value: "type",
        filterType: "select",
        items: this.$store.state.static.type_invitor,
      },
      {
        text: "وضعیت پرداخت",
        value: "status_payment",
        filterType: "select",
        items: this.$store.state.static.status_payment_invitor,
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    this.extra_btn = [
      {
        text: "درخواست موجودی",
        color: "primary darkeb-2",
        icon: "add_shopping_cart",
        fun: (body) => {
          this.show_dialog = true;
          this.request = true;
          this.basket_id = "";
        },
      },
    ];
    this.btn_actions = [
      {
        color: "primary",
        icon: "history",
        text: "تاریخچه سفارش",
        fun: (body) => {
          if (body.id) {
            this.dialog_history.show = true;
            this.id_message = body.id;
          }
        },
      },
      {
        text: "‌بررسی روند ارجاع ",
        color: "blue darken-1",
        icon: "event_repeat",
        fun: (body) => {
          this.show_refral = true;
          this.basket_id = body.id;
          this.status_payment = body.status_payment;
          this.step_invitor = body.step;
        },
        show_fun: (body) => {
          let show = false;
          if (Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))) {
            show = false;
          } else if (
            Boolean(this.$checkRole(this.$store.state.auth.role.sale_manager))
          ) {
            show = false;
          } else if (
            Boolean(this.$checkRole(this.$store.state.auth.role.agency_manager))
          ) {
            if (
              (body.step == "accept_employee_sale" &&
                body.status_payment == "payed") ||
              body.step == "init"
            ) {
              show = true;
            }
          } else {
            show = true;
          }

          return show;
        },
      },
      {
        text: "ایجاد تراکنش",
        color: "teal darkeb-2",
        icon: "post_add",
        fun: (body) => {
          this.createPayment(body.id);
        },
        show_fun: (body) => {
          if (
            Boolean(
              this.$checkRole(this.$store.state.auth.role.sales_expert) &&
                body.step == "supervisor_to_employee_sale" &&
                body.status_payment == "none"
            )
          ) {
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
            this.show_wallet = true;
            this.wallet_data = body.wallet_transactions;
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
        text: "برسی سفارش",
        icon: "account_balance_wallet",
        color: "teal",
        fun: (body) => {
          this.check_order = true;
          
          this.basket_id = body.id;
        },
        show_fun: (body) => {
          if (
            body.step == "pack_and_send" ||
            this.$store.state.auth.action.indexOf("product_requests/root") > -1
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.actions_list = [
      {
        text: "مشاهده جزییات",

        fun: (body) => {
          this.show_dialog = true;
          this.request = false;
          this.basket_id = body.id;
        },
      },
      {
        text: "کنسل کردن سفارش",
        fun: (body) => {
          this.show_cansel = true;
          this.get_api = body.id;
        },
        show_fun: (body) => {
          if (
            Boolean(
              (body.status == "init" || body.status == "wait") &&
                (this.$checkAccess("product_requests/root") ||
                  this.$checkRole(this.$store.state.auth.role.seal_manager))
            )
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "مشاهده  تراکنش",
        color: "teal darkeb-2",
        icon: "receipt_long",
        fun: (body) => {
          this.add_transaction = true;
          this.all_data = body;
          this.$reqApi("/product-request");
        },
        show_fun: (body) => {
          if (
            body.payments &&
            Array.isArray(body.payments) &&
            body.payments.length > 0
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },

  methods: {
    refresh() {
      this.$refs.ProductRequest.getDataFromApi();
    },
    createPayment(id) {
      this.$reqApi("product-request/insert-payment", { id: id })
        .then((res) => {
          this.$toast.success("تراکنش با موفقیت ایجاد شد");
          this.refresh();
        })
        .catch((err) => {});
    },
  },
};
</script>
<style scoped></style>

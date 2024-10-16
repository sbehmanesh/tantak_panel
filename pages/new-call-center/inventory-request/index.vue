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
        :data="data"
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
      <AddTransactions
        :dialog="create_transactions"
        :requestId="request_id"
        v-if="create_transactions"
        @closeDialog="create_transactions = false"
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
import AddTransactions from "~/components/NewCallCenter/InventoryRequest/AddTransactions.vue";

export default {
  components: {
    Dialog,
    DialogRefral,
    DialogTransactions,
    HistoryInventoryRequest,
    DialogCancel,
    HistoryWallet,
    CheckOrder,
    AddTransactions,
  },
  data: () => ({
    title: "درخواست موجودی",
    headers: [],
    payments: [],
    all_data: {},

    actions_list: [],
    btn_actions: [],
    show_dialog: false,
    add_transaction: false,
    create_transactions: false,
    show_refral: false,
    request: "",
    request_id: "",
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
    data: {},
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
        color: "blue darkeb-1",
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
            show = true;
          } else if (
            Boolean(this.$checkRole(this.$store.state.auth.role.agency_manager))
          ) {
            if (
              body.step == "init" ||
              (body.step == "accept_employee_sale" &&
                body.status_payment == "payed") ||
              body.step == "accept_fiscal"
            ) {
              show = true;
            }
          } else if (
            this.$checkRole(this.$store.state.auth.role.sales_expert) &&
            body.status_payment == "wait"
          ) {
            show = true;
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
          this.create_transactions = true;
          this.request_id = body.id;
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
        text: "لیست تراکنش ها",
        color: "teal darkeb-2",
        icon: "list",
        fun: (body) => {
          this.add_transaction = true;
          this.all_data = body;
        },
        show_fun: (body) => {
          if (body.status_payment != "none" && body.payments.length > 0) {
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
          this.data = body;
        },
        show_fun: (body) => {
          if (body.step == "sefir_to_agency_manager" && Boolean(this.$checkRole(this.$store.state.auth.role.agency_manager))) {
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
    ];
  },
  computed: {
    extra_btn() {
      if (
        Boolean(
          this.$store.state.auth.action.indexOf("product_requests/insert") > -1
        )
      ) {
        return [
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
      } else {
        return [];
      }
    },
  },
  methods: {
    refresh() {
      this.$refs.ProductRequest.getDataFromApi();
    },
  },
};
</script>
<style scoped></style>

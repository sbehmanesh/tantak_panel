<template>
  <div>
    <v-window v-model="step">
      <v-window-item :value="1">
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
          url="/debt"
          :headers="headers"
          :filters="filter"
          autoDelete="/debt/delete"
          :BTNactions="btn_actions"
          ref="DebtsList"
        />
      </v-window-item>
      <v-window-item :value="2">
        <History
          :model-id="id"
          v-if="show_history && step == 2"
          @backStep="step--"
        />
      </v-window-item>
    </v-window>
    <DebtDialog
      :data="data"
      :dialog="show_debt"
      v-if="show_debt"
      @cloasDialog="show_debt = false"
    />
    <DialogRefral
      :model-id="id"
      :dialog="show_refral"
      :stepOrder="step_order"
      v-if="show_refral"
      @closeDialog="show_refral = false"
      @reload="refresh"
    />
    <AddTransactions
      :dialog="create_transactions"
      :requestId="id"
      v-if="create_transactions"
      @closeDialog="create_transactions = false"
      @reload="refresh"
    />
    <DialogTransactions
      :dialog="add_transaction"
      :data="respons"
      v-if="add_transaction"
      @closeDialog="add_transaction = false"
      @reload="refresh"
    />
  </div>
</template>

<script>
import History from "@/components/NewCallCenter/Debt/History.vue";
import DebtDialog from "@/components/NewCallCenter/Debt/DebtDialog.vue";
import DialogRefral from "@/components/NewCallCenter/Debt/DialogRefral.vue";
import AddTransactions from "~/components/NewCallCenter/Debt/AddTransactions.vue";
import DialogTransactions from "@/components/NewCallCenter/Debt/DialogTransactions.vue";
let jmoment = require("moment");
export default {
  components: {
    DebtDialog,
    History,
    DialogRefral,
    AddTransactions,
    DialogTransactions,
  },
  data: () => ({
    headers: [],
    data: [],
    respons: [],
    tab: "all",
    items: [
      { text: "همه", key: "all" },
      { text: "کارهای امروز من", key: "my_today_work" },
      { text: "کارهای دارای تاخیر", key: "my_late_work" },
    ],
    btn_actions: [],
    title: "لیست بدهکاری ها ",
    show_debt: false,
    show_history: false,
    show_refral: false,
    add_transaction: false,
    create_transactions: false,
    id: "",
    step_order: "",
    filter: {},
    step: 1,
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
      { text: "نام کاربر", value: "first_name" },
      { text: "نام خانوادگی کاربر", value: "last_name" },
      { text: "شماره تماس", value: "username" },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_payment_invitor,
      },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.step_debts,
      },

      {
        filterable: false,
        disableSort: true,
        filterType: "pay_date",
        filterCol: "pay_date",
        text: "تاریخ پرداخت",
        value: (body) => {
          if (body.pay_date) {
            return this.$toJalali(body.pay_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "پرداخت نشده";
        },
      },
      {
        text: "شماره سفارش",
        value: (body) => {
          if (
            Boolean(body.section_name == "ProductRequest") &&
            body.product_request &&
            Object.keys(body.product_request).length > 0
          ) {
            return body.product_request.order_number;
          } else if (body.basket && Object.keys(body.basket).length > 0) {
            return body.basket.factor_number;
          }
        },
      },
      { text: "مقدار (ریال)", value: "amount", type: "price" },
      { text: "پیام", value: "text_log" },
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
    ];
    this.btn_actions = [
      {
        text: "جزییات ",
        color: "red",
        fun: (body) => {
          let data = JSON.parse(body.data);
          this.data = data;
          this.show_debt = true;
        },
      },
      {
        text: "تاریخچه ",
        color: "red",
        fun: (body) => {
          this.id = body.id;
          this.show_history = true;
          this.step++;
        },
        show_fun: (body) => {
          if (
            body.step != "init" &&
            this.$store.state.auth.action.indexOf("debts/logs") > -1
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "برسی روند ارجاع ",
        color: "red",
        fun: (body) => {
          this.id = body.id;
          this.show_refral = true;
          this.step_order = body.step;
        },
        show_fun: (body) => {
          if (
            Boolean(
              this.$store.state.auth.action.indexOf("debts/referral") > -1
            )
          ) {
            if (
              this.$checkRole(
                this.$store.state.auth.role.superviser_centeral_stock
              )
            ) {
              if (body.payments.length > 0) {
                return true;
              } else {
                return false;
              }
            }

            if (
              this.$checkRole(this.$store.state.auth.role.sefir) &&
              (body.step == "init" ||
                body.step == "reviewer_to_debtor" ||
                body.step == "accept_reviewer")
            ) {
              return true;
            } else if (
              !Boolean(this.$checkRole(this.$store.state.auth.role.sefir))
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        },
      },
      {
        text: "ایجاد تراکنش",
        color: "red",
        icon: "post_add",
        fun: (body) => {
          this.create_transactions = true;
          this.id = body.id;
        },
        show_fun: (body) => {
          if (
            Boolean(
              this.$checkRole(
                this.$store.state.auth.role.superviser_centeral_stock
              ) &&
                body.step == "debtor_to_reviewer" &&
                body.payments.length == 0
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
        color: "red",
        fun: (body) => {
          this.add_transaction = true;
          this.respons = body;
        },
        show_fun: (body) => {
          if (body.status_payment != "none" && body.payments.length > 0) {
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
      this.$refs.DebtsList.getDataFromApi();
    },
  },
};
</script>

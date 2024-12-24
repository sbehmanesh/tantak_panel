<template>
  <div>
    <v-window v-model="step">
      <v-window-item :value="1" eager>
        <BaseTable
          url="/basket/sale-agency/seller/list"
          :headers="headers"
          :BTNactions="btn_actions"
          :extraBtn="extra_btn"
          ref="RefreshTabel"
          createUrl="in-person-shopping/insert"
        />
        <DetailsBasket
          v-if="show_details"
          :transactions="transactions"
          :dialog="show_details"
          :data="basket_items"
          @closeDialog="show_details = false"
          @reload="refreshAllTabels"
        />
        <PaymentCompletion
          v-if="completion"
          :dialog="completion"
          :basket-id="basket_id"
          @closeDialog="completion = false"
          @relaod="refresh"
        />
      </v-window-item>

      <v-window-item :value="2" eager>
        <BaseTable
          url="/return-product"
          :headers="headers_return"
          :BTNactions="btn_actions"
          :extraBtn="extra_btn2"
          ref="ReternedTabel"
        />
      </v-window-item>
    </v-window>
  </div>
</template>
<script>
import DetailsBasket from "@/components/Product/PersonShopping/DetailsBasket.vue";
import PaymentCompletion from "@/components/Product/PersonShopping/PaymentCompletion.vue";
export default {
  components: { DetailsBasket, PaymentCompletion },
  data: () => ({
    headers: [],
    btn_actions: [],
    basket_items: [],
    headers_return: [],
    extra_btn: [],
    extra_btn2: [],
    title: "خرید حضوری",
    show_details: false,
    completion: false,
    show_transactions: false,
    basket_id: "",
    step: 1,
    transactions: {},
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      {
        text: "جزییات سبد",
        icon: "shopping_basket",
        color: "blue-grey",
        fun: (body) => {
          this.basket_items = body.only_items;
          this.transactions["wallet_transactions"] = body.wallet_transactions;
          this.transactions["payments"] = body.payments;
          this.show_details = true;
        },
        show_fun: (body) => {
          if (Boolean(body.only_items) && body.only_items.length > 0) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تکیمل  پرداخت",
        icon: "receipt",
        color: "teal darken-2",
        fun: (body) => {
          this.basket_id = body.id;

          this.completion = true;
        },
        show_fun: (body) => {
          if (body.status == "open") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.extra_btn = [
      {
        text: "سفارشات مرجوعی",
        icon: "event_busy",
        color: "blue-grey",
        fun: (body) => {
          this.step++;
        },
      },
    ];
    this.extra_btn2 = [
      {
        text: "برگشت",
        icon: "redo",
        color: "red",
        fun: (body) => {
          this.step--;
        },
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
        text: "کاربر",
        filterCol: "body.user.username",
        value: (body) => {
          let name = Boolean(body.user.first_name)
            ? body.user.first_name + " " + body.user.last_name
            : "";
          return `
      <h1 class="my-2">
        ${body.user.username}
        <br>
          <small class="grey--text">
            ${name}
            </small>
        </h1>
      `;
        },
      },
      {
        text: "شماره فاکتور",
        value: "factor_number",
      },
      { text: "قیمت با تخفیف  (ریال)", value: "price", type: "price" },
      { text: " (ریال) قیمت پایه", value: "base_price", type: "price" },

      {
        text: "ثبت کننده",
        filterCol: "body.seller_sale_agnecy.username",
        value: (body) => {
          let name = Boolean(body.seller_sale_agnecy.first_name)
            ? body.seller_sale_agnecy.first_name +
              " " +
              body.seller_sale_agnecy.last_name
            : "";
          return `
      <h1 class="my-2 blue-grey--text">
        ${body.seller_sale_agnecy.username}
        <br>
          <small class="grey--text">
            ${name}
            </small>
        </h1>
      `;
        },
      },
      {
        text: "پیام",
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
      {
        text: "وشعیت ",
        filterType: "select",
        filterCol: "status",
        value: "status",
        items: this.$store.state.static.status_basket_refral,
      },
    ];
    this.headers_return = [
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
        text: "کاربر",
        filterCol: "body.user.username",
        value: (body) => {
          let name = Boolean(body.user.first_name)
            ? body.user.first_name + " " + body.user.last_name
            : "";
          return `
      <h1 class="my-2">
          ${name}
    
        </h1>
      `;
        },
      },
      {
        text: "شماره فاکتور سفارش",
        value: (body) => {
          if (Boolean(body.basket.factor_number)) {
            return body.basket.factor_number;
          }
        },
        filterCol: "basket.factor_number",
      },
      {
        text: "وضعیت",
        filterType: "select",
        filterCol: "status",
        value: "status",
        items: this.$store.state.static.inventory_status,
      },
      {
        text: "نوع ",
        filterType: "select",
        filterCol: "type",
        value: "type",
        items: this.$store.state.static.reterned_type,
      },

      { text: "مقدار تخفیف", value: "amount_discount", type: "price" },
      { text: "تعداد مرجوعی", value: "number" },
      {
        text: "مقدار قابل پرداخت (ریال)",
        value: "price_payable",
        type: "price",
      },
      {
        filtrabel: false,

        value: (body) => {
          return `
      <h1 class="my-2">
        <small >
          مقدار کم شده از کیف پول نقدی :‌  ریال${this.$price(
            body.price_deposit_cash
          )}
          </small>
          <br/>
          <small class="grey--text">
          مقدار کم شده از کیف پول اعتباری :‌ ریال  ${this.$price(
            body.price_deposit_credit
          )}
          </small>
    
        </h1>
      `;
        },
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
    ];
  },
  methods: {
    refresh() {
      this.$refs.RefreshTabel.getDataFromApi();
    },
    refreshAllTabels() {
      this.refresh();
      this.$refs.ReternedTabel.getDataFromApi();
    },
  },
};
</script>

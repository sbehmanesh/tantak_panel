<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="1200" hide-overlay>
      <v-card>
        <v-card-title class="elevation-0 primary">
          <span class="white--text font_17"> تراکنش های سبد خرید </span>
          <v-spacer></v-spacer>
          <v-btn icon text @click="cloasDialog">
            <v-icon color="white"> close </v-icon>
          </v-btn>
        </v-card-title>
        <ChangeStatusPayment
          :dialog="show_pay_dialog"
          v-if="show_pay_dialog"
          :paymentId="payment_id"
          @cloasDialog="show_pay_dialog = false"
          @relod="relod"
        />
        <div class="text-center mt-3">
          <v-chip
            dark
            label
            class="ma-2"
            color="teal darken-2"
            v-for="(item, key) in items"
            :key="key"
            @click="selectItem(item)"
            :outlined="tab != item.value"
          >
            {{ item.text }}
          </v-chip>
        </div>
        <v-card-text>
          <BaseTable
            url="shop/payment"
            :BTNactions="btn_actions"
            :headers="headers"
            :filters="filters"
            v-if="tab == 'payment'"
            ref="reloadTransactions"
          />

          <BaseTable
            v-if="tab == 'wallet'"
            url="shop/wallet"
            :headers="headers_wallet"
            :filters="filters"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import ChangeStatusPayment from "@/components/NewCallCenter/ChangeStatusPayment.vue";
export default {
  components: {
    ChangeStatusPayment,
  },
  props: {
    sectionId: {
      default: "",
      type: String,
    },
    dialog: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      headers: [],
      show_pay_dialog: false,
      headers_wallet: [],
      btn_actions: [],
      filters: {},
      step: 1,
      tab: "payment",
      payment_id: "",
      items: [
        { text: " لیست  پرداختی های کاربر", value: "payment" },
        { text: " تراکنش های انجام شده", value: "wallet" },
      ],
    };
  },
  mounted() {
    this.filters = {
      section_id: {
        op: "=",
        value: this.sectionId,
      },
      section_name: {
        op: "=",
        value: "Basket",
      },
    };
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

      { text: "عنوان", value: "text" },
      { text: "مبلغ به تومان", value: "price", type: "price" },
      { text: "وضعیت", value: "description" },
    ];
    this.headers_wallet = [
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

      { text: "عنوان", value: "pay_text" },
      { text: "مبلغ به تومان", value: "amount", type: "price" },
      { text: "وضعیت", value: "description" },
      {
        text: "نوع ",
        filterType: "select",
        filterCol: "type",
        value: "type",
        items: this.$store.state.static.wallet_type,
      },
    ];
    this.btn_actions = [
      {
        color: "success",
        icon: "change_circle",
        text: "تغییر وضعیت",
        fun: (body) => {
          if (body.id) {
            this.show_pay_dialog = true;
            this.payment_id = body.id;
          }
        },
        show_fun: (body) => {
          if (body.status == "wait" && body.kind_set == "cardToCard") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        color: "primary",
        icon: "image",
        text: "فایل",
        fun: (body) => {
          if (body.receipt_img) {
            window.open(`${this.$store.state.file_url}/${body.receipt_img}`);
          }
        },
        show_fun: (body) => {
          if (Boolean(body.receipt_img)) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  watch: {
    tab() {
      this.filters = {
        section_id: {
          op: "=",
          value: this.sectionId,
        },
        section_name: {
          op: "=",
          value: "Basket",
        },
      };
    },
  },
  methods: {
    cloasDialog() {
      this.$emit("cloasDialog");
    },
    selectItem(item) {
      this.tab = item.value;
    },
    relod() {
      this.$refs.reloadTransactions.getDataFromApi();
    },
  },
};
</script>

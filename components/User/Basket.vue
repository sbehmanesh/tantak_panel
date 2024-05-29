<template>
  <div>
    <v-window v-model="step_basket">
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
        <v-col cols="12">
          <BaseTable
            url="basket-item"
            :rootBody="{ basket_id: product_id }"
            :headers="baskets"
            :extraBtn="extraBtn"
          />
        </v-col>
   
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { icon } from 'leaflet';

export default {
  props: {
    modelId: { default: null },
  },
  components: {},
  data: () => ({
    headers: [],
    item_basket: [],
    extraBtn: [],
    root_body: "",
    product_id: "",
    step_basket: 1,
  }),
  beforeMount() {
    this.root_body = { user_id: this.modelId };
    this.item_basket = [
      {
        text: "موجودی سبد خرید",
        icon: "shopping_basket",
        color: "info darken-2",
        fun: (body) => {
          this.step_basket++;
          this.product_id = body.id;
        },
      },
    ];
    this.extraBtn = [
      {
        text: "برگشت",
icon:"arrow_circle_right",
        color: "red darken-2",
        fun: (body) => {
          this.step_basket--;
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
        text: "وضعیت خرید",
        value: "status",
        filterType: "select",
        // ','','','','',''
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
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.dialog_oprator_list.show = false;
      this.dialog_oprator_list.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

<template>
  <div>
    <BaseTable
      url="/debt"
      :headers="headers"
      autoDelete="/debt/delete"
      :BTNactions="btn_actions"
    >
    </BaseTable>
    <DebtDialog
      :data="data"
      :dialog="show_debt"
      v-if="show_debt"
      @cloasDialog="show_debt = false"
    />
  </div>
</template>

<script>
import DebtDialog from "@/components/NewCallCenter/DebtDialog.vue";
export default {
  components: {
    DebtDialog,
  },
  data: () => ({
    headers: [],
    data: [],
    btn_actions: [],
    title: "لیست بدهکاری ها ",
    show_debt: false,
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
        text: "موجودی",
        color: "red",
        fun: (body) => {
          let data = JSON.parse(body.data);
          this.data = data;
          this.show_debt = true;
        },
      },
    ];
  },
};
</script>

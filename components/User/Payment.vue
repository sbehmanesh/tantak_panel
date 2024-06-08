<template>
  <div>
    <v-col cols="12">
      <BaseTable
        url="/payment"
        :filters="{ user_id:modelId }"
        :headers="headers"
      />
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
  },
  components: {  },
  data: () => ({
    headers: [],
    extraBtn: [],

  }),
  beforeMount() {
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
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: [
          { text: "منتظر پرداخت", value: "wait" },
          { text: "پرداخت شده", value: "payed" },
          { text: " پرداخت نشده", value: "unpayed" },
          { text: "برگشت ", value: "reject" },
          { text: "کنسل شده", value: "cancled" },
        ],
      },
      {
        text: "نوع پرداخت",
        value: "kind_set",
        filterType: "select",

        items: [
          { text: " بانکی", value: "bank" },
          { text: " دستی", value: "manual" },
          { text: "  کارت به کارت ", value: "cardToCard" },
          { text: "نقدی ", value: "naghd" },
          { text: " چک", value: "check" },
          { text: "ارسال لینک پرداخت", value: "send_pay_link" },
          { text: "   کارت خوان", value: "pos" },
          { text: " پرداخت درب منزل", value: "post" },
        ],
      },

      { text: "مقدار پرداختی (ریال)", type: "price", value: "price" },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.text) {
            return body.text;
          }
        },
        value: (body) => {
          if (typeof body.text == "string") {
            if (body.text.length < 25) {
              return body.text;
            }
            return body.text.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ پرداخت",
        value: (body) => {
          if (body.paid_date) {
            return this.$toJalali(body.paid_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "پرداخت نشده";
        },
      },
    ];

  },
  mounted() {

  },
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

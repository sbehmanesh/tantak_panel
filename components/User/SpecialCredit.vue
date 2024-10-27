<template>
    <div>
  
      <BaseTable
        url="/wallet"
        :headers="headers"
        :filters="{ user_id: modelId }"
        autoDelete="/special-amount/delete"
        autoUpdate="/user/special-credit/update"
        :createUrl="'/user/special-credit/insert?id=' + modelId"
      >
      </BaseTable>
    </div>
  </template>
  
  <script>
  export default {
    components: {},
    props: {
      modelId: { default: null },
    },
    data: () => ({
      headers: [],
      btn_actions: [],
      user_id: "",
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
        { text: "مقدار", value: "amount", filterCol: "amount", type: "price" },
        {
          text: "نوع",
          filterType: "select",
          filterCol: "kind",
          value: "kind",
          items: this.$store.state.static.wallet_kind,
        },
        {
          text: "وضعیت",
          filterType: "select",
          filterCol: "type",
          value: "type",
          items: this.$store.state.static.wallet_type,
        },
        {
          text: "بابت",
  
          value: "pay_text",
    
        },
        {
            filterable: false,
            disableSort: true,
            filterType: "date",
            filterCol: "birth_date",
            text: "تاریخ پرداخت ",
            value: (body) => {
              if (body.paid_date) {
                return this.$toJalali(
                  body.paid_date,
                  "YYYY-MM-DD",
                  "jYYYY/jMM/jDD"
                );
              }
              return "";
            },
          },
        { text: "توضیحات", value: "description", filterCol: "description" },
      ];
    },
  };
  </script>
  
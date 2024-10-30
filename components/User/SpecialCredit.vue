<template>
    <div>
  
      <BaseTable
        url="/special-amount"
        :headers="headers"
        :filters="{ user_id: modelId }"
        autoDelete="/special-amount/delete"
        autoUpdate="/user/special-credit"
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
        { text: "مقدار", value: "price", filterCol: "price", type: "price" },
        { text: "بابت", value: "reason", filterCol: "reason" },


        {
            filterable: false,
            disableSort: true,
            filterType: "date",
            filterCol: "birth_date",
            text: "تاریخ شروع ",
            value: (body) => {
              if (body.start_at) {
                return this.$toJalali(
                  body.start_at,
                  "YYYY-MM-DD",
                  "jYYYY/jMM/jDD"
                );
              }
              return "";
            },
          },     {
            filterable: false,
            disableSort: true,
            filterType: "date",
            filterCol: "birth_date",
            text: "مهلت استفاده",
            value: (body) => {
              if (body.end_at) {
                return this.$toJalali(
                  body.end_at,
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
  
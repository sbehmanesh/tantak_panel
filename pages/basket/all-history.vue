<template>
  <div>
    <BaseTable
      url="/basket/my-referral-history"
      :filters="filters"
      :headers="headers"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "day_delete_basket" },
    title: "تاریخچه سبد های خرید",
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
        text: "پیام",
        value: "message",
      },
      {
        text: "شماره فاکتور",
        value: (body) => {
          if (body.basket) {
            return body.basket.factor_number;
          }
        },
      },
      {
        text: "نوع ارجاع",
        value: "text",
      },
      {
        text: "ارجاع دهنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.sender) {
            return `<span class='success--text mx-2'>${body.sender.first_name} ${body.sender.last_name} | ${body.sender.username}</span>`;
          }
        },
      },
      {
        text: "گیرنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.geter) {
            return `<span class='info--text mx-2'>${body.geter.first_name} ${body.geter.last_name} | ${body.geter.username}</span>`;
          } else {
            return "ندارد";
          }
        },
      },
      {
        text: "پیام",
        filterCol: "message",
        type: "tooltip",
        function: (body) => {
          if (body.message) {
            return body.message;
          }
        },
        value: (body) => {
          if (typeof body.message == "string") {
            if (body.message.length < 25) {
              return body.message;
            }
            return body.message.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
  },
};
</script>

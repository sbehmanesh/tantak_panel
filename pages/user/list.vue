<template>
  <div>
    <BaseTable
      url="/user"
      :headers="headers"
      autoDelete="/user/delete"
      autoUpdate="/user"
      createUrl="/user/insert"
      :extraBtn="extraBtn"
      ref="walletExcel"
    />
    <Excel
      v-if="dialog.show"
      :dialog="dialog"
      @closeDialog="closeDialog"
      @relod="relod"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
import Excel from "@/components/User/Excel.vue";
export default {
  components: { BaseTable, Excel },
  data: () => ({
    headers: [],
    extraBtn: [],
    dialog: { items: null, show: false },
    title: "همه کاربران",
  }),
  beforeMount() {
    this.extraBtn = [
      {
        icon: "add_card",
        color: "info",
        text: "شارژ کیف پول",
        fun: () => {
          this.dialog.items = null;
          this.dialog.show = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    this.$store.dispatch("setting/getRoleServer");
    this.headers = [
      {
        text: "تصویر",
        value: "avatar",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
      {
        text: "وضعبت فعالیت",
        value: "status_work",
        filterType: "select",
        items: this.$store.state.static.status_work,
      },
      { text: "کد ملی", filterCol: "national_code", value: "national_code" },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ تولد",
        value: (body) => {
          if (body.birth_date) {
            return this.$toJalali(body.birth_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
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
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },  

      {
        text: "کیف پول",
        filterCol: "wallet",
        value: (body) => {
          let items = [];
          items.push(
            `<span class="green--text font_10">کیف پول نقدی : ${body.cash_wallt.toLocaleString()} ریال</span>`
          );
          items.push(
            `<span class="primary--text font_10">کیف پول اعتباری  : ${body.credit_wallt.toLocaleString()} ریال</span>`
          );
          items.push(
            `<span class="blue--text font_10">کیف پول امتیازی : ${body.score_wallt.toLocaleString()} امتیاز</span>`
          );
          return items.join("<br>");
        },
      },
    ];
  },
  methods: {
    relod() {
      this.$refs.walletExcel.getDataFromApi();
    },

    closeDialog() {
      this.dialog.show = false;
      this.dialog.items = null;
    },
  },
};
</script>

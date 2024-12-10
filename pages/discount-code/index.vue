<template>
  <div>
    <BaseTable
      url="/coupon"
      :headers="headers"
      :filters="filters"
      :BTNactions="btn_actions"
      createUrl="/discount-code/insert"
      :autoLoad="false"
      autoUpdate="/coupon"
      autoDelete="/discount-code/delete"
    />
  </div>

  <!-- <v-col cols="12" md="12">

    </v-col> -->
</template>

<script>
export default {
  data: () => ({
    headers: [],
    headers_custom: [],
    title: "کدهای تخفیف",
    btn_actions: [],
    discount_for: [],
    dialog_log: { show: false, items: null },
    dialog_used: { show: false, items: null },
    filters: {},
    code_id: "",
    items: [
      { text: "غیر شخصی ", icon: "group" },
      { text: "شخصی", icon: "person" },
    ],
    tab: null,
  }),
  beforeMount() {
    this.btn_actions = [
      {
        color: "#253155",
        icon: "content_copy",
        text: "کپی",
        fun: (body) => {
          this.copyCode(body.code);
        },
      },
      {
        color: "primary",
        icon: "history",
        text: "تاریخچه",
        fun: (body) => {
          this.dialog_log.items = null;
          this.dialog_log.show = true;
          this.code_id = body.id;
        },
      },
      {
        color: "#4f6b95f0",
        icon: "list",
        text: " قرارداد ها",
        fun: (body) => {
          this.dialog_used.items = null;
          this.dialog_used.show = true;
          this.discount_for = body;
        },
        show_fun: (body) => {
          if (body.contracts.length > 0 && body.send_in == "countract") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        color: "#4f6b95f0",
        icon: "group",
        text: " کاربران",
        fun: (body) => {
          this.dialog_used.items = null;
          this.dialog_used.show = true;
          this.discount_for = body;
        },
        show_fun: (body) => {
          if (body.users.length > 0 && body.send_in == "user") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.headers = [
      {
        text: "فعال شده در",
        filterCol: "active_at",
        filterType: "date",
        value: (body) => {
          if (body.active_at) {
            return this.$toJalali(
              body.active_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          } else {
            return "فعال نشده";
          }
        },
      },
      {
        text: "استفاده شده برای",
        filterType: "select",
        value: "send_in",
        items: this.$store.state.static.discount_for,
      },

      {
        text: "نوع بیمه",
        value: (body) => {
          if (body.insurance) {
            return body.insurance.fa_name;
          } else {
            return "---";
          }
        },
      },
      {
        text: "شرکت بیمه",
        value: (body) => {
          if (body.company) {
            return body.company.fa_name;
          } else {
            return "---";
          }
        },
      },
      // {
      //   text: "بابت",
      //   filterType: "select",
      //   value: "for_title",
      //   filterCol: "for_title",
      //   items: this.$store.state.setting.basic_information.for_wallet,
      // },
      {
        text: "حد اکثر استفاده برای کاربر",
        value: "limit_use_user",
      },
      {
        text: "حداکثر",
        value: "limit",
      },
      {
        type: "price",
        text: " درصد / مقدار",
        value: (body) => {
          if (body.percent) {
            return body.percent;
          } else {
            return body.amount;
          }
        },
      },
      {
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.public) {
            return true;
          } else {
            return false;
          }
        },
        text: "عمومی",
      },

      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_activity,
      },
      {
        text: "تاریخ شروع",
        filterCol: "start_at",
        filterType: "date",
        value: (body) => {
          if (body.start_at) {
            return this.$toJalali(
              body.start_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
      {
        text: "تاریخ پایان",
        filterCol: "end_at",
        filterType: "date",
        value: (body) => {
          if (body.end_at) {
            return this.$toJalali(
              body.end_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
      {
        text: "کد تخفیف",
        value: "code",
      },
    ];
    this.headers_custom = [
      {
        text: "فعال شده در",
        filterCol: "active_at",
        filterType: "date",
        value: (body) => {
          if (body.send_in == "custom") {
            if (body.active_at) {
              return this.$toJalali(
                body.active_at,
                "YYYY-MM-DDTHH:mm:ss",
                "jYYYY/jMM/jDD"
              );
            } else {
              return "فعال نشده";
            }
          }
          return "";
        },
      },
      {
        text: "نام کاربر",
        value: (body) => {
          if (body.user) {
            return body.user.first_name;
          }
        },
      },
      {
        text: "خانوادگی کاربر",
        value: (body) => {
          if (body.user) {
            return body.user.last_name;
          }
        },
      },
      {
        text: "شماره همراه",
        value: (body) => {
          if (body.user) {
            return body.user.username;
          }
        },
      },
      // {
      //   text: "استفاده شده برای",
      //   filterType: "select",
      //   value: "send_in",
      //   items: this.$store.state.static.discount_for,
      // },


      // {
      //   text: "بابت",
      //   filterType: "select",
      //   value: "for_title",
      //   filterCol: "for_title",
      //   items: this.$store.state.setting.basic_information.for_wallet,
      // },

      {
        type: "price",
        text: " درصد / مقدار",
        value: (body) => {
          if (body.percent) {
            return body.percent;
          } else {
            return body.amount;
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
        text: "تاریخ شروع",
        filterCol: "start_at",
        filterType: "date",
        value: (body) => {
          if (body.start_at) {
            return this.$toJalali(
              body.start_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
      {
        text: "تاریخ پایان",
        filterCol: "end_at",
        filterType: "date",
        value: (body) => {
          if (body.end_at) {
            return this.$toJalali(
              body.end_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
      {
        text: "کد تخفیف",
        value: "code",
      },
    ];

    this.$store.dispatch("setPageTitle", this.title);
  },
  watch: {
    tab() {
      if (this.tab != 1) {
        this.filters = {
          send_in: {
            op: "!=",
            value: "custom",
          },
        };
      } else {
        this.filters = {
          send_in: {
            op: "=",
            value: "custom",
          },
        };
      }
    },
  },
  methods: {
    closeDialogLog() {
      this.dialog_log.items = null;
      this.dialog_log.show = false;
    },
    closeDialogUsed() {
      this.dialog_used.items = null;
      this.dialog_used.show = false;
    },
    copyCode(discount_code) {
      let code = discount_code;
      if (discount_code) {
        navigator.clipboard.writeText(code);
        this.$toast.success(" کپی شد");
      }
    },
  },
};
</script>

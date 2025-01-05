<template>
  <div>
    <BaseTable
      url="/coupon"
      ref="baseTabel"
      :headers="headers"
      :filters="filters"
        :extraBtn="extra_btn"
      :BTNactions="btn_actions"
      createUrl="/discount-code/insert"
      :autoLoad="false"
      autoUpdate="/discount-code"
      autoDelete="/coupon/delete"
    />
    <History
      v-if="show_history"
      :dialog="show_history"
      :couponId="coupon_id"
      @closeDialog="show_history = false"
    />   
     <Excel
      v-if="add_excel"
      :dialog="add_excel"
      @refresh="refresh"
      @closeDialog="add_excel = false"
    />
  </div>

  <!-- <v-col cols="12" md="12">

    </v-col> -->
</template>
<script>
import History from "@/components/Product/Discount/History.vue";
import Excel from "@/components/Product/Discount/Excel.vue";
export default {
  components: {
    History,
    Excel,
  },
  data: () => ({
    headers: [],
    headers_custom: [],
    title: "کدهای تخفیف",
    btn_actions: [],
    extra_btn: [],
    discount_for: [],
    dialog_log: { show: false, items: null },
    show_history: false,
    add_excel: false,
    filters: {},
    coupon_id: "",
    items: [
      { text: "غیر شخصی ", icon: "group" },
      { text: "شخصی", icon: "person" },
    ],
    tab: null,
  }),
  beforeMount() {
    this.btn_actions = [
      {
        color: "red",
        icon: "content_copy",
        text: "کپی",
        fun: (body) => {
          this.copyCode(body.coupon);
        },
      },
      {
        color: "blue-grey",
        icon: "history",
        text: "تاریخچه استفاده",
        fun: (body) => {
          this.coupon_id = body.id;
          this.show_history = true;
        },
        show_fun: (body) => {
          if (
            Boolean(this.$store.state.auth.action.indexOf("coupons/index") > -1)
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
       this.extra_btn = [

      {
        color: "teal",
        icon: "post_add",
        text: "افزودن بااکسل",
        fun: (body) => {
          this.add_excel = true;
        },
        // show_fun: (body) => {
        //   if (
        //     Boolean(this.$store.state.auth.action.indexOf("coupons/index") > -1)
        //   ) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // },
      },
    ];
    this.headers = [
      {
        text: "تاریخ ایجاد",
        filterCol: "created_at",
        filterType: "date",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(
              body.created_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          } else {
            return "فعال نشده";
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
        text: "حد اکثر استفاده برای کاربر",
        value: "user_usage_limit",
        type: "price",
      },
      {
        text: "حداکثر",
        value: "coupon_usage_limit",
        type: "price",
      },
      {
        type: "price",
        text: " درصد / مقدار (ریال)",
        type: "price",
        value: "value",
        // value: (body) => {
        //   if (body.percent) {
        //     return body.percent;
        //   } else {
        //     return body.amount;
        //   }
        // },
      },
      {
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.is_public) {
            return true;
          } else {
            return false;
          }
        },
        text: "عمومی",
      },
      {
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.all_products) {
            return true;
          } else {
            return false;
          }
        },
        text: "قابل استفاده برای همه محصولات",
      },

      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_cupon,
      },
      {
        text: "تاریخ شروع",
        filterCol: "start_date",
        filterType: "date",
        value: (body) => {
          if (body.start_date) {
            return this.$toJalali(
              body.start_date,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
      {
        text: "تاریخ پایان",
        filterCol: "end_date",
        filterType: "date",
        value: (body) => {
          if (body.end_date) {
            return this.$toJalali(
              body.end_date,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
    ];
    
    // this.headers_custom = [
    //   {
    //     text: "فعال شده در",
    //     filterCol: "active_at",
    //     filterType: "date",
    //     value: (body) => {
    //       if (body.send_in == "custom") {
    //         if (body.active_at) {
    //           return this.$toJalali(
    //             body.active_at,
    //             "YYYY-MM-DDTHH:mm:ss",
    //             "jYYYY/jMM/jDD"
    //           );
    //         } else {
    //           return "فعال نشده";
    //         }
    //       }
    //       return "";
    //     },
    //   },
    //   {
    //     text: "نام کاربر",
    //     value: (body) => {
    //       if (body.user) {
    //         return body.user.first_name;
    //       }
    //     },
    //   },
    //   {
    //     text: "خانوادگی کاربر",
    //     value: (body) => {
    //       if (body.user) {
    //         return body.user.last_name;
    //       }
    //     },
    //   },
    //   {
    //     text: "شماره همراه",
    //     value: (body) => {
    //       if (body.user) {
    //         return body.user.username;
    //       }
    //     },
    //   },
    //   // {
    //   //   text: "استفاده شده برای",
    //   //   filterType: "select",
    //   //   value: "send_in",
    //   //   items: this.$store.state.static.discount_for,
    //   // },

    //   // {
    //   //   text: "بابت",
    //   //   filterType: "select",
    //   //   value: "for_title",
    //   //   filterCol: "for_title",
    //   //   items: this.$store.state.setting.basic_information.for_wallet,
    //   // },

    //   {
    //     type: "price",
    //     text: " درصد / مقدار",
    //     value: (body) => {
    //       if (body.percent) {
    //         return body.percent;
    //       } else {
    //         return body.amount;
    //       }
    //     },
    //   },

    //   {
    //     text: "وضعیت",
    //     value: "status",
    //     filterType: "select",
    //     items: this.$store.state.static.status,
    //   },
    //   {
    //     text: "تاریخ شروع",
    //     filterCol: "start_at",
    //     filterType: "date",
    //     value: (body) => {
    //       if (body.start_at) {
    //         return this.$toJalali(
    //           body.start_at,
    //           "YYYY-MM-DDTHH:mm:ss",
    //           "jYYYY/jMM/jDD"
    //         );
    //       }
    //       return "";
    //     },
    //   },
    //   {
    //     text: "تاریخ پایان",
    //     filterCol: "end_at",
    //     filterType: "date",
    //     value: (body) => {
    //       if (body.end_at) {
    //         return this.$toJalali(
    //           body.end_at,
    //           "YYYY-MM-DDTHH:mm:ss",
    //           "jYYYY/jMM/jDD"
    //         );
    //       }
    //       return "";
    //     },
    //   },
    //   {
    //     text: "کد تخفیف",
    //     value: "code",
    //   },
    // ];

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
      let coupon = discount_code;
      if (discount_code) {
        navigator.clipboard.writeText(coupon);
        this.$toast.success(" کپی شد");
      }
   
    },
    refresh(){
        this.$refs.baseTabel.getDataFromApi()
      }
  },
};
</script>

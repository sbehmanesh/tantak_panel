<template>
  <div>
    <BaseTable url="/basket" :BTNactions="btn_actions" :headers="headers" />
    <DetailsBaskets
      v-if="show_details"
      :dialog="show_details"
      :data="data"
      @closeDialog="show_details = false"
    />
  </div>
</template>

<script>
import DetailsBaskets from "@/components/Product/DetailsBaskets.vue";

export default {
  components: {
    DetailsBaskets,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "سبد های خرید",
    show_details: false,
    data: {},
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
        disableSort: "true",
        filterable: false,
        text: "نام",
        value: (body) => {
          if (body.user) {
            return body.user.first_name;
          } else {
            return "--";
          }
        },
      },
      {
        disableSort: "true",
        filterCol: "user.last_name",

        text: "نام خانوادگی",
        value: (body) => {
          if (body.user) {
            return body.user.last_name;
          } else {
            return "--";
          }
        },
      },
      //       {
      //         text: "شماره تماس",
      //         type: "phone",
      //         value: (body) => {
      //           if (body.user) {
      //             return body.user.username;
      //           }
      //         },
      //         show_fun: (body) => {
      //           if (
      //             this.$store.state.auth.action.indexOf(
      //               "messages/issabel_request_call"
      //             ) > -1
      //           ) {
      //             return true;
      //           } else {
      //             return false;
      //           }
      //         },
      //       },
      {
        text: "شماره فاکتور",
        value: "factor_number",
      },

      //       {
      //         text: "تخفبف هماهنگ کننده",
      //         filterCol: "discount_coordinat",
      //         value: (body) => {
      //           if (body.discount_coordinat) {
      //             return `${this.$price(body.discount_coordinat)} ریال`;
      //           } else {
      //             return "__";
      //           }
      //         },
      //       },
      //       {
      //         filterable: false,
      //         disableSort: true,

      //         value: (body) => {

      //           return `
      //           <h1 class="my-2">
      //                     <small class=""> مبلغ قابل پرداخت (ریال) :‌ ${this.$price(
      //                       body.price
      //                     )} ریال</small>
      //                     <br/>
      //                     <small class="grey--text"> وزن (گرم) :${this.$price(
      //                       body.total_weight
      //                     )} </small>
      //                     <br/>
      //                     <small class="">   جمه کل سبد  :‌ ${this.$price(
      //                       body.base_price
      //                     )}  ریال</small>

      //             </h1>
      //             `;
      //         },
      //       },

      {
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.$store.state.static.step_basket_refral,
      },
//       {
//         text: " زمان تخصیص",
//         filterType: "date",
//         filterCol: "allocation_at",
//         value: (body) => {
//           if (body.allocation_at) {
//             return this.$toJalali(body.allocation_at);
//           }
//           return "";
//         },
//       },
      {
        text: "وضعیت سبد",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_basket_refral,
      },
      //       {
      //         text: "وزن",
      //         value: "total_weight",
      //       },
      //       {
      //         text: "وضعیت  انبار",
      //         filterType: "select",
      //         value: "status_stock",
      //         items: this.$store.state.static.status_stock,
      //       },
    ];
    this.btn_actions = [
      {
        text: "نمایش جزییات",
        icon: "",
        color: "red",
        fun: (body) => {
          this.show_details = true;
          this.data = body;
        },
      },
    ];
  },
};
</script>

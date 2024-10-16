<template>
  <div>
    <BaseTable
      url="/special-discount"
      :headers="headers"
      autoUpdate="/product/special-discount"
      createUrl="/product/special-discount/insert"
      autoDelete="special-discount/delete"
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
    title: "تخفیفات ویژه",
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
      { text: "عنوان ", value: "title" },
      { text: "نام محصول", value: "product_name" },
      { text: "قیمت پایه (ریال)", value: "base_price", type: "price" },
      { text: "قیمت پس از تخفیف (ریال)", value: "price_off", type: "price" },
      {
        text: "زمان شروع",
        filterType: "date",
        filterCol: "start_at",
        value: (body) => {
          if (body.start_at) {
            return this.$toJalali(body.start_at, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
        },
      },
      {
        text: "زمان پایان",
        filterType: "date",
        filterCol: "end_at",
        value: (body) => {
          if (body.end_at) {
            return this.$toJalali(body.end_at, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
        },
      },
      {
        text: "تخفیف برای همه",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.off_sale_all) {
            return true;
          } else {
            return false;
          }
        },
      },

      {
        text: "نمایندگی های مجاز به استفاده ",
        value: (body) => {
          if (
            body.off_sale_all == false &&
            body.sale_agencies &&
            body.sale_agencies.length > 0
          ) {
            return body.sale_agencies
              .map((x) => `${x.name} (${x.code})`)
              .join("<br/>");
          }else{
            return "--"
          }
        },
      },
      {
        text: "تخفیف در فروش تلفنی",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.off_sale_call_center) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تخفیف در فروش آنلاین",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.off_sale_online) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
};
</script>

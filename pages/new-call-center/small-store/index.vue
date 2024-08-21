<template>
  <div>
    <BaseTable
      url="/small-stock"
      :filters="filters"
      :headers="headers"
      :BTNactions="btn_actions"
    >
    </BaseTable>
    <SmallStoke
      :stokeId="stoke_id"
      :dialogFile="dialog_file"
      v-if="dialog_file"
      @cloaseDialog="dialog_file = false"
    ></SmallStoke>
  </div>
</template>
<script>
import BaseTable from "~/components/DataTable/BaseTable";
import SmallStoke from "~/components/Stock/SmallStoke.vue";
export default {
  components: { BaseTable, SmallStoke },
  data: () => ({
    headers: [],
    filters: {},
    title: "موجودی انبارک",
    btn_actions: [],
    stoke_id: "",
    dialog_file: false,
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
        text: "نام محصول",
        value: (body) => {
          if (body.product_var) {
            return body.product_var.product.name;
          }
        },
      },
      // {
      //   text: "عکس محصول",
      //   type: "image",
      //   value: (body) => {
      //     if (body.product_var) {
      //       console.log("body.product_var.product.main_image" , body.product_var.product.main_image);

      //       return body.product_var.product.main_image;
      //     }
      //   },
      // },
      {
        text: "ویژگی های محصول",
        value: (body) => {
          if (body.product_var) {
            let color_product = body.product_var.product_variation_1
              ? body.product_var.product_variation_1.value
              : "";
            let size_product = body.product_var.product_variation_2
              ? body.product_var.product_variation_2.value
              : "";
            let quality_product = body.product_var.product_variation_3
              ? body.product_var.product_variation_3.value
              : "";
            return color_product + "/" + size_product + "/" + quality_product;
          }
        },
      },
      {
        text: "بارکد",
        value: (body) => {
          if (body.product_var) {
            return body.product_var.full_barcode;
          }
        },
      },
      {
        text: "تعداد",
        value: (body) => {
          if (body.number) {
            return body.number;
          } else {
            return "عدم موجودی";
          }
        },
      },
    ];

    this.btn_actions = [
      {
        text: "تاریخچه",
        icon: "list",
        color: "info darken-2",
        fun: (body) => {
          this.dialog_file = true;
          this.stoke_id = body.id;
        },
      },
    ];
    this.$reqApi("/small-stock");
  },
};
</script>
<style></style>

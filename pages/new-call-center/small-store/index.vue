<template>
  <div>
    <BaseTable
      url="/small-stock"
      :filters="filters"
      :headers="headers"
      :BTNactions="btn_actions"
    />
    <SmallStoke
      :stokeId="stoke_id"
      :dialogFile="dialog_file"
      v-if="dialog_file"
      @cloaseDialog="dialog_file = false"
    />
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
  mounted() {
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

      {
        text: "ویژگی های محصول",
        value: (body) => {
          if (body.product_var) {
            let product_var1 = body.product_var.product_variation_1
              ? body.product_var.product_variation_1.value
              : "";
            let product_var2 = body.product_var.product_variation_2
              ? body.product_var.product_variation_2.value
              : "";
            let product_var3 = body.product_var.product_variation_3
              ? body.product_var.product_variation_3.value
              : "";
            let product_vars =
              product_var1 + "/" + product_var2 + "/" + product_var3;
            return product_vars;
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
  },
};
</script>
<style></style>

<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/color-products"
      createUrl="/setting/color-products/insert"
           autoDelete="/setting/delete"
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
    filters: { key: "product_colors" },
    title: "رنگ های محصولات",
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
        text: "نام رنگ",
        value: "value",
      },
      {
        filterable: false,
        disableSort: true,
        value: (body) => {
          if (body.value_2) {
            return `<i aria-hidden="true"  color="red" class="v-icon notranslate  material-icons" style="font-size: 18px; color: ${body.value_2}">bookmark</i>`;
          }

        },
      },
    ];
  },
};
</script>

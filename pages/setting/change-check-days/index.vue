<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/change-check-days"
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
    filters: { key: "access_demand_note" },
    title: "تغییر روزهای چک",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        text: "نقش",
        value: (body) => {
          let val = JSON.parse(body.value_json);
          return val.name;
        },
        disableSort: "true",
        filterable: false,
      },
      {
        text: "تعداد روزها",
        value: (body) => {
          if (body.value_2) {
            return body.value_2;
          }
        },
        disableSort: "true",
        type: "price",
        filterable: false,
      },
    ];
  },
};
</script>

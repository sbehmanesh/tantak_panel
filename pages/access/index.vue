<template>
  <div>
    <BaseTable
      url="action"
      :headers="headers"
      :filters="filters"
      :BTNactions="btnActions"
    />
  </div>
</template>
<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data() {
    return {
      title: "دسترسی ها",
      btnActions: [],
      filters: {},
      headers: [],
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    // this.filters = { parent: { op: '=', value: null } }
    this.headers = [
      {
        text: "نام",
        value: "name",
      },
      {
        text: "کلید",
        value: "alias",
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description && body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (body.description && typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
  },
};
</script>

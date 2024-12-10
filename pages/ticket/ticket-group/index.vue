<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/ticket-group"
        autoDelete="/ticket-group/delete"
        autoUpdate="/ticket/ticket-group"
        createUrl="/ticket/ticket-group/insert"
        :headers="headers"
      />
    </v-col>
  </v-row>
</template>
  
  <script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    title: "دسته بندی تیکت ها",
  }),
  computed: {
    headers() {
      return [
        {
          text: "تاریخ ثبت",
          filterCol: "created_at",
          filterType: "date",
          value: (body) => {
            if (body.created_at) {
              return this.$toJalali(body.created_at);
            }
            return "";
          },
        },
        {
          text: " دسته بندی ",
          value: "name",
        },
        {
          text: "دسترسی برای",
          value: (body) => {
            return body.roles.map((x) => x.name).join(" , ");
          },
        },
      ];
    },
  },
  beforeMount() {
    this.$store.dispatch("setting/getRoleServer");
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {},
};
</script>
  
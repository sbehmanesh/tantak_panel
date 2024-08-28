<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/custom-notification"
        :headers="headers"
        createUrl="custom-notif/insert"
        autoUpdate="custom-notif"
        autoDelete="/custom-notification/delete"
      />
    </v-col>
  </v-row>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    items: [],
    filters: {},
    btn_actions: [],
    title: "لیست الگوریتم ها",
  }),
  beforeMount() {
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
      { text: "متن", value: "text" },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.branch_status,
      },
      {
        text: "نوع",
        value: "type",
        filterType: "select",
        items: this.$store.state.static.notif_type,
      },
      { text: "  بخش مربوطه", value: "value" },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {},
};
</script>

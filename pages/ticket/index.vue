<template>
  <v-row>
    <v-col cols="12" md="12" class="pa-0">
      <BaseTable
        url="/ticket"
        sort-by="updated_at"
        createUrl="/ticket/insert"
        :headers="headers"
        :actions="actions"
        :filters="filters"
        :rowColor="rowColor"
      />
    </v-col>
  </v-row>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable.vue";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    actions: [],
    catgoryis: [],
    filters: {},
    type: "",
    helpText: "تیکت های  منتظر پاسخ",
    title: "تیکت ها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    let tiket_status = this.$store.state.static.tiket_status;
    this.headers = [
      { text: "موضوع", value: "name" },
      // {
      //   text: " وضعیت",
      //   value: "status",
      //   items: tiket_status,
      //   filterType: "select",
      // },
      {
        text: "نقش",
        filterCol: "name",
        value: body => {
          if (Array.isArray(body.roles)) {
            return body.roles.map(x => x.name).join(" | ");
          }
          return "";
        }
      },
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
    ];
    if (this.$store.state.auth.action.indexOf("ticket_message/index") > -1) {
      this.actions = [
        {
          text: "نمایش",
          color: "success",
          fun: (body) => {
            this.$router.push("/ticket/" + body.id);
          },
        },
      ];
    }
  },

  methods: {
    rowColor(body) {
      if (body.item.status == "user") {
        return "red lighten-3";
      }
    },
  },
};
</script>

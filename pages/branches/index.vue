<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/branch"
        :headers="headers"
        createUrl="/branches/insert"
        :filters="filters"
        :autoLoad="false"
        autoUpdate="/branches"
        :BTNactions="btn_actions"
        autoDelete="/branch/delete"
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
    title: " شعبات",
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
      {
        text: "کد شعبه",
        value: "branch_code",
      },
      {
        text: " نام شعبه",
        value: "name",
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.branch_status,
      },
      {
        text: "وضعیت",
        value: "sell_type",
        filterType: "select",
        items: this.$store.state.static.sell_type,
      },
      {
        text: "نوع شعبه  ",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.is_main_branch == 0) {
            return "شعبه اصلی";
          } else {
            return "شعبه فرعی";
          }
        },
      },
      {
        text: " آدرس",
        value: "address",
      },
    ];
    // this.btn_actions = [
    //   {
    //     color: "primary",
    //     icon: "inventory",
    //     text: "موجودی",
    //     fun: (body) => {
    //       if (body.id) {
    //         this.$router.push(`/branches/stock/${body.id}`)
    //       }
    //     },
    //   },
    // ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    setFilter(value) {
      if (value == "all") {
        this.filters = {};
      } else {
        this.filters = {
          category_id: {
            op: "=",
            value: value,
          },
        };
      }
      this.items.forEach((element) => {
        if (element.value == value) {
          element.outline = false;
        } else {
          element.outline = true;
        }
      });
    },
  },
};
</script>

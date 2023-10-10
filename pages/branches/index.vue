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
        text: "وضعیت  ",
        value: (body) => {
          if (body.status == "active") {
            return "فعال";
          }
          if (body.status == "inactive") {
            return "غیر فعال";
          }
          if (body.status == "hidden") {
            return "پنهان";
          }
          if (body.status == "suspended") {
            return "معلق";
          }
        },
      },
      {
        text: "نوع فروش  ",
        value: (body) => {
          if (body.sell_type == "sell") {
            return "فروش تکی";
          }
          if (body.sell_type == "wholesale") {
            return " فروش  عمده";
          }
          if (body.sell_type == "both_sell") {
            return "هر دو";
          }
          if (body.sell_type == "none") {
            return "هیچکدام";
          }
        },
      },
      {
        text: "نوع شعبه  ",
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

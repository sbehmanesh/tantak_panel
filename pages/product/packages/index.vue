<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/package"
        :headers="headers"
        createUrl="/product/packages/insert"
        :filters="filters"
        :autoLoad="false"
        autoUpdate="/product/packages"
        :BTNactions="btn_actions"
        autoDelete="/package/delete"
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
    title: " لیست پکیج ها",
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
        text: "تصویر",
        filtrabel: false,
        disabled:true,
        type: "image",
        value: "logo",
      },
      {
        text: "عنوان پکیج",
        value: "name",
      },
      {
        text: "قیمت پکیج (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.branch_status,
      },


      {
        filterable: false,
        text: "توضیحات",
        filterCol: "descriptions",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          }
        },
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

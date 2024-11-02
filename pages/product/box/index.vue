<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/package"
        :headers="headers"
         :createUrl="'/product/box/insert?type=' + type"

        :filters="filters"
        :autoLoad="false"
        autoUpdate="/product/box"
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
    title: " لیست جعبه  ها",
    type:"Box"
  }),
  beforeMount() {
    this.filters = {
      type: {
        op: "=",
        value: this.type,
      },
    };
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
        disabled: true,
        type: "image",
        value: "logo",
      },
      {
        text: "عنوان پکیج",
        value: "name",
      },
      {
        text: "شماره پکیج",
        value: "package_number",
      },

      {
        text: " وزن محصول (گرم)",
        value: "weight",
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
        text: "فروش تلفنی",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.sale_phone) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "فروش حضوری",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.sale_person) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "فروش آنلاین",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.sale_online) {
            return true;
          } else {
            return false;
          }
        },
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
      {
        text: "تعداد بازدید",
        value: "sees_count",
      },
    ];

    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

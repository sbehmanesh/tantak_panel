<template>
  <div>
    <BaseTable
      url="/sale-type"
      autoDelete="/sale-type/delete"
      autoUpdate="/product/sale-type"
      createUrl="/product/sale-type/insert"
      :headers="headers"
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
    pay_id: "",
    title: " انواع فروش",
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



   


      { text: "عنوان نوع فروش", value: "fa_name" },
      { text: "نام انگلیسی", value: "en_name" },
      { text: "ترتیب", value: "sort" },
      {
        text: "توضیحات",
        filterCol: "description",
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
          } else {
            return "-";
          }
        },
      },
    
    ];
  },
  methods: {},
};
</script>

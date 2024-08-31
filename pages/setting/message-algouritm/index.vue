<template>
  <div>
    <BaseTable
      :headers="headers"
      :filters="filters"
      url="/setting"
      
      autoUpdate="/setting/message-algouritm"
      createUrl="/setting/message-algouritm/insert"
      autoDelete="/setting/message-algouritm/delete"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    filters: { key: "custom_notif" },
    title: "الگوریتم اعلانات",
    
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
      {
        text: "عنوان فارسی",
        value: "value",
      },

      { text: "عنوان انگلیسی", value: "value_2" },
    ];
  },
};
</script>

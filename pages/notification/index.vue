<template>
    <div>
      <BaseTable
        :headers="headers"
        url="/notification"
        autoUpdate="/notification"
        createUrl="/notification/insert"
        autoDelete="/notification/delete"
      />
    </div>
  </template>
  
  <script>
  import BaseTable from "~/components/DataTable/BaseTable";
  export default {
    components: { BaseTable },
    data: () => ({
      headers: [],
      title: "اعلانات",
    }),
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
      this.headers = [
        { text: "متن", value: "text" },
        {
          text: "دسته بندی",
          value: "section_name",
          filterType: "select",
          items: this.$store.state.static.type_message,
        },
  
        { text: "نام", value: "user_first_name" },
        { text: "نام خانوادگی", value: "user_last_name" },
        { text: "نام کاربری", value: "user_username" },
      ];
    },
  };
  </script>
  
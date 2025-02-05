<template>
  <div>
    <BaseTable
      url="/comment-category"
      :headers="headers"
      autoDelete="/comment-category/delete"
      autoUpdate="/setting/comment-questions/category"
      createUrl="/setting/comment-questions/category/insert"
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
    btn_actions: [],
    title: " دسته بندی سوالات",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    
    this.headers = [
      { text: "عنوان ", value: "title" },
      {
        text: "وضعیت فعال",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.status=="active") {
            return true;
          } else {
            return false;
          }
        },
      },
  
    ];
  },
};
</script>

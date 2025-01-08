<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters" 
      :headers="headers"
      autoDelete="/setting/delete"

      autoUpdate="/setting/category-user"
      createUrl="/setting/category-user/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "category_user" },
    title: "دسته بندی  کاربران",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان ", value: "value" }];
  },
};
</script>

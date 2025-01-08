<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      autoUpdate="/setting/category-role"
      createUrl="/setting/category-role/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "category_role" },
    title: "دسته بندی نقش ها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان ", value: "value" }];
  },
};
</script>

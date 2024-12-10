<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters" 
      :headers="headers"
      autoUpdate="/setting/for-discount"
      createUrl="/setting/for-discount/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "for_discount" },
    title: "لیست بابت های کد تخفیف ",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان ", value: "value" }];
  },
};
</script>

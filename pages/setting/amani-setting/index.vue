<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters" 
      :headers="headers"
      autoUpdate="/setting/amani-setting"
      createUrl="/setting/amani-setting/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "credit_percentage_for_agency_manager" },
    title: " درصد اعتبار خرید امانی",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: " درصد اعتبار ", value: "value_2" }];
  },
};
</script>

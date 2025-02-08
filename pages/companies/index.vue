<template>
  <div>
    <BaseTable url="/company" :filters="filters" :headers="headers" autoDelete="/company/delete" autoUpdate="/companies"
      createUrl="/companies/insert">
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "لیست شرکت ها",
  }),
  beforeMount() {
    this.headers = [
      { text: "", value: "" },
      { text: "", value: "" },
      { text: "", value: "" },
      { text: "", value: "" },
      { text: "", value: "" },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

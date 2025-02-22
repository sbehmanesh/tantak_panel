<template>
  <div>
    <BaseTable
      url="/employment-form"
      :filters="filters"
      :headers="headers"
      autoDelete="/employment-form/delete"
      autoUpdate="/user/cooperation-requests"
      createUrl="/user/cooperation-requests/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "درخواست های همکاری ( استخدام نیرو )",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان ", value: "value" }];
  },
};
</script>

<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      createUrl="/setting/warranty/insert"
      autoUpdate="/setting/warranty"
      autoDelete="/setting/delete"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "warranty" },
    title: "گارانتی ها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "مدت اعتبار", value: "value" } , 

    ];
  },
};
</script>

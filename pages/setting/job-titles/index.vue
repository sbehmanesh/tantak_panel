<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      autoUpdate="/setting/job-titles"
      createUrl="/setting/job-titles/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "job_position" },
    title: "لیست عناوین شغلی",
  }),
  beforeMount() {
    this.headers = [
      { text: "عنوان ", value: "value" },
      { text: "توضیحات ", value: "value_2" },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

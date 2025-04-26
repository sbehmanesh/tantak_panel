<template>
  <BaseTable url="/survey" :headers="headers" :root-body="body_survey" />
</template>

<script>
export default {
  data() {
    return {
      title: "لیست نظرسنجی",
      headers: [
        {
          filterable: false,
          disableSort: true,
          text: "تاریخ",
          value: (body) => {
            if (body.created_at) {
              return this.$toJalali(body.created_at);
            }
            return "22";
          },
        },

        {
          filterable: false,
          disableSort: true,
          text: "شماره فرستنده",
          value: "cid",
        },
        {
          filterable: false,
          disableSort: true,
          text: "امتیاز",
          value: "score",
        },
      ],
      body_survey: { cdr_id: null },
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.body_survey.cdr_id = this.$route.params.item;
  },
};
</script>

<style></style>

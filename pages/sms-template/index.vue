<template>
  <BaseTable
    url="/sms-template"
    :headers="headers"
    autoDelete="/sms-template/delete"
    autoUpdate="/sms-template/update"
    createUrl="/sms-template/insert"
  />
</template>

<script>
export default {
  data() {
    return {
      title: "الگوی پرداخت",
      headers: [
        {
          text: "تاریخ",
          filterType: "date",
          value: (body) => {
            return body.created_at;
          },
        },
        {
          text: "وضعیت",
          filterType: "select",
          items: this.$store.state.static.sms_template_status,
          disableSort: true,
          value: "status",
        },
        {
          text: "نام فارسی",
          filterable: true,
          value: (body) => {
            return body.fa_name;
          },
        },
        {
          text: "نام انگلیسی",
          filterable: true,
          value: (body) => {
            return body.fa_name;
          },
        },
        {
          text: "محتوا",
          filterable: true,
          value: (body) => {
            return body.content;
          },
        },
      ],
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

<style></style>

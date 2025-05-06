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
          text: "name",
          value: (body) => {
            return body.fa_name;
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

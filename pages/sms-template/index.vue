<template>
  <div>
    <BaseTable
      url="/sms-template"
      :headers="headers"
      autoDelete="/sms-template/delete"
      autoUpdate="/sms-template"
      createUrl="/sms-template/insert"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "الگوی پرداخت",
      headers: [],
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    console.log("lllll", this.$store.state.static.sms_template_kind_set);

    this.headers = [
      {
        text: "تاریخ",
        filterType: "date",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
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
          return body.en_name;
        },
      },
      {
        text: "محتوا",
        filterable: true,
        value: (body) => {
          return body.content;
        },
      },
      {
        text: "نوع پرداخت",
        filterType: "select",
        value: "kind_set",
        disableSort: true,
        items: this.$store.state.static.sms_template_kind_set,
      },
    ];
  },
};
</script>

<style></style>

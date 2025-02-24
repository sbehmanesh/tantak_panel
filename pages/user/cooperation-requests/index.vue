<template>
  <div>
    <BaseTable
      url="/employment-form"
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

    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      { text: "نام کاربر ", value: "first_name" },
      { text: "نام خانوادگی ", value: "last_name" },
      { text: "شماره همراه", value: "phone_number" },
      { text: "کد ملی", value: "national_code" },
      { text: "رشته تحصیلی", value: "field_study" },
    ];
  },
};
</script>

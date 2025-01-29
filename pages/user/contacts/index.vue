<template>
  <div>
    <BaseTable
      url="/contact"
      :headers="headers"
      autoDelete="/contact/delete"
      autoUpdate="/user/contacts"
      createUrl="/user/contacts/insert"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    title: " مخاطبین دفترچه تلفن",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "نام مخاطب", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "شماره تماس", value: "phone_number" },
      {
        text: "دسته بندی",
        value: (body) => {
          if (Boolean(body.category)) {
            return body.category.value;
          }
        },
      },
    ];
  },
};
</script>

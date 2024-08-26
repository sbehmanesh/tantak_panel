<template>
    <NotificationForm />
  </template>
  
  <script>
  import NotificationForm from '~/components/notification/NotificationForm.vue';
  export default {
    components: { NotificationForm },
    data: () => ({
      title: "ثبت اعلان",
    }),
    mounted() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
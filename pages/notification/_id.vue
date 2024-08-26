<template>
    <NotificationForm :model-id="$route.params.id" />
  </template>
  
  <script>
  import NotificationForm from '~/components/notification/NotificationForm.vue';
  export default {
    components: { NotificationForm },
    data: () => ({
      title: "ویرایش اعلان",
    }),
    mounted() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
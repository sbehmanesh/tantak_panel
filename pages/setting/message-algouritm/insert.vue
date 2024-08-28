<template>
    <MessageAlgouritm />
  </template>
  
  <script>
  import MessageAlgouritm from '~/components/MessageAlgouritm/MessageAlgouritm.vue';
  export default {
    components: { MessageAlgouritm },
    data: () => ({
      title: "ثبت پیام",
    }),
    mounted() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
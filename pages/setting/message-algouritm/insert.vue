<template>
    <MessageAlgouritm />
  </template>
  
  <script>
  import MessageAlgouritm from '~/components/MessageAlgouritm/MessageAlgouritm.vue';
  export default {
    components: { MessageAlgouritm },
    data: () => ({
      title: "ثبت اعلان",
    }),
    mounted() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
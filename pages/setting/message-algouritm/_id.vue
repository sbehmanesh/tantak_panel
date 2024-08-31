<template>
    <MessageAlgouritm :model-id="$route.params.id" />
  </template>
  
  <script>
  import MessageAlgouritm from '~/components/MessageAlgouritm/MessageAlgouritm.vue';
  export default {
    components: { MessageAlgouritm },
    data: () => ({
      title: "ویرایش اعلان",
    }),
    mounted() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
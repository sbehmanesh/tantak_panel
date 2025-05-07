<template>
    <AddTemplate
    update-url="/sms-template"
    :template-id="$route.params.id"
    />
  </template>
  
  <script>
  import AddTemplate from '~/components/SmsTemplate/AddTemplate.vue';
  export default {
    components : {AddTemplate},
    data() {
      return {
        title: "ویرایش الگو",
      };
    },
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
  
  <style></style>
  
<template>
    <SmsTemplateForm
    update-url="/sms-template/update"
    :template-id="$route.params.id"
    />
  </template>
  
  <script>
  import SmsTemplateForm from '~/components/SmsTemplate/SmsTemplateForm.vue';
  export default {
    components : {SmsTemplateForm},
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
  
<template>
  <SmsTemplateForm
  createUrl="/sms-template/insert"
  />
</template>

<script>
import SmsTemplateForm from '~/components/SmsTemplate/SmsTemplateForm.vue';
export default {
  components : {SmsTemplateForm},
  data() {
    return {
      title: "الگوی جدید",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

<style></style>

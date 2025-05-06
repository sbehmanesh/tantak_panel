<template>
  <AddTemplate
  createUrl="/sms-template/insert"
  />
</template>

<script>
import AddTemplate from '~/components/SmsTemplate/AddTemplate.vue';
export default {
  components : {AddTemplate},
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

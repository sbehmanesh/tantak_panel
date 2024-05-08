<template>
  <div>
    <MessageForm />
  </div>
</template>

<script>
import MessageForm from '@/components/NewCallCenter/MessageForm.vue'
export default {
  components: { MessageForm },
  data: () => ({
    title: "ایجاد پیام",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
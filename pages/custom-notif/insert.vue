<template>
  <div>
    <NotificationForm />
  </div>
</template>

<script>
import NotificationForm from '@/components/Setting/NotificationForm.vue'
export default {
  components: { NotificationForm },
  data: () => ({
    title: "ثبت  الگوریتم اعلان",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
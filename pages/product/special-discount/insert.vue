<template>
  <SpecialDiscount />
</template>

<script>
import SpecialDiscount from "@/components/Product/SpecialDiscount.vue";
export default {
  components: { SpecialDiscount },
  data: () => ({
    title: "ایجاد تخفیف جدید",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

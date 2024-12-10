<template>
  <div>
    <DiscountCode />
  </div>
</template>
<script>
import DiscountCode from "@/components/Product/DiscountCode.vue";
export default {
  components: { DiscountCode },
  data() {
    return {
      title: "ایجاد کد تخفیف",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

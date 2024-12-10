<template>
  <div>
    <DiscountCode :model-id="$route.params.id" />
  </div>
</template>
  
  <script>
import DiscountCode from "@/components/Product/DiscountCode.vue";

export default {
  components: { DiscountCode },
  data: () => ({
    title: "ویرایش کد تخفیف",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
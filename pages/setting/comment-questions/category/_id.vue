<template>
  <CategoryQuestions :model-id="$route.params.id" />
</template>
<script>
import CategoryQuestions from '@/components/CallCenter/CategoryQuestions.vue'

export default {
  components: { CategoryQuestions },
  data: () => ({
    title: "ویرایش دسته بندی",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

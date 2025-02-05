<template>
  <CategoryQuestions />
</template>

<script>
import CategoryQuestions from '@/components/CallCenter/CategoryQuestions.vue'
export default {
  components: { CategoryQuestions },
  data: () => ({
    title: 'ایجاد دسته بندی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

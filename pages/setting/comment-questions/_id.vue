<template>
  <CommentQuestions :model-id="$route.params.id" />
</template>

<script>
import CommentQuestions from '@/components/CallCenter/CommentQuestions.vue'
export default {
  components: { CommentQuestions },
  data: () => ({
    title: 'ویرایش سوال',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

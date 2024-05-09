<template>
  <CommentQuestions />
</template>

<script>
import CommentQuestions from '@/components/CallCenter/CommentQuestions.vue'
export default {
  components: { CommentQuestions },
  data: () => ({
    title: 'افزودن سوال جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

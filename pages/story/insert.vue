<template>
  <StoryForm />
</template>

<script>
import StoryForm from '@/components/story/StoryForm.vue'
export default {
  components: { StoryForm },
  data: () => ({
    title: 'افزودن داستان',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

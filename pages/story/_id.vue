<template>
  <StoryForm :model-id="$route.params.id" />
</template>

<script>
import StoryForm from '@/components/story/StoryForm.vue'

export default {
  components: { StoryForm },
  data: () => ({
    title: 'ویرایش   داستان',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

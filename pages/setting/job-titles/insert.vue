<template>
  <JobTitlesForm />
</template>

<script>
import JobTitlesForm from '@/components/Setting/JobTitlesForm.vue'
export default {
  components: { JobTitlesForm },
  data: () => ({
    title: 'افزودن   عنوان شغلی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

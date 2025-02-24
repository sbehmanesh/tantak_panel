<template>
  <JobTitlesForm :model-id="$route.params.id" />
</template>

<script>
import JobTitlesForm from '@/components/Setting/JobTitlesForm.vue'
export default {
  components: { JobTitlesForm },
  data: () => ({
    title: 'ویرایش  عنوان شغلی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

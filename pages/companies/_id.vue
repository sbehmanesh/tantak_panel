<template>
  <CompaniesForm :model-id="$route.params.id" />
</template>

<script>
import CompaniesForm from '@/components/Companies/CompaniesForm.vue'
export default {
  components: { CompaniesForm },
  data: () => ({
    title: 'ویرایش  شرکت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

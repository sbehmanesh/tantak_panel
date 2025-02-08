<template>
  <CompaniesForm />
</template>

<script>
import CompaniesForm from '@/components/Companies/CompaniesForm.vue'

export default {
  components: { CompaniesForm },
  data: () => ({
    title: 'افزودن شرکت  جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

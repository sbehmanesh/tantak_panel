<template>
  <SealRepresentativeForm :model-id="$route.params.id" />
</template>

<script>
import SealRepresentativeForm from '~/components/Product/Representative/SealRepresentativeForm.vue'
export default {
  components: { SealRepresentativeForm },
  data: () => ({
    title: 'ویرایش  نمایندگی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

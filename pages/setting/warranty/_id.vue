<template>
  <WarrantyForm :model-id="$route.params.id" />
</template>

<script>
import WarrantyForm from '@/components/Setting/WarrantyForm.vue'
export default {
  components: { WarrantyForm },
  data: () => ({
    title: 'ویرایش گارانتی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

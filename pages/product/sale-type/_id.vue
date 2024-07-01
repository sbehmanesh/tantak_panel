<template>
  <SaleTypeForm :model-id="$route.params.id" />
</template>

<script>
import SaleTypeForm from '@/components/Product/SaleTypeForm.vue'
export default {
  components: { SaleTypeForm },
  data: () => ({
    title: 'ویرایش نوع فروش',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

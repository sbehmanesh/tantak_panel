<template>
  <ColorProductsForm :model-id="$route.params.id" />
</template>

<script>
import ColorProductsForm from '@/components/Setting/ColorProductsForm.vue'
export default {
  components: { ColorProductsForm },
  data: () => ({
    title: 'ویرایش  رنگ بندی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

<template>
  <ProductForm :model-id="$route.params.id" />
</template>

<script>
import ProductForm from '@/components/Product/ProductForm.vue'
export default {
  components: { ProductForm },
  data: () => ({
    title: 'ویرایش محصول',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

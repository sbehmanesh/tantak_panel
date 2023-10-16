<template>
  <ProductForm />
</template>

<script>
import ProductForm from '@/components/Product/ProductForm'
export default {
  components: { ProductForm },
  data: () => ({
    title: 'افزودن محصول جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

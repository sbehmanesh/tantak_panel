<template>
  <ColorProductsForm />
</template>

<script>
import ColorProductsForm from '@/components/Setting/ColorProductsForm.vue'
export default {
  components: { ColorProductsForm },
  data: () => ({
    title: 'ایجاد رنگ بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

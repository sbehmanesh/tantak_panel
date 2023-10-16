<template>
  <CategoryForm />
</template>

<script>
import CategoryForm from '@/components/Product/CategoryForm'
export default {
  components: { CategoryForm },
  data: () => ({
    title: 'افزودن دسته بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

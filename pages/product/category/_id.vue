<template>
  <CategoryForm :model-id="$route.params.id" />
</template>

<script>
import CategoryForm from '@/components/Product/CategoryForm.vue'
export default {
  components: { CategoryForm },
  data: () => ({
    title: 'ویرایش دسته بندی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

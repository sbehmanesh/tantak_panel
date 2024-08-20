<template>
  <CategoryVariation />
</template>

<script>
import CategoryVariation from '@/components/Product/CategoryVariation.vue'
export default {
  components: { CategoryVariation },
  data: () => ({
    title: 'ایجاد ویژگی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

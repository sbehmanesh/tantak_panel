<template>
  <CategoryVariation :model-id="$route.params.id"/>
</template>

<script>
import CategoryVariation from '@/components/Product/CategoryVariation.vue'
export default {
  components: { CategoryVariation },
  data: () => ({
    title: 'ویرایش',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

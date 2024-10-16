<template>
  <SpecialDiscount :model-id="$route.params.id" />
</template>

<script>
import SpecialDiscount from '@/components/Product/SpecialDiscount.vue'
export default {
  components: { SpecialDiscount },
  data: () => ({
    title: 'ویرایش تخفیف',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

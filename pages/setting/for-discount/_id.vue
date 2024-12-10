<template>
  <ForDiscount :model-id="$route.params.id" />
</template>

<script>
import ForDiscount from '@/components/Setting/ForDiscount.vue'
export default {
  components: { ForDiscount },
  data: () => ({
    title: 'ویرایش بابت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

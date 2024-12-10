<template>
  <ForDiscount />
</template>

<script>
import ForDiscount from '@/components/Setting/ForDiscount.vue'
export default {
  components: { ForDiscount },
  data: () => ({
    title: 'افزودن بابت جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

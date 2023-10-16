<template>
  <WholeSellForm />
</template>

<script>
import WholeSellForm from '@/components/Setting/WholeSellForm'
export default {
  components: { WholeSellForm },
  data: () => ({
    title: 'افزودن دسترسی جدید برای فروش عمده',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

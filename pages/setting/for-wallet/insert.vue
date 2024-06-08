<template>
  <ForWallet />
</template>

<script>
import ForWallet from '@/components/Setting/ForWallet.vue'
export default {
  components: { ForWallet },
  data: () => ({
    title: 'افزودن بابت جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

<template>
  <ForWallet :model-id="$route.params.id" />
</template>

<script>
import ForWallet from '@/components/Setting/ForWallet.vue'
export default {
  components: { ForWallet },
  data: () => ({
    title: 'ویرایش بابت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

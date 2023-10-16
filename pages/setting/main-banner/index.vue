<template>
  <MainBanner :model-id="$route.params.id" />
</template>

<script>
import MainBanner from '@/components/Setting/MainBanner.vue'
export default {
  components: { MainBanner },
  data: () => ({
    title: 'تنظیمات بنرهای صفحه اصلی ',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

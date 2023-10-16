<template>
  <MixtureForm :model-id="$route.params.id" />
</template>

<script>
import MixtureForm from '@/components/Setting/MixtureForm'
export default {
  components: { MixtureForm },
  data: () => ({
    title: 'تنظیمات دمنوش ساز',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

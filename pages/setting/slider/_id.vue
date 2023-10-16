<template>
  <MainSliderForm :model-id="$route.params.id" />
</template>

<script>
import MainSliderForm from '@/components/Setting/MainSliderForm.vue'
export default {
  components: { MainSliderForm },
  data: () => ({
    title: 'ویرایش اسلاید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

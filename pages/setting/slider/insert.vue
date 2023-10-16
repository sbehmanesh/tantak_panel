<template>
  <MainSliderForm />
</template>

<script>
import MainSliderForm from '@/components/Setting/MainSliderForm.vue'
export default {
  components: { MainSliderForm },
  data: () => ({
    title: 'افزودن اسلاید جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

<template>
  <AmaniSettingForm :model-id="$route.params.id" />
</template>

<script>
import AmaniSettingForm from '@/components/Setting/AmaniSettingForm.vue'
export default {
  components: { AmaniSettingForm },
  data: () => ({
    title: 'ویرایش درصد',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

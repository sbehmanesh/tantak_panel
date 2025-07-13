<template>
  <AmaniSettingForm />
</template>

<script>
import AmaniSettingForm from '@/components/Setting/AmaniSettingForm.vue'
export default {
  components: { AmaniSettingForm },
  data: () => ({
    title: 'افزودن  درصد اعتبار  جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

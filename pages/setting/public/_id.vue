<template>
  <SettingForm :model-id="model_id" />
</template>

<script>
import SettingForm from '@/components/Setting/SettingForm.vue'
export default {
  components: { SettingForm },
  data: () => ({
    title: 'ویرایش تنظیمات',
    model_id:'',
  }),
  beforeMount() {
    this.model_id = this.$route.params.id
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

<template>
  <FeeForm />
</template>

<script>
import FeeForm from '@/components/NewCallCenter/FeeSetting/FeeForm.vue'
export default {
  components: { FeeForm },
  data: () => ({
    title: "ایجاد کارمزد",
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

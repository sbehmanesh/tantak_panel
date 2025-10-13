<template>
  <FeeForm :model-id="$route.params.id" />
</template>

<script>
import FeeForm from '@/components/NewCallCenter/FeeSetting/FeeForm.vue'
export default {
  components: { FeeForm },
  data: () => ({
      title: 'ویرایش کارمزد',

  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

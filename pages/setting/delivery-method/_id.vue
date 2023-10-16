<template>
  <DeliveryForm :model-id="$route.params.id" />
</template>

<script>
import DeliveryForm from '@/components/Setting/DeliveryForm.vue'
export default {
  components: { DeliveryForm },
  data: () => ({
    title: 'افزودن ویژگی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

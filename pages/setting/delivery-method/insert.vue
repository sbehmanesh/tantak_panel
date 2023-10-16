<template>
  <DeliveryForm />
</template>

<script>
import DeliveryForm from '@/components/Setting/DeliveryForm'
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

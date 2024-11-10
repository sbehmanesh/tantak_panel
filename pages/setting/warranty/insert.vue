<template>
  <WarrantyForm />
</template>

<script>
import WarrantyForm from '@/components/Setting/WarrantyForm.vue'

export default {
  components: { WarrantyForm },
  data: () => ({
    title: 'ایجاد  گارانتی  جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

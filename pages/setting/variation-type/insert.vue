<template>
  <VariationTypeForm />
</template>

<script>
import VariationTypeForm from '@/components/Setting/VariationTypeForm.vue'
export default {
  components: { VariationTypeForm },
  data: () => ({
    title: 'افزودن ویژگی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

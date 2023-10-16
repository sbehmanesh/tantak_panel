<template>
  <VariationTypeForm :model-id="$route.params.id" />
</template>

<script>
import VariationTypeForm from '@/components/Setting/VariationTypeForm'
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

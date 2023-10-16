<template>
  <UnitsForm :model-id="$route.params.id" />
</template>

<script>
import UnitsForm from '@/components/Setting/UnitsForm'
export default {
  components: { UnitsForm },
  data: () => ({
    title: 'افزودن ویژگی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

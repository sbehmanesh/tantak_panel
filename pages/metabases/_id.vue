<template>
  <Form :model-id="$route.params.id" />
</template>

<script>
import Form from '@/components/Metabase/Form.vue'
export default {
  components: { Form },
  data: () => ({
    title: 'ویرایش گزارش',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

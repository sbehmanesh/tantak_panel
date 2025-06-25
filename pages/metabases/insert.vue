<template>
  <Form />
</template>

<script>
import Form from '@/components/Metabase/Form.vue'
export default {
  components: { Form },
  data: () => ({
    title: 'گزارش جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

<template>
  <Form />
</template>

<script>
import Form from '@/components/NewCallCenter/CreditRequest/Form.vue'
export default {
  components: { Form },
  data: () => ({
    title: 'افزودن بابت جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

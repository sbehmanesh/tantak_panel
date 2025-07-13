<template>
  <Form :model-id="$route.params.id" />
</template>

<script>
import Form from '@/components/NewCallCenter/CreditRequest/Form.vue'

export default {
  components: { Form },
  data: () => ({
    title: 'ویرایش بابت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

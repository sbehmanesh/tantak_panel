<template>
  <div>
    <Form />
  </div>
</template>

<script>
import Form from '@/components/User/CooperationRequests/Form.vue'
export default {
  components: { Form },
  data: () => ({
    title: 'ثبت  درخواست همکاری',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
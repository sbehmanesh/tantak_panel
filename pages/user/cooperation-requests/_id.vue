<template>
  <div>
      <Form :model-id='$route.params.id' />
  </div>
</template>

<script>
import Form from '@/components/User/CooperationRequests/Form.vue'

export default {
  components:{Form},
  data: () => ({
    title: 'ویرایش درخواست همکاری',
  }),
  beforeMount() {
    
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
<template>
  <div>
      <NotificationForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import NotificationForm from '@/components/Setting/NotificationForm.vue'
export default {
  components:{NotificationForm},
  data: () => ({
    title: 'ویرایش  الگوریتم اعلان',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
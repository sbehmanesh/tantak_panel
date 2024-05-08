<template>
  <div>
      <MessageForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import MessageForm from '@/components/NewCallCenter/MessageForm.vue'
export default {
  components:{MessageForm},
  data: () => ({
    title: 'ویرایش پیام',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
<template>
  <div>
      <CenterStokForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import CenterStokForm from '~/components/NewCallCenter/CenterStok/CenterStokForm.vue'
export default {
  components:{CenterStokForm},
  data: () => ({
    title: 'ویرایش بازه زمانی',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
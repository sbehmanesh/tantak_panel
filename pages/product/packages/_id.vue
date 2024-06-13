<template>
  <div>
      <PackageForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import PackageForm from '@/components/Product/PackageForm.vue'
export default {
  components:{PackageForm},
  data: () => ({
    title: 'ویرایش پکیج',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
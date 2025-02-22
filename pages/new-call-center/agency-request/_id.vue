<template>
  <div>
      <AgencyRequestForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import AgencyRequestForm from '@/components/NewCallCenter/InventoryRequest/agency/AgencyRequestForm.vue'
export default {
  components:{AgencyRequestForm},
  data: () => ({
    title: 'ویرایش درخواست',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
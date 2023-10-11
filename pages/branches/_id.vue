<template>
  <div>
      <BrancheFrom :model-id='$route.params.id' />
  </div>
</template>

<script>
import BrancheFrom from '@/components/Branches/BrancheFrom.vue'
export default {
  components:{BrancheFrom},
  data: () => ({
    title: 'ویرایش شعبه',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
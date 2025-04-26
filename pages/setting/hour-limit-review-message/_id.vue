<template>
  <HourLimitReview :model-id="$route.params.id" />
</template>

<script>
import HourLimitReview from '~/components/Setting/HourLimitReview.vue';
export default {
  components: { HourLimitReview },
  data: () => ({
    title: 'تعداد ساعت مهلت برسی',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
 
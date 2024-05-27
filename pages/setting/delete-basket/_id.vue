<template>
  <DeleteBasket :model-id="$route.params.id" />
</template>

<script>
import DeleteBasket from '@/components/Setting/DeleteBasket.vue'
export default {
  components: { DeleteBasket },
  data: () => ({
    title: 'ویرایش بازه زمانی حذف سبد خرید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

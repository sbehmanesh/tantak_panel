<template>
  <CategoryUserForm :model-id="$route.params.id" />
</template>

<script>
import CategoryUserForm from '@/components/Setting/CategoryUserForm.vue'
export default {
  components: { CategoryUserForm },
  data: () => ({
    title: 'ویرایش دسته بندی کاربران',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

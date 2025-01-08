<template>
  <CategoryRoleForm :model-id="$route.params.id" />
</template>

<script>
import CategoryRoleForm from '@/components/Setting/CategoryRoleForm.vue'
export default {
  components: { CategoryRoleForm },
  data: () => ({
    title: 'ویرایش دسته بندی نقش',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

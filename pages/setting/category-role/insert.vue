<template>
  <CategoryRoleForm />
</template>

<script>
import CategoryRoleForm from '@/components/Setting/CategoryRoleForm.vue'
export default {
  components: { CategoryRoleForm },
  data: () => ({
    title: 'افزودن دسته بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

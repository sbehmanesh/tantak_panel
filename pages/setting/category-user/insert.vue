<template>
  <CategoryUserForm />
</template>

<script>
import CategoryUserForm from '@/components/Setting/CategoryUserForm.vue'
export default {
  components: { CategoryUserForm },
  data: () => ({
    title: 'افزودن دسته بندی جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

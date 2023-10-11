<template>
    <div>
      <RegionForm  />
    </div>
  </template>
  
  <script>
  import RegionForm from '@/components/Region/RegionForm.vue'
  export default {
    components: { RegionForm },
    data: () => ({
      title: 'ثبت ناحیه جدید',
    }),
    beforeMount() {
    },
    mounted() {
      this.$store.dispatch('setPageTitle', this.title)
    },
  }
  </script>
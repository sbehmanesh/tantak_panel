<template>
    <div>
      <SpecialCreditForm  />
    </div>
  </template>
  
  <script>
  import SpecialCreditForm from '@/components/User/SpecialCreditForm.vue'
  export default {
    components: { SpecialCreditForm },
    data: () => ({
      title: 'ویرایش اعتبار   ',
    }),
    beforeMount() {
    },
    mounted() {
      this.$store.dispatch('setPageTitle', this.title)
    },
  }
  </script>
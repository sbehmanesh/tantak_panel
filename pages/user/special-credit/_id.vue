<template>
    <div>
      <SpecialCreditForm  :model-id="$route.params.id" />
    </div>
  </template>
  
  <script>
  import SpecialCreditForm from '~/components/User/SpecialCredit/SpecialCreditForm.vue'
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
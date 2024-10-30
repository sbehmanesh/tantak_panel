<template>
  <div>
    <SpecialCreditForm  />
  </div>
</template>

<script>
  import SpecialCreditForm from '~/components/User/SpecialCredit/SpecialCreditForm.vue'
export default {
  components: { SpecialCreditForm },
  data: () => ({
    title: 'ثبت اعتبار ویژه ',
  }),
  beforeMount() {

    
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
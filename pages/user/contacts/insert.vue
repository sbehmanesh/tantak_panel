<template>
  <div>
    <ContactsForm  />
  </div>
</template>

<script>
import ContactsForm from '@/components/User/ContactsForm.vue'
export default {
  components: { ContactsForm },
  data: () => ({
    title: 'ثبت مخاطب جدید',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
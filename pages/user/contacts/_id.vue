<template>
  <ContactsForm :model-id="$route.params.id" />
</template>

<script>
import ContactsForm from '@/components/User/ContactsForm.vue'
export default {
  components: { ContactsForm },
  data: () => ({
    title: 'ویرایش     مخاطب',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

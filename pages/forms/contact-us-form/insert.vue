<template>
  <div>
    <ContactUsForm />
  </div>
</template>
  
  <script>
import ContactUsForm from "@/components/Forms/ContactUsForm.vue";
export default {
  components: {  ContactUsForm },
  data: () => ({
    title: "ایجاد فرم",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
  },
};
</script>
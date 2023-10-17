<template>
  <div>
    <CepresentationRequestForm />
  </div>
</template>
  
  <script>
import CepresentationRequestForm from "@/components/Forms/CepresentationRequestForm.vue";
export default {
  components: {  CepresentationRequestForm },
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
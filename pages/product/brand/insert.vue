<template>
    <div>
      <BrandForm />
    </div>
  </template>
  
  <script>
  import BrandForm from "@/components/Product/BrandForm.vue";
  
  export default {
    components: { BrandForm },
    data: () => ({
      title: "ایجاد برند"
    }),
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    },
    methods: {}
  };
  </script>
  
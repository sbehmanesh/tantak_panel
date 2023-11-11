<template>
    <div>
      <BrandForm :model-id="$route.params.id" />
    </div>
  </template>
  
  <script>
  import BrandForm from "@/components/Product/BrandForm.vue";
  
  export default {
    components: { BrandForm },
    data: () => ({
      title: "ویرایش برند"
    }),
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    },
    methods: {}
  };
  </script>
  
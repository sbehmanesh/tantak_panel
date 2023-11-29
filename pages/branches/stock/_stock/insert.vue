<template>
    <div>
      <WarehouseStockForm :model-id="$route.params.id" />
    </div>
  </template>
    
    <script>
  import WarehouseStockForm from '~/components/WarehouseStock/WarehouseStockForm.vue';
  export default {
    components: {  WarehouseStockForm },
    data: () => ({
      title: "ایجاد",
    }),
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    },
    methods: {
    },
  };
  </script>
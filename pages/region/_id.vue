<template>
  <div>
    <RegionForm :model-id="$route.params.id" />
  </div>
</template>
  
  <script>
import RegionForm from "../../components/Region/RegionForm.vue";
export default {
  components: {  RegionForm },
  data: () => ({
    title: " ویرایش ناحیه ",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
  },
};
</script>
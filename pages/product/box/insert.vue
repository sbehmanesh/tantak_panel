<template>
  <div>
    <PackageForm />
  </div>
</template>

<script>
import PackageForm from '@/components/Product/PackageForm.vue'
export default {
  components: { PackageForm },
  data: () => ({
    title: "ثبت جعبه",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
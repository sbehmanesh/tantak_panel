<template>
</template>
  <SealRepresentativeForm />

<script>
import SealRepresentativeForm from "~/components/Product/Representative/SealRepresentativeForm.vue";
export default {
  components: { SealRepresentativeForm },
  data: () => ({
    title: "ایجاد  نمایندگی",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

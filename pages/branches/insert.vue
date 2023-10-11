<template>
  <div>
    <BrancheFrom />
  </div>
</template>

<script>
import BrancheFrom from "@/components/Branches/BrancheFrom.vue";
export default {
  components: { BrancheFrom },
  data: () => ({
    title: "ثبت شعبه",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
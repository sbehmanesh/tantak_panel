<template>
  <div>
    <CenterStokForm />
  </div>
</template>

<script>
import CenterStokForm from '~/components/NewCallCenter/CenterStok/CenterStokForm.vue'
export default {
  components: { CenterStokForm },
  data: () => ({
    title: "ثبت بازه زمانی",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
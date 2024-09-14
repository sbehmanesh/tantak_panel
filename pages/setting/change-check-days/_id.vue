<template>
  <ChangeCheckDays :model-id="$route.params.id" />
</template>

<script>
import ChangeCheckDays from "~/components/Setting/ChangeCheckDays.vue";
export default {
  components: { ChangeCheckDays },
  data: () => ({
    title: "ویرایش  روزهای چک",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

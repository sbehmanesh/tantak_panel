<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.redirect();
  },
  methods: {
    redirect() {
      if (this.$checkAccess("access_cartable/coordinator_manager")) {
        this.$router.push("/panel/coordinator-manager");
      }
      if (this.$checkAccess("access_cartable/coordinator")) {
        this.$router.push("/panel/coordinator");
      }
      if (this.$checkAccess("access_cartable/coordinator_supervisor")) {
        this.$router.push("/panel/coordinator-supervisor");
      }
    },
  },
};
</script>

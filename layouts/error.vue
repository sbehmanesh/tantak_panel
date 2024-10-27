<template>
  <v-app dark></v-app>
</template>
<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    title: ""
  }),
  head() {
    this.checkDomain();
    return {
      title: this.title
    };
  },
  mounted() {
    this.$router.push("/error");
    setTimeout(() => {
      document.getElementById("landing-parent").style.display = "none";
    }, 1000);
  },
  methods: {
    checkDomain() {
      this.$store.dispatch("setAppName");
      this.$store.dispatch("setLogo");
      this.title = this.$store.state.page_title;
    }
  }
};
</script>

<style></style>

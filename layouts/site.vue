<template>
  <v-app>
    <div class="fit h-max main_contact">
      <nuxt />
    </div>
  </v-app>
</template>

<script>
export default {
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

<style scoped>
.main_contact {
  margin: 0;
  padding: 0;
}
</style>

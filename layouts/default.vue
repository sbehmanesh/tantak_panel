<template>
  <v-app>
    <AppBar v-model="drawer" class="container_menu" />
    <MenuDrawer
      v-model="drawer"
      v-if="!$vuetify.breakpoint.mdAndUp"
      class="container_menu"
    />
    <v-main v-if="show_body">
      <v-card class="ma-2 rounded-t-lg">
        <PageTitle />
        <nuxt />
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "@/components/Layout/AppBar.vue";
import PageTitle from "~/components/Layout/PageTitle.vue";
import MenuDrawer from "@/components/Layout/MenuDrawer.vue";
export default {
  name: "default",
  components: { AppBar, PageTitle, MenuDrawer },
  data: () => ({
    title: "",
    drawer: false,
    show_body: false,
    call_notif: false,
  }),
  mounted() {
    this.checkAuth();
    this.checkNotification();
    this.callNotif();
  },
  watch: {
    "$store.state.auth.action"() {
      if (this.$store.state.auth.action.length > 0) {
        if (this.$checkAccess("brand/delete")) {
          this.$store.dispatch("setting/setBrand");
        }
        if (this.$checkAccess("country_division/index")) {
          this.$store.dispatch("setting/setCountryDivision");
        }
        if (this.$checkAccess("branch/index")) {
          this.$store.dispatch("setting/setBranchCod");
        }
        if (this.$checkAccess("region/index")) {
          this.$store.dispatch("setting/setgetRegion");
        }
        if (this.$checkRole("action/index")) {
          this.$store.dispatch("setting/getActions");
        }
      }
    },
  },
  head() {
    this.checkDomain();
    return {
      title: this.title,
    };
  },

  methods: {
    showBody() {
      this.show_body = true;

      setTimeout(() => {
        // this.$store.dispatch("setting/setgetRegion", {}, { root: true });
        document.getElementById("landing-parent").style.display = "none";
      }, 1000);
    },
    checkAuth() {
      let user = this.$store.state.auth.user;
      document.getElementById("landing-parent").style.display = "flex";
      if (Boolean(user)) {
        this.showBody();
      } else {
        this.$store.dispatch("auth/nuxtServerInit").then(() => {
          this.showBody();
        });
      }
    },
    checkDomain() {
      this.$store.dispatch("setAppName");
      this.$store.dispatch("setLogo");
      this.title = this.$store.state.page_title;
    },
    checkNotification() {
      this.$store.dispatch("notification/getNotif");
    },
    goMessages() {
      var link = document.createElement("a");
      link.href = this.$store.state.chat_url + "/#/messages";
      link.target = "_blanck";
      link.click();
    },
    callNotif() {
      setInterval(() => {
        this.checkNotification();
      }, 900000);
    },
  },
};
</script>
<style scoped>
.fix_btn {
  position: fixed;
  bottom: 12px;
  z-index: 10000;
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
  width: 100%;
  /* max-width: 400px; */
}
.container_menu {
  z-index: 12;
}
</style>

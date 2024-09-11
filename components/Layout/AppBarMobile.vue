<template>
  <v-app-bar app :height="is_mobile ? 110 : 150" color="light_purple">
    <!-- <v-container fluid class="ma-0"> -->
    <v-row dense class="h-max">
      <!-- <v-col cols="12" class="mb-1">
          <v-row class="d-flex justify-space-between align-center"> -->
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <img
          :src="$store.state.logo"
          width="auto"
          height="50"
          class="bg_image"
        />
        <span class="white--text">امروز {{ dateTime }}</span>
      </v-col>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <v-icon
          dark
          @click="toggleDrawer()"
          >menu</v-icon
        >
        <div class="d-flex align-center">
        <NotificationBadge />
        <Profile />
        </div>
      </v-col>
    </v-row>
    <!-- </v-container> -->
  </v-app-bar>
</template>

<script>
let jmoment = require("jalali-moment");
import Profile from "@/components/Layout/Profile.vue";
import AppBarMenu from "@/components/Layout/AppBarMenu.vue";
import NotificationBadge from "../notification/NotificationBadge.vue";
export default {
  components: { Profile, AppBarMenu, NotificationBadge },
  props: {
    value: {
      required: false,
    },
  },
  data: () => ({
    menu: [],
    drawer: false,
  }),
  computed: {
    dateTime() {
      let date = this.$store.state.server_time;
      if (typeof date == "string" && date.length > 0) {
        return jmoment(date).format("jDD jMMMM jYYYY");
      }
      return "";
    },
    is_mobile() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },
  },
  watch: {
    drawer() {
      this.$emit("input", this.drawer);
    },
    value() {
      this.drawer = this.value;
    },
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
.v-app-bar {
  background-image: radial-gradient(circle at 0 0, #fd5800, #ffae00 100%);
}
.log_mobile {
  position: absolute;
  top: 3px;
}
.bg_image {
  border-radius: 20px;
  background-image: radial-gradient(circle at 0 0, #ff5900, #000000b5 100%);
}
</style>

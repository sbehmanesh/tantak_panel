<template>
  <v-app-bar app :height="is_mobile ? 100 : 180" color="light_purple">
    <v-container fluid class="ma-0 ">
      <v-row dense class="h-max">
        <v-col cols="12" class="mb-1">
          <v-row class="d-flex justify-space-between align-center">
            <v-col cols="12" md="4" :class="is_mobile ? 'log_mobile' : ''">
              <div :class="is_mobile ? '' : 'py-4'">

                <img
                  :src="$store.state.logo"
                  width="auto"
                  height="80"
                  class="bg_image"
                />
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              :class="
                is_mobile
                  ? 'd-flex justify-center mt-2'
                  : 'd-flex justify-center mb-8'
              "
            >
              <span class="white--text">امروز {{ dateTime }}</span>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-end align-center">
              <NotificationBadge />
              <Profile />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" :class="is_mobile ? 'menu-header' : ''">
          <AppBarMenu v-if="$vuetify.breakpoint.mdAndUp" />
          <v-icon
            :class="is_mobile ? 'mobile_icon' : 'absulut'"
            dark
            v-else
            @click="toggleDrawer()"
            >menu</v-icon
          >
        </v-col>
      </v-row>
    </v-container>
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
  background-image: radial-gradient(circle at 0 0, #0a4082, #0a4082 100%);
}
.log_mobile {
  position: absolute;
  top: 3px;
}
.bg_image {
  border-radius: 20px;
  background-image: radial-gradient(circle at 0 0, #055ac2, #000000b5 100%);
}
</style>

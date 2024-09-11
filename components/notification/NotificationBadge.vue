<template>
    <v-badge
      :class="[customClass, 'notification-badge']"
      :color="$store.state.notification.count > 0 ? 'success' : ''"
      overlap
      left
      offset-x="13"
      offset-y="13"
      :value="$store.state.notification.count"
    >
      <span
        class="font_12"
        slot="badge"
        v-if="$store.state.notification.count > 0"
        >{{ $store.state.notification.count }}</span
      >
      <v-btn icon @click="openNotifications" small>
        <v-icon size="x-large" color="white"> notifications </v-icon>
      </v-btn>
    </v-badge>
</template>
<script>
export default {
  props: {
    customClass: {
      type: String,
      default: "",
    },
  },
  methods: {
    openNotifications() {
      this.$reqApi("/notification/seen")
        .then(() => {})
        .catch((error) => {});
      this.$router.push("/message");
      this.$store.dispatch('notification/setSeenNotification')
    },
  },
};
</script>

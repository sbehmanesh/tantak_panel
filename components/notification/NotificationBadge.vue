<template>
  <div>
    <v-badge
      :class="[customClass, 'notification-badge']"
      :color="checkNotif ? 'success' : ''"
      overlap
      left
      offset-x="13"
      offset-y="13"
      :value="$store.state.notification.count"
    >
      <span
        class="font_12"
        slot="badge"
        v-if="checkNotif"
        >{{ $store.state.notification.count }}</span
      >
      <v-btn icon @click="openNotifications" small>
        <v-icon size="x-large" color="white"> notifications </v-icon>
      </v-btn>
    </v-badge>
  </div>
</template>
<script>
export default {
  props: {
    customClass: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    checkNotif: true
  }),
  methods: {
    openNotifications() {
      this.$reqApi("/notification/seen")
        .then(() => {})
        .catch((error) => {});
      this.$router.push("/message");
      this.checkNotif = false
    },
  },
};
</script>

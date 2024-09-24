<template>
  <v-card
    v-if="is_access"
    @click="sendRoute(card.route)"
    width="110"
    :class="[
      'd-flex flex-column justify-center align-center my-2 border-radius-10 elevation-0',
      $vuetify.breakpoint.mdAndUp ? 'px-3 py-2' : 'mx-1 px-1 pt-1',
    ]"
    :style="{
      border: '2px solid' + card.color + '!important',
      backgroundColor: card.backgroundColor,
    }"
  >
    <img :src="card.icon" width="28" />
    <div class="my-2 text-center" :style="{ color: card.textcolor }">
      {{ card.title }}
    </div>
    <div class="font-weight-bold font_18" :style="{ color: card.textcolor }">
      {{ card.count }}
    </div>
  </v-card>
</template>
<script>
export default {
  props: {
    card: {
      type: Object,
    },
  },
  data: () => ({
    is_access: false,
  }),
  mounted() {
    this.checkRole();
  },
  methods: {
    checkRole() {
      this.is_access = true;
    },
    sendRoute(path) {
      if (path == "messages") {
        this.$router.push("/message");
      } else {
        this.$router.push(path);
      }
    },
  },
};
</script>

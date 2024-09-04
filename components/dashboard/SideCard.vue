<template>
  <v-card
    width="110"
    height="170"
    class="d-flex flex-column justify-center align-center pa-3 my-2 green-border border-radius-10 elevation-0"
  >
    <v-icon>{{ card.icon }}</v-icon>
    <div class="my-3 text-center">{{ card.title }}</div>
    <span>{{ card.count }}</span>
  </v-card>
</template>
<script>
export default {
  props: {
    card: {
      type: Object,
    },
  },
  data: () => ({}),
};
</script>

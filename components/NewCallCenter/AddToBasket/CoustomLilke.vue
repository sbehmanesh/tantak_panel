<template>
  <v-row class="align-center justify-end ma-2">
    <v-icon
      @click="like"
      :color="like_item || liked ? 'red' : 'grey lighten-1'"
      class="icon-style"
    >
      favorite
    </v-icon>
  </v-row>
</template>

<script>
export default {
  props: {
    item: {
      require: false,
      default: false,
    },
    liked: {
      require: false,
      default: false,
    },
  },
  data: () => ({
    like_item: false,
  }),
  beforeMount() {},
  watch: {
    item: {
      deep: true,
      handler() {
        this.like_item = false;
      },
    },
  },
  methods: {
    like() {
      if (Object.keys(this.item).length > 0) {
        this.like_item = !this.like_item;
      }
      let key = {};
      if (this.item.type == "Package") {
        key["package_id"] = this.item.value;
      }

      this.$reqApi("like/insert", { ...key })
        .then((res) => {})
        .catch((err) => {});
    },
  },
};
</script>

<style scoped>
.icon-style {
}
.icon-style:hover {
  cursor: pointer;
}
</style>

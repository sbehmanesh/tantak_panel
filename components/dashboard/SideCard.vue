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
    <div  class="font-weight-bold font_18" :style="{ color: card.textcolor }">
      {{ card.count }}
    </div>
    <WorkDialog :my-works="card.my_works" :filter-key="card.filter_key" :dialog="show_dialog" v-if="show_dialog" @closeDialog="show_dialog = false" />
  </v-card>
</template>
<script>
import WorkDialog from "@/components/Dashboard/WorkDialog.vue";
export default {
  components: {
    WorkDialog,
  },
  props: {
    card: {
      type: Object,
    },
  },
  data: () => ({
    is_access: false,

    show_dialog: false,
  }),
  mounted() {
    this.checkRole();
  },
  methods: {
    checkRole() {
      this.is_access = true;
    },
    sendRoute(path) {
      if (this.card.multiple) {
        this.show_dialog = true;
      } else {
        if (path == "messages") {
          this.$router.push("/message");
        } else {
          this.$router.push(path);
        }
      }
    },
  },
};
</script>

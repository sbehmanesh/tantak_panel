<template>
  <v-row class="cards-parent mt-4 mx-4">
    <div>
      <v-row>
        <v-col cols="12" md="12" v-for="(item, index) in items" :key="index">
          <v-alert
            text
            prominent
            border="top"
            :icon="item.seen_at == null ? 'notifications' : 'done_all'"
            :color="item.seen_at == null ? '#348ed9' : 'grey darken-2'"
          >
            <h1 class="font_12">
              ثبت شده در تاریخ
              {{
                $toJalali(
                  item.created_at,
                  "YYYY-MM-DDTHH:mm:ss.SSSZ",
                  "jYYYY/jMM/jDD - HH:mm:ss"
                )
              }}
              <small v-if="item.seen_at == null" class="mx-2"> ( جدید )</small>
            </h1>
            <h1 class="pa-2 font_14" v-html="item.text" />
            <v-spacer></v-spacer>
          </v-alert>
        </v-col>
      </v-row>
    </div>
  </v-row>
</template>
<script>
import { icon } from "leaflet";

export default {
  computed: {
    items() {
      return this.$store.state.notification.items;
    },
  },
  methods: {
    borderClass(item) {
      return item.seen_at === null ? "border-green" : "border-orange";
    },
  },
  // beforeDestroy() {

  // },
};
</script>
<style scoped>
.border-green {
  /* border: 1px solid green !important; */
  background-color: #d1e7dd !important;
}
.border-orange {
  border: 1px solid orange !important;
}
.cards-parent {
  display: block;
  padding: 20px;
  margin-bottom: 10%;
}
</style>

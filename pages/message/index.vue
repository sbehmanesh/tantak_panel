<template>
  <v-row class="cards-parent">
    <div>
      <v-row>
        <v-col cols="12" md="12" v-for="(item, index) in items" :key="index">
          <v-card :class="['card-item', borderClass(item)]" width="100vw">
            <v-card-title>
              <span class="font_14"> تاریخ دریافت : </span>
              <v-card-subtitle class="pa-2">
                <span>
                  {{
                    $toJalali(
                      item.created_at,
                      "YYYY-MM-DDTHH:mm:ss.SSSZ",
                      "jYYYY/jMM/jDD - HH:mm:ss"
                    )
                  }}</span
                >
              </v-card-subtitle>
            </v-card-title>

            <v-card-title class="pa-2">
              <span class="font_16 pa-2" v-html="item.text"></span>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-row>
</template>
<script>
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

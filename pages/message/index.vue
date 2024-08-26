<template>
  <v-row class="cards-parent">
    <div v-if="!loading">
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="(item, index) in $store.state.notification.items"
          :key="index"
        >
          <v-card class="card-item border" width="100vw">
            <v-card-title>
              <span class="font_14"> تاریخ ارسال : </span>
              <v-card-subtitle class="pa-2">
                <span>
                  {{
                    $toJalali(
                      item.created_at,
                      "YYYY-MM-DDTHH:mm:ss.SSSZ",
                      "jYYYY/jMM/jDD"
                    )
                  }}</span
                >
              </v-card-subtitle>
            </v-card-title>

            <v-card-title class="pa-2">
              <span class="font_16" v-html="item.text"></span>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-row>
</template>
<script>
export default {};
</script>
<style scoped>
.border {
  border: 1px solid orange !important;
}
.cards-parent {
  display: block;
  padding: 20px;
  margin-bottom: 10%;
}
</style>

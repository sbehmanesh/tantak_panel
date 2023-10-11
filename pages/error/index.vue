<template>
  <v-container class="py-5" fluid>
    <v-row dense class="parent">
      <v-col cols="12" md="12" sm="12">
        <v-card elevation="0" class="py-4">
          <div style="height: 50px"></div>
          <v-card-title class="font_30 error--text"> خطای 404 </v-card-title>
          <v-card-title class="mt-n4"> چیزی که دنبالش هستی انگار گم شده. </v-card-title>

          <div class="d-flex justify-center">
            <amp-button text="صفحه اصلی" @click="$router.push('/panel')" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="12" sm="12" class="d-flex justify-center">
        <img class="" src="/image/bot2.gif" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  data: () => ({
    page_title: 'خطا',
  }),

  mounted() {
    this.$store.dispatch('setPageTitle', this.page_title)
  },
}
</script>
<style scoped>
.parent {
  background-color: #ffffff;
}
</style>

<template>
  <v-row>
    <v-col cols="12" md="12" class="d-flex justify-center" v-if="url">
      <v-card min-width="700" class="elevation-0">
        <ImportExcel :url="url" backurl="/" />

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ImportExcel from "@/components/CallCenter/ImportExcel.vue";
export default {
  components: { ImportExcel },
  data: () => ({
    title: "ورود اکسل",
    url: "",
    is_admin: false,
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.url = "recived-message/import-excel";
  },

};
</script>

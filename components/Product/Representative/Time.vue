<template>
  <v-card class="border-card">
    <v-card-title class="grey lighten-3">
      <v-icon large> arrow_left </v-icon>
      <span class="font_20 ml-2"> تعیین بازه زمانی ارسال </span>
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text class="pa-3">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="2">
          <amp-button
            block
            height="37"
            class="my-1"
            color="green darken-2"
            text="افزودن"
          />
        </v-col>
      </v-row>
      <v-col cols="12" md="12">
        <v-card> 
            
        </v-card>
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      delivery_time: [],
      loading: true,
    };
  },

  mounted() {
    this.timsSend();
  },
  methods: {
    timsSend() {
      this.$reqApi("delivery-time", { row_number: 50000 })
        .then(async (response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push({
              text: element.range_time,
              value: element.id,
            });
          }
          this.delivery_time = items;
          console.log("items", items);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.border-card {
  border: 2px dashed #0000005d;
  border-radius: 5px;
}
</style>

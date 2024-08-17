<template>
  <v-card class="border-card">
    <v-card-title class="grey lighten-3">
      <v-icon large> arrow_left </v-icon>
      <span class="font_20 ml-2"> تعیین بازه زمانی ارسال </span>
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text class="pa-3">
      <v-form v-model="valid">
        <v-col
          cols="12"
          md="12"
          v-for="(item, index) in delivery_form"
          :key="index"
        >
          <v-card class="elevation-0">
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="4">
                <amp-select
                  text="بازه زمانی"
                  rules="require"
                  v-model="item.id"
                  :items="delivery_time"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-select
                  text="روز های ارسال"
                  multiple
                  rules="require"
                  v-model="item.week_days"
                  :items="week_days"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input
                  text="تعداد ارسال در بازه زمانی"
                  cClass="ltr-item"
                  rules="require,number"
                  v-model="item.number_send"
                />
              </v-col>
              <v-col cols="12" md="1" class="text-center mt-8 align-center">
                <v-icon @click="deleteFromCard(item, index)"> delete </v-icon>
              </v-col>
            </v-row>
          </v-card>
          <v-col style="border-bottom: 1px dashed grey" cols="12"></v-col>
        </v-col>
      </v-form>

      <v-row class="ma-2">
        <amp-button
          block
          height="39"
          class="my-1"
          color="green darken-2"
          text="افزودن"
          @click="addTime"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    deliveryTimeIds: {
      require: false,
      default: [],
    },
  },
  data() {
    return {
      delivery_time: [],
      week_days: [
        { text: "شنبه", value: "1" },
        { text: "یکشنبه", value: "2" },
        { text: "دوشنبه", value: "3" },
        { text: "سه شنبه", value: "4" },
        { text: "چهارشنبه", value: "5" },
        { text: "پنج شنبه", value: "6" },
        { text: "جمعه", value: "7" },
      ],
      delivery_form: [
        {
          id: "",
          week_days: [],
          number_send: 1,
        },
      ],
      loading: true,
      valid: true,
    };
  },

  mounted() {
    this.timsSend();
    if (this.deliveryTimeIds.length > 0) {
      let items = [];
      for (let index = 0; index < this.deliveryTimeIds.length; index++) {
        const element = this.deliveryTimeIds[index];
        items.push(
          {
          id: element.id,
          week_days: JSON.parse(element.week_days) ,
          number_send: element.number_send,
        },
        )
      }
      console.log(items);
      this.delivery_form = items;
    }
  },
  watch: {
    valid() {
      if (this.delivery_form.length == 0) {
        this.valid = false;
      }
      if (Boolean(this.valid)) {
        this.$emit("validTime", this.valid);
      }
      this.$emit("deliveryForm", this.delivery_form);
    },
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
    addTime() {
      this.delivery_form.push({
        id: "",
        week_days: [],
        number_send: 1,
      });
    },
    deleteFromCard(item, index) {
      let items = this.delivery_form;
      items.splice(index, 1);
      this.delivery_form = items;
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

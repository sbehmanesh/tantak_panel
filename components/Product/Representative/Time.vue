<template>
  <v-card class="elevation-0 border-card">
    <v-card-title class="py-4">
      <v-col col="12" md="12">
        <amp-section text="بازه زمانی ارسال"></amp-section>
      </v-col>
      <v-row class="d-flex justify-center">
        <v-spacer></v-spacer>
        <amp-button
          height="40"
          icon="add_circle"
          class="my-2 ml-4"
          color="orange darken-2"
          text="افزودن بازه زمانی  "
          @click="addTime"
        />
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-form v-model="valid">
        <v-row>
          <v-col
            cols="12"
            md="4"
            v-for="(item, index) in delivery_form"
            :key="index"
          >
            <v-card class="elevation-3 pa-2 grey lighten-3">
              <v-row class="d-flex justify-start ma-2 alifn-center">
                <v-spacer></v-spacer>
                <v-icon class="" @click="deleteFromCard(item, index)" size="20">
                  delete
                </v-icon>
              </v-row>

              <v-row class="alifn-center">
                <v-col cols="12" md="12">
                  <amp-select
                    text="روز های ارسال"
                    multiple
                    rules="require"
                    v-model="item.week_days"
                    :items="week_days"
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <amp-select
                    text="بازه زمانی"
                    rules="require"
                    v-model="item.id"
                    :items="delivery_time"
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <amp-input
                    text="تعداد ارسال در بازه زمانی"
                    cClass="ltr-item"
                    rules="require,number"
                    v-model="item.number_send"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
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
        { text: "شنبه", value: "0" },
        { text: "یکشنبه", value: "1" },
        { text: "دوشنبه", value: "2" },
        { text: "سه شنبه", value: "3" },
        { text: "چهارشنبه", value: "4" },
        { text: "پنج شنبه", value: "5" },
        { text: "جمعه", value: "6" },
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
      this.setWeekDayes(this.deliveryTimeIds);
    }
  },
  watch: {
    delivery_form: {
      deep: true,
      handler(){
        this.$emit("validTime", this.valid),
        this.$emit("deliveryForm", this.delivery_form);
      }
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
          this.loading = false;
          this.$emit("validTime", this.valid);
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
    setWeekDayes(data) {
      let items = [];
 
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let week = JSON.parse(element.week_days);


        items.push({
          id: element.id,
          week_days: week,
          number_send: element.number_send,
        });
      }
      this.delivery_form = items;
    },
  },
};
</script>
<style scoped>
.border-card {
  border: 2px dashed #2c2c2c44;
  border-radius: 10px;
}
</style>

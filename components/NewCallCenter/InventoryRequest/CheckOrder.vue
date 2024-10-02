<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card style="overflow: hidden">
        <v-card class="text-center mx-5 elevation-0 mt-5">
          <v-row class="align-center justify-center">
            <v-col cols="6">
              <v-card-text
                class="pa-2 text-center elevation-3 card-select"
                @click="ckekStep('complete')"
              >
                <h1 class="font_12">تایید سفارش</h1>
              </v-card-text>
            </v-col>
            <v-col cols="6">
              <v-card-text
                class="pa-2 text-center elevation-3 card-select"
                @click="ckekStep('defect')"
              >
                <h1 class="font_12">نقص سفارش سفارش</h1>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
        <v-window v-model="step">
          <v-window-item :value="1"> </v-window-item>

          <v-window-item :value="2">
            <SlectedListVar
              v-if="dialog"
              :basketId="basketId"
              @submit="InsertItem"
              @data="getData($event)"
              ref="selectVar"
            />
          </v-window-item>
        </v-window>

        <v-card-actions>
          <v-row class="d-flex justify-center pa-3">
            <amp-button
              text="انصراف"
              @click="closeDialog"
              color="red"
              class="ma-2"
            />
            <amp-button
              text="تایید"
              @click="submit"
              color="success darken-1"
              class="ma-2"
            />
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import SlectedListVar from "@/components/NewCallCenter/InventoryRequest/SlectedListVar.vue";
export default {
  components: { SlectedListVar },
  props: {
    dialog: {
      require: false,
      default: false,
    },

    basketId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      card_title: "",
      done: true,
      step: 1,
      defect: false,
      products: [],
      infos: {},
      form: {
        id: "",
        type: "",
      },
    };
  },
  computed: {
    loading() {
      let show = true;
      if (Object.keys(this.infos).length > 0) {
        show = false;
      } else {
        show = false;
      }
      return show;
    },
  },
  methods: {
    ckekStep(type) {
      console.log("y--> " , type);

      switch (type) {
        case "complete":
          this.step--;
          break;
        case "defect":
          this.step++;
          break;
      }
    },
    getItems() {
      this.$refs.selectVar.callSubmit();
    },
    InsertItem() {
      this.$emit("reload");
      this.$emit("closeDialog");
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    submit() {
      let form = { ...this.form };
      this.$reqApi("product-request/deliver-order")
        .then((res) => {
          console.log("response", res);
          console.log("response", res);
          console.log("response", res);
        })
        .catch((rej) => {});
    },
    getData(event) {
      this.infos = event;
      console.log("event>>", event);
    },
  },
};
</script>
<style scoped>
.card-select {
  border-radius: 5px !important;
  background-color: #ffffff !important;
  cursor: pointer;
}
.card-select:hover {
  background-color: #eeeaea !important;
}
</style>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="550">
      <v-card style="overflow: hidden" class="grey lighten-3">
        <v-card-title>
          برسی سفارش
          <v-spacer></v-spacer>
          <v-btn icon text @click="closeDialog">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card class="pa-5 grey lighten-3" :disabled="loading">
          <v-col cols="12">
            <v-card-text
              class="pa-2 text-center elevation-3 card-select"
              @click="ckekStep('complete')"
            >
              <h1 class="font_12">تایید سفارش</h1>
            </v-card-text>
          </v-col>
          <v-col cols="12">
            <v-card-text
              class="pa-2 text-center elevation-3 card-select"
              @click="ckekStep('defect')"
            >
              <h1 class="font_12">نقص سفارش سفارش</h1>
            </v-card-text>
          </v-col>
          <ShowListVar
            v-if="form.type == 'defect'"
            :basketId="basketId"
            @defectivBasket="doneDefectiv()"
          />
        </v-card>

        <!-- <v-card-actions>
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
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import ShowListVar from "@/components/NewCallCenter/InventoryRequest/ShowListVar.vue";
export default {
  components: { ShowListVar },
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
      product_varcom_ids: [],
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
      this.form.type = type;
      switch (type) {
        case "complete":
          this.submit(type);
          break;
        case "defect":
          break;
      }
    },
    getList(event) {
      console.log("defectivOrder", event);
      this.product_varcom_ids = event;
    },

    closeDialog() {
      this.$emit("closeDialog");
    },
    submit(type) {
      this.loading = true;
      let form = { ...this.form };
      if (form.type == "defect") {
        form["product_varcom_ids"] = this.product_varcom_ids;
      }

      form.id = this.basketId;
      this.$reqApi("product-request/deliver-order", form)
        .then((res) => {
          if (form.type == "complete") {
            this.$toast.success("سفارش با موفقیت تایید شد");
          } else {
            this.$toast.success("نقص سفارش با موفقیت انجام شد");
          }
          this.closeDialog();
          this.loading = false;
          this.$emit("reload");
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
    doneDefectiv() {
      this.closeDialog();
      this.$emit("reload");
    },
    getData(event) {
      this.infos = event;
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

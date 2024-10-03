<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card style="overflow: hidden">
        <v-alert prominent icon="text_snippet" class="grey lighten-2" >
          <strong class="font_18">برسی سفارش</strong>
          <br />
          <strong class="font_12"> شماره فاکتور ‌: {{ data.order_number }} </strong>
          <br />
          <strong class="font_12"> کد نمایندگی ‌: {{ data.agency_code }} </strong>
          <br />

          <strong class="font_12">
            مجموع قیمت ‌: {{ $price(data.total_price) }} ریال
          </strong>
          <br />
        </v-alert>
      
        <v-card class="pa-5" :disabled="loading">
          <v-row class="d-flex justify-center">
            <v-col cols="6" md="4">
              <v-card-text
                class="pa-2 text-center elevation-3 card-select"
                @click="ckekStep('complete')"
              >
                <span class="font_12">تایید سفارش</span>
              </v-card-text>
            </v-col>
            <v-col cols="6" md="4">
              <v-card-text
                class="pa-2 text-center elevation-3 card-select"
                @click="ckekStep('defect')"
              >
                <span class="font_12">نقص سفارش سفارش</span>
              </v-card-text>
            </v-col>
            <v-col cols="6" md="4">
              <v-card-text
                class="pa-2 text-center elevation-3 close-dialog"
                @click="closeDialog"
              >
                <span class="font_12"> انصراف</span>
              </v-card-text>
            </v-col>
          </v-row>

          <ShowListVar
            class="mt-4"
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
    data: {
      require: false,
      default: false,
    },
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
  background-color: #919191 !important;
  color: #ffffff;
  cursor: pointer;
}
.close-dialog {
  border-radius: 5px !important;
  background-color: #fd3838e5 !important;
  color: #ffffff;
  cursor: pointer;
}
.card-select:hover {
  background-color: #c0c0c0 !important;
  color: #000000;
}
</style>

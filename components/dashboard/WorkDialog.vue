<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card
        class="card-style pa-5 align-center d-flex"
        style="overflow: hidden !important"
        fullscreen
      >
        <v-row class="align-center justify-center mx-10">
          <v-col cols="12" md="4">
            <v-card
              @click="sendRoute('debt')"
              class="pa-2 text-center elevation-2 card-style2 align-center d-flex"
              outlined
            >
              <div class="phone-calss pa-3 align-center phone-calss-hover mr-2">
                <v-icon color="white" size="30" class=""> description </v-icon>
              </div>
              <h1 class="mr-2 font_16">بدهکاری ها</h1>
              <v-spacer></v-spacer>

              <v-chip small>
                {{ myWorks.debt.count }}
              </v-chip>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card
              @click="sendRoute('product_request')"
              class="pa-2 text-center elevation-2 card-style2 align-center d-flex"
              outlined
            >
              <div class="phone-calss pa-3 align-center phone-calss-hover mr-2">
                <v-icon color="white" size="30" class="">
                  add_shopping_cart
                </v-icon>
              </div>
              <h1 class="mr-2 font_16">درخواست موجودی</h1>
              <v-spacer></v-spacer>

              <v-chip small>
                {{ myWorks.product_request.count }}
              </v-chip>
            </v-card>
          </v-col>

          <v-row class="d-flex justify-center">
            <v-col cols="12" md="4">
              <amp-button
                text="انصراف"
                height="38"
                block
                color="red darken-2"
                @click="closeDialog"
                class="ma-1"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },
    myWorks: {
      default: {},
      type: Object,
    },
    filterKey: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      data: "",
    };
  },
  methods: {
    sendRoute(key) {
      if (key == "product_request") {
        this.$router.push(
          `/new-call-center/inventory-request?filter=${this.filterKey}`
        );
      } else {
        this.$router.push(`/indebtedness?filter=${this.filterKey}`);
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.card-style {
  background-color: #1a18188f !important;
}
.card-style2 {
  background-color: #ffffff !important;
  border-radius: 10px !important;
}
.card-style2 :hover {
  background-color: #dadadac2 !important;
  border-radius: 10px !important;
  cursor: pointer !important;
}
.phone-calss {
  background: linear-gradient(to top, #4582c7a2, #2e68d4ad, #03405c) !important;
  border-radius: 10px !important;
}
.calss-cancel {
  background: linear-gradient(to top, #c74545a2, #d42e2ead, #5c0303) !important;
  border-radius: 10px !important;
}
</style>

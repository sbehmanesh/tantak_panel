<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="650">
      <v-card class="pa-2">
        <v-card v-if="!loading" class="pa-5 card-style">


          <v-row
            class="justif-center"
  
          >
            <v-col cols="12" class="text-center d-flex align-center">
              <div class="d-flex align-center">
                <v-img
                  class="ma-1"
                  width="160"
                  height="100"
                  contain
                  :src="$getImage(combination.variation1.product.main_image)"
                />
                <div class="text-end">
                  <h1 class="font_17">
                    {{ combination.variation1.product.name }}
                  </h1>
                  <h1>
                    <small v-if="Boolean(combination.variation1.colors)">
                      {{ combination.variation1.variation_type.value }}
                      {{ combination.variation1.colors }}
                    </small>
                    <small v-else>
                      {{ combination.variation1.variation_type.value }}
                      {{ combination.variation1.value }}
                    </small>
                    <br />
                    <small>
                      {{ combination.variation2.variation_type.value }}
                      {{ combination.variation2.value }}
                    </small>
                    <br /><small>
                      {{ combination.variation3.variation_type.value }}
                      {{ combination.variation3.value }}
                    </small>
                    <br />
                  </h1>
                </div>
              </div>
              <v-spacer></v-spacer>
              <div>
                <Qrcode width="90" :barcode="combination.full_barcode" />
                <h1>
                  <small>
                    {{ combination.full_barcode }}
                  </small>
                </h1>
              </div>
            </v-col>

            <v-col cols="12" class="d-flex ma-0 pa-0">
              <v-img
              v-if="
              Boolean(combination.variation1.product_images) &&
              combination.variation1.product_images.length > 0
            "
                v-for="(item, index) in combination.variation1.product_images"
                :key="index"
                class="ma-1"
                width="100"
                height="89"
                contain
                :src="$getImage(item.path)"
              />
            </v-col>
          </v-row>
          <v-col cols="12">
            <v-divider v-for="i in 2" :key="i"></v-divider>
          </v-col>
          <v-row class="justify-center mt-3">
            <v-col cols="12" md="3">
              <amp-button
                text="بستن"
                height="38"
                block
                color="red darken-2"
                @click="closeDialog"
                class="ma-1"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card v-if="loading" class="pa-10 text-center">
          <v-progress-circular
            :size="30"
            :width="4"
            indeterminate
            color="grey"
          />
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import Qrcode from "@/components/Qrcode/Qrcode.vue";
export default {
  components: {
    Qrcode,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    productId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: true,
      combination: [],
    };
  },
  mounted() {
    if (Boolean(this.productId)) {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      this.$reqApi("product-variation-combination/show", { id: this.productId })
        .then((res) => {
          this.combination = res.model;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.card-style {
  border: 8px double #00000071 !important;
}
</style>

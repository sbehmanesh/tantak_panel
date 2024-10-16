<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="730">
      <v-card class="py-4 px-8" v-if="!loading">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon size="26"> cancel </v-icon>
          </v-btn>
        </v-card-title>
        <v-card class="elevation-0 card-style pa-5" v-if="!loading">
          <v-col cols="12">
            <v-row class="align-top">
              <v-col cols="8" class="alifn-center">
                <strong> نام محصول :‌ {{ product.name }} </strong>
                <v-row class="mt-2 mx-2">
                  <h1>قیمت فروش ‌: {{ $price(product.base_price) }} ریال</h1>
                  <v-spacer></v-spacer>
                  <h1>قیمت خرید ‌: {{ $price(product.base_price) }} ریال</h1>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="1" style="border-left: 1px solid #30303094"></v-col>
              <v-col cols="2" class="text-center">
                <Qrcode width="70" :barcode="product.barcode" />
                <div class="mt-2">
                  <small>
                    {{ product.barcode }}
                  </small>
                </div>
              </v-col>
            </v-row>
            <v-col cols="12" class="b-butoom"> </v-col>
            <v-col cols="12">
              <v-row v-if="images.length > 0" class="justify-center">
                <div
                  v-if="images.length > 0"
                  v-for="(img, index) in images"
                  :key="index"
                >
                  <v-img
                  class="ma-1"
                    width="180"
                    height="100"
                    contain
                    :src="$getImage(img.path)"
                  />
                </div>
              </v-row>
              <v-alert text class="text-center" v-if="images.length < 1">
                <v-icon size="45">hide_image</v-icon>
                <h1 class="font_14">برای این محصول گالری تنظیم نشده</h1>
              </v-alert>
            </v-col>
            <v-col cols="12" class="b-butoom ma-0 pa-0"> </v-col>
            <v-col cols="12" class="text-center">
              <v-card
                class="align-center d-flex mb-2 pa-2 elevation-0"
                v-for="(item, index) in variations"
                :key="index"
              >
                <v-spacer></v-spacer>
                <strong>{{ item.var1.value }} {{ item.var2.value }}</strong>
                <v-spacer></v-spacer>
                <v-col cols="5" class="text-center">
                  <strong v-if="item.price"
                    >{{ $price(item.price) }} ریال</strong
                  >
                </v-col>
                <v-spacer></v-spacer>
                <small>
                  {{ item.full_barcode }}
                </small>
                <v-spacer></v-spacer>

                <Qrcode width="60" :barcode="item.full_barcode" />
              </v-card>
            </v-col>
          </v-col>
        </v-card>
      </v-card>
      <v-card v-if="loading" class="elevation-0 mx-1 mb-2 pa-8">
        <v-row >
          <v-col cols="12" v-for="i in 2">
            <v-skeleton-loader
              class="mx-auto"
              height="100"
              type="card"
            ></v-skeleton-loader>

          </v-col> 
             <v-col cols="12" >
            <v-skeleton-loader
            v-for="i in 4"
              height="30"
              type="text@2"
            ></v-skeleton-loader>

          </v-col>
        </v-row>
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
      default: false,
      type: Boolean,
    },
    productId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      now: "",
      variations: [],
      images: [],
      product: {},
      loading: true,
    };
  },
  mounted() {
    if (Boolean(this.productId)) {
      this.loadCatalogs();
    }
  },
  methods: {
    loadCatalogs() {
      this.$reqApi("product-variation-combination/catalog", {
        product_id: this.productId,
      })
        .then((res) => {
          this.variations = res.model.data;
          if (res.model.data.length > 0) {
            this.product = res.model.data[0].product;
            this.images = res.model.data[0].var1.product_images;
          }

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
  border: 5px double #30303081 !important;
}
.b-butoom {
  border-bottom: 2px solid #30303094 !important;
}
strong {
  font-size: 14px;
}
h1 {
  font-size: 12px;
}
</style>

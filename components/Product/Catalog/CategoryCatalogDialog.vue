<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="730">
      <v-card class="elevation-0 pa-5" style="overflow: hidden !important">
        <div
          class="elevation-0 card-style text-center mb-5 pa-3"
          v-if="!loading"
        >
          <v-row>
            <v-col cos="1"></v-col>
            <v-col cos="10" class="text-center">
              <strong
                cols="12"
                v-for="(category, index) in catgorysName"
                :key="index"
                class="ml-1"
              >
                {{ category.text }}
              </strong>
              <br />

              <h1>
                تاریخ تولید کاتالوگ :‌
                {{ $toJalali(createdAt, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
              </h1>
            </v-col>
            <v-col cosl="1" class="text-start">
              <v-btn icon text @click="cloasDialog">
                <v-icon>close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div class="elevation-0 text-center mb-5 pa-3" v-else>
          <v-skeleton-loader
            class="mx-auto"
            height="70"
            type="card"
          ></v-skeleton-loader>
        </div>

        <v-card>
          <v-row class="d-flex justify-center">
            <v-card
              v-if="!loading"
              class="card-style mx-1 mb-2 pa-2 elevation-0"
              :width="products.length == 1 ? '97%' : '48%'"
              v-for="(item, index) in products"
              :key="index"
            >
              <v-img
                width="130"
                height="130"
                class="d-flex mx-auto"
                contain
                :src="$getImage(item.main_image)"
              />
              <v-col
                cols="12"
                style="border-bottom: 1px solid #303030a2"
                class="mb-1"
              ></v-col>
              <v-col cols="12">
                <v-row class="align-center pt-2">
                  <div>
                    <h1>نام :‌ {{ item.name }}</h1>
                    <h1>قیمت جزیی :‌ {{ $price(item.base_price) }} ریال</h1>
                    <h1>
                      قیمت عمده :‌ {{ $price(item.base_wholesale_price) }} ریال
                    </h1>
                  </div>
                  <v-spacer></v-spacer>
                  <Qrcode :barcode="item.barcode" width="65" />
                </v-row>
              </v-col>
            </v-card>
            <v-card v-if="!loading && products.length == 0" class="text-center pa-10 elevation-0" >
          <strong class="font_18">
            برای این محصول دسته بندی تعریف نشده
          </strong>  
            </v-card>
            <v-card
              v-if="loading"
              class="elevation-0 mx-1 mb-2 pa-2"
              width="48%"
              v-for="i in 4"
              :key="`skeleton-${i}`"
            >
              <v-skeleton-loader
                class="mx-auto"
                height="150"
                type="card"
              ></v-skeleton-loader>
            </v-card>
          </v-row>
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
      default: false,
      type: Boolean,
    },
    catgoryId: {
      default: "",
      type: String,
    },
    createdAt: {
      default: "",
      type: String,
    },
    catgorysName: {
      default: [],
      type: Array,
    },
  },
  data() {
    return {
      now: "",
      products: [],
      loading: true,
    };
  },
  mounted() {
    if (Boolean(this.catgoryId)) {
      this.loadCatalogs();
    }
  },
  methods: {
    loadCatalogs() {
      this.$reqApi("product/catalog-category", { category_id: this.catgoryId })
        .then((res) => {
          this.products = res.model.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    cloasDialog() {
      this.$emit("cloasDialog");
    },
  },
};
</script>
<style scoped>
.card-style {
  border: 1px solid #30303081 !important;
}
strong {
  font-size: 18px;
}
h1 {
  font-size: 12px;
}
</style>

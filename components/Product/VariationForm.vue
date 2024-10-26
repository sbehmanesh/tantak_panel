<template>
  <v-card class="pa-1 ma-0 elevation-0">
    <v-expansion-panels variant="popout" class="my-4 elevation-0 style-class">
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="webhook">
          ویژگی ها
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-col cols="12">
            <v-divider v-for="i in 4" :key="i"></v-divider>
          </v-col>

          <v-row class="">
            <v-chip
              dark
              label
              class="ma-2 mr-7 mt-4"
              color="red"
              v-for="item in items"
              :key="item.key"
              @click="tab = item.key"
              :outlined="tab != item.key"
            >
              <strong>
                {{ item.text }}
                <v-icon small class="mr-1">
                  {{ item.icon }}
                </v-icon>
              </strong>
            </v-chip>
          </v-row>
          <v-row>
            <template v-if="showAddVairiation">
              <v-col cols="12" md="3">
                <amp-select
                  text="ویژگی"
                  :items="allVariations"
                  title="Property"
                  v-model="form.variation_type_id"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-autocomplete
                  rules="require"
                  text="دسته بندی"
                  v-model="form.category_id"
                  :items="product_categories"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-autocomplete
                  :disabled="form.category_id.length < 0"
                  rules="require"
                  text="محصولات"
                  v-model="form.product_id"
                  :items="products"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input text="مقدار" v-model="form.value" />
              </v-col>
              <v-col cols="3">
                <amp-input
                  text="بارکد"
                  is-number
                  v-model="form.barcode"
                  rules="max_4"
                />
              </v-col>
              <v-col cols="2">
                <amp-input text="ترتیب " v-model="form.sort" rules="number" />
              </v-col>
              <v-col cols="12" md="3">
                <amp-upload-file v-model="images" :multiple="true" />
              </v-col>
              <v-col cols="12" md="12" class="text-center mt-8">
                <amp-button
                  small
                  text="افزودن"
                  color="success"
                  :loading="loading"
                  @click="add()"
                >
                </amp-button>
              </v-col>
            </template>
            <v-col cols="12" md="12">
              <v-dialog width="1000" v-model="gallery_diaolog.show">
                <v-card v-if="gallery_diaolog.show" class="pa-5" fullscreen>
                  <div>
                    <VariationGallery
                      @SeGallry="submitGallry"
                      :index="gallery_diaolog.item.index"
                      :items="gallery_diaolog.item.items"
                    />
                  </div>
                  <div class="text-center mt-4">
                    <v-divider />
                    <amp-button
                      large
                      text="بستن"
                      icon="close"
                      class="mt-4"
                      color="error"
                      @click="GalleryDialog()"
                    />
                    <!-- <amp-button
                      large
                      text="ثبت"
                      icon="close"
                      class="mt-4"
                      color="success"
                      @click="submitGallry()"
                    /> -->
                  </div>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>

          <div v-for="(v, index) in variations" :key="'v' + index">
            <v-card class="d-flex align-center style-card my-3 elevation-3">
              <v-btn icon class="grey lighten-3 white--black mr-2" small>
                <h1>{{ index + 1 }}</h1>
              </v-btn>

              <v-col
                cols="12"
                md="2"
                class="text-center"
                v-if="
                  v.variation_type &&
                  v.variation_type.value_2 == 'product_colors'
                "
                v-for="i in 3"
                :key="i"
              >
                <amp-autocomplete
                  v-model="v.value[i]"
                  :items="colors"
                  :text="`${v.variation_type.value} ${i}`"
                  :rules="i == 1 ? 'require' : ''"
                />
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="text-center"
                v-if="
                  v.variation_type &&
                  v.variation_type.value_2 != 'product_colors'
                "
              >
                <amp-input v-model="v.value" :text="v.variation_type.value" />
              </v-col>

              <v-col cols="12" md="1" class="text-center"
                ><amp-input v-model="v.sort" text="ترتیب" rules="number" />
              </v-col>
              <v-col
                cols
                v-if="v.codes && v.codes.length > 0"
                class="text-center"
              >
                <v-progress-circular
                  v-if="v.codes[0]"
                  value="33"
                  :rotate="360"
                  class="pa-2"
                  :size="35"
                  :width="18"
                  :color="v.codes[0]"
                >
                  <v-progress-circular
                    v-if="v.codes[1]"
                    value="33"
                    :rotate="240"
                    :size="35"
                    :width="18"
                    :color="v.codes[2]"
                  >
                    <v-progress-circular
                      v-if="v.codes[3]"
                      value="33"
                      :rotate="120"
                      :size="35"
                      :width="18"
                      :color="v.codes[3]"
                    >
                    </v-progress-circular>
                  </v-progress-circular>
                </v-progress-circular>
              </v-col>
              <v-col
                cols="12"
                md="2"
                class="d-flex justify-center"
                v-if="
                  v.variation_type &&
                  v.variation_type.value_2 == 'product_colors'
                "
              >
                <v-btn color="primary" @click="GalleryDialog(true, v, index)">
                  <v-icon>image</v-icon>
                </v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" md="3" class="text-center">
                <amp-button
                  small
                  text="بروز رسانی"
                  color="success"
                  :loading="loading"
                  @click="update(index)"
                >
                </amp-button>
                <amp-button
                  small
                  text="حذف"
                  color="error"
                  :loading="loading"
                  @click="deleteDialog(true, index)"
                >
                </amp-button>
              </v-col>
            </v-card>
          </div>
          <v-col cols="12" class="mt-3"></v-col>

          <v-dialog
            v-model="deleteDiaolog"
            :width="$vuetify.breakpoint.mdAndUp ? 380 : 470"
          >
            <v-card class="pa-5">
              <span class="mb-2 font_xxxl font_bold"
                >ویژگی انتخابی حذف شود؟</span
              >
              <v-row class="pa-3">
                <v-col cols="6">
                  <amp-button
                    text="بله، حذف شود"
                    class="w-max"
                    color="error"
                    @click="deleteItem()"
                    :disabled="loading"
                  />
                </v-col>
                <v-col cols="6">
                  <amp-button
                    text="منصرف شدم"
                    color="accent"
                    class="w-max"
                    @click="deleteDialog(false)"
                    :disabled="loading"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import VariationGallery from "@/components/Product/VariationGallery.vue";
export default {
  components: { VariationGallery },
  props: {
    product_id: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    variations: [],
    allVariations: [],
    selected_item: "",
    deleteDiaolog: false,
    showAddVairiation: false,
    gallery_diaolog: { items: null, show: false },
    product_categories: [],
    products: [],
    images: [],
    total_variations: [],
    colors_ids: [],

    colors: [],
    form: {
      id: "",
      sort: 1,
      value: "",
      variation_type_id: "",
      product_id: "",
      category_id: "",
      value: "",
      barcode: "",
      images: [],
      code: "",
    },
    tab: "all",
    items: [
      { text: "  همه ویژگی ها", key: "all", icon: "format_list_bulleted" },
      { text: " رنگ ", key: "color", icon: "palette" },
      { text: "سایز", key: "size", icon: "straighten" },
      { text: "کیفیت", key: "quality", icon: "stars" },
    ],
  }),

  mounted() {
    console.log("c");
    console.log("c");
    this.loadData();
    this.getCategories();
    this.getProducts();
    this.getColors();
  },
  watch: {
    "form.category_id"() {
      if (this.form.category_id) {
        this.getProducts(this.form.category_id);
      }
    },
    images() {
      if (this.images) {
        this.images.map((x) => {
          this.form.images.push({
            alt: "image",
            path: x,
          });
        });
      }
    },
    tab() {
      let data = JSON.parse(JSON.stringify(this.total_variations));
      let items = [];
      if (this.tab == "color") {
        items = data.filter(
          (f) => f.variation_type.value_2 == "product_colors"
        );
      }
      if (this.tab == "size") {
        items = data.filter((f) => f.variation_type.value_2 == "size");
      }
      if (this.tab == "quality") {
        items = data.filter((f) => f.variation_type.value_2 == "quality");
      }
      if (this.tab == "all") {
        items = data;
      }
      this.variations = items;
    },
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$reqApi("/product-variation", {
        filters: { product_id: this.$route.params.id },
      })
        .then((response) => {
          this.variations = [];
          console.log("response.model.data", response.model.data);

          let data = response.model.data;
          let items = [];
          let color_ids = [];
          let color_codes = [];

          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            if (x.variation_type.value_2 == "product_colors") {
              if (x.value.startsWith("[")) {
                console.log("x", x);
                color_ids = JSON.parse(x.value);

                if (Boolean(x.codes)) {
                  color_codes = x.codes;
                  console.log("");
                }
                console.log("sSS", x);

                items.push({
                  id: x.id,
                  value: color_ids,
                  variation_type: x.variation_type,
                  product_id: x.product_id,
                  sort: x.sort,
                  code: x.code,
                  variation_type_id: x.variation_type_id,
                  images: x.product_images,
                  codes: color_codes,
                });
              }
              // else {
              //   console.log("ssssss");
              // }
            } else {
              items.push({
                id: x.id,
                value: x.value,
                variation_type: x.variation_type,
                product_id: x.product_id,
                sort: x.sort,
                code: x.code,
                variation_type_id: x.variation_type_id,
                images: x.product_images,
              });
            }
          }
          console.log(" >>> ", items);

          this.variations = items;
          this.total_variations = items;

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    close() {
      this.$emit("closeVariationForm");
    },
    update(index, images) {
      this.loading = true;
      let form = this.variations[index];
      form.images = images;
      if (!form.value || !form.variation_type) {
        this.$toast.error("لطفا ورودی ها را کنترل کنید");
        this.loading = false;
        return;
      }
      if (form.sort) {
        form.sort = parseInt(form.sort);
      }

      this.$reqApi("/product-variation/update", form)
        .then((response) => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getCategories() {
      let form = {
        row_number: 2000,
      };

      this.$reqApi("/category", form)
        .then((response) => {
          this.product_categories = response.model.data
            .filter((x) => !x.parent_category_id && this.modelId != x.id)
            .map((x) => ({
              value: x.id,
              text: x.name,
            }));

          this.product_categories.push({
            value: "",
            text: "بدون والد",
          });

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getProducts(id) {
      let form = {
        row_number: 2000,
        filters: {
          categories_id: id,
        },
      };

      this.$reqApi("/product", form)
        .then((response) => {
          this.products = response.model.data.map((x) => ({
            value: x.id,
            text: x.name,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    deleteDialog(flag, index) {
      this.deleteDiaolog = flag;
      this.selected_item = index;
    },
    deleteItem() {
      this.loading = true;
      let selected_id = this.variations[this.selected_item].id;
      this.$reqApi("/product-variation/delete", { id: selected_id })
        .then((response) => {
          this.$toast.success("ویژگی مد نظر با موفقیت حذف شد.");
          this.loadData();
          this.deleteDiaolog = false;

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    toggleshowAddVairiation() {
      this.showAddVairiation = !this.showAddVairiation;
    },
    add() {
      this.loading = true;
      this.form["product_id"] = this.product_id;
      let form = this.$copyForm(this.form);
      this.$reqApi("/product-variation/insert", form)
        .then((response) => {
          this.$toast.success("ویژگی مد نظر با موفقیت حذف شد");
          this.loadData();
          this.deleteDiaolog = false;
          this.form = {
            id: "",
            sort: "",
            value: "",
            variation_type_id: "",
            product_id: "",
            code: "",
          };
          this.showAddVairiation = false;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    GalleryDialog(open, value, index) {
      if (open) {
        this.gallery_diaolog.show = true;
        this.gallery_diaolog.item = {
          index: index,
          items: value.images,
        };
      } else {
        this.gallery_diaolog.show = false;
        this.gallery_diaolog.item = null;
      }
    },
    submitGallry(event) {
      if (event) {
        this.update(event[1], event[0]);
      }
    },
    getColors() {
      let filter = {
        op: "=",
        key: "product_colors",
      };
      this.$reqApi("/setting", { filters: filter, row_number: 30000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.value,
              value: x.id,
              value_2: x.value_2,
            });
          }
          this.colors = items;
        })
        .catch((err) => {});
    },
  },
};
</script>
<style>
.senced_dialog {
  position: relative;
  z-index: 300;
}
.style-class {
  border: 4px double #0000005d;
  border-radius: 10px !important;
}
.style-card {
  border-radius: 5px !important;
  border-right: 5px solid #ee7e1c6c !important;
  background-color: #fdfdfdd8 !important;
}
</style>

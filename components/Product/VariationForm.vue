<template>
  <v-card class="pa-1 ma-0 elevation-0">
    <v-expansion-panels variant="popout" class="my-4">
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="webhook">
          ویژگی ها
        </v-expansion-panel-header>
        <v-expansion-panel-content>
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
                      :items='gallery_diaolog.item.items'
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

          <v-row>
            <v-col cols="12">
              <amp-title
                class="d-flex align-center"
                text="ویژگی های محصول"
              ></amp-title>
            </v-col>
          </v-row>

          <v-row class="pa-2 mt-1">
            <v-col cols="12" md="3" class="text-center"> ویژگی </v-col>
            <v-col cols="12" md="3" class="text-center"> مقدار </v-col>
            <!-- <v-col cols="12" md="2" class="text-center"> بارکد </v-col> -->
            <v-col cols="12" md="1" class="text-center"> ترتیب </v-col>
            <v-col cols="12" md="2" class="text-center"> گالری</v-col>
            <v-col cols="12" md="3" class="text-center"> عملیات </v-col>
          </v-row>
          <v-row
            v-for="(v, index) in variations"
            :key="'v' + index"
            :class="index % 2 == 0 ? 'odd-row' : ''"
          >
            <v-col cols="12" md="3" class="text-center">
              {{ v.variation_type.value }}
            </v-col>
            <v-col cols="12" md="3" class="text-center"
              ><amp-input v-model="v.value" />
            </v-col>
            <!-- <v-col cols="12" md="2" class="text-center"
        ><amp-input v-model="v.barcode"
      /></v-col> -->
            <v-col cols="12" md="1" class="text-center"
              ><amp-input v-model="v.sort" rules="number" />
            </v-col>
            <v-col cols="12" md="2" class="d-flex justify-center">
              <v-btn color="primary" @click="GalleryDialog(true, v, index)">
                <v-icon>image</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" class="text-center">
              <amp-button
                small
                text="به روز رسانی"
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
          </v-row>

          <v-dialog
            v-model="deleteDiaolog"
            :width="$vuetify.breakpoint.mdAndUp ? 380 : 470"
          >
            <v-card class="pa-5">
              <span class="mb-2 font_xxxl font_bold">ویژگی انتخابی حذف شود؟</span>
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
    product_id: { default: null }
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
      code: ""
    }
  }),

  mounted() {
    this.getCategories();
    this.getAllVariations();
    this.getProducts();
  },
  watch: {
    "form.category_id"() {
      if (this.form.category_id) {
        this.getProducts(this.form.category_id);
      }
    },
    images() {
      if (this.images) {
        this.images.map(x => {
          this.form.images.push({
            alt: "image",
            path: x
          });
        });
      }
    }
  },
  watch: {
    product_id(){
      if(this.product_id){
        this.loadData()
      }
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$reqApi("/product-variation", {
        filters: { product_id: this.product_id }
      })
        .then(async response => {
          this.variations = [];
          response = response.model.data;
          for (let i = 0; response.length; i++) {
            this.variations.push({
              id: response[i].id,
              value: response[i].value,
              variation_type: response[i].variation_type,
              product_id: response[i].product_id,
              sort: response[i].sort,
              code: response[i].code,
              variation_type_id: response[i].variation_type_id,
              images: response[i].product_images
            });
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    close() {
      this.$emit("closeVariationForm");
    },
    update(index, images) {
      this.loading = true;
      let form = this.variations[index];
      form.images = images
      if (!form.value || !form.variation_type) {
        this.$toast.error("لطفا ورودی ها را کنترل کنید");
        this.loading = false;
        return;
      }
      if (form.sort) {
        form.sort = parseInt(form.sort);
      }

      this.$reqApi("/product-variation/update", form)
        .then(response => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getCategories() {
      let form = {
        row_number: 2000
      };

      this.$reqApi("/category", form)
        .then(response => {
          this.product_categories = response.model.data
            .filter(x => !x.parent_category_id && this.modelId != x.id)
            .map(x => ({
              value: x.id,
              text: x.name
            }));

          this.product_categories.push({
            value: "",
            text: "بدون والد"
          });

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getProducts(id) {
      let form = {
        row_number: 2000,
        filters: {
          categories_id: id
        }
      };

      this.$reqApi("/product", form)
        .then(response => {
          this.products = response.model.data.map(x => ({
            value: x.id,
            text: x.name
          }));

          this.loading = false;
        })
        .catch(error => {
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
        .then(response => {
          this.$toast.success("ویژگی مد نظر با موفقیت حذف شد.");
          this.loadData();
          this.deleteDiaolog = false;

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getAllVariations() {
      this.loading = true;
      let form = {
        row_number: 1000,
        filters: { key: "variation_type" }
      };

      this.$reqApi("/setting", form)
        .then(response => {
          this.allVariations = response.model.data.map(x => ({
            value: x.id,
            text: x.value
          }));
          this.loading = false;
        })
        .catch(error => {
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
        .then(response => {
          this.$toast.success("ویژگی مد نظر با موفقیت جذف شد");
          this.loadData();
          this.deleteDiaolog = false;
          this.form = {
            id: "",
            sort: "",
            value: "",
            variation_type_id: "",
            product_id: "",
            code: ""
          };
          this.showAddVairiation = false;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    GalleryDialog(open, value, index) {
      if (open) {
        this.gallery_diaolog.show = true;
        this.gallery_diaolog.item = {
          index : index,
          items : value.images
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
    }
  }
};
</script>
<style>
.senced_dialog {
  position: relative;
  z-index: 300;
}
</style>

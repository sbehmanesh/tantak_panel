<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12" md="9">
        <CombinationForm
          :product_id="product.id"
          @closeAddCombination="closeAddCombination()"
          @reloadCombinations="getCombinations"
          @reloadVaritoinsForm="reloadVriations()"
          :dataItems="product.category_ids"
          ref="combinationForm"
        />
      </v-col>
      <v-col cols="12" md="9">
        <VariationForm
          :product_id="product.id"
          @closeVariationForm="closeVariationForm()"
          ref="variationsFormSingleSeal"
          :dataItems="product.category_ids"
        />
      </v-col>
    </v-row>

    <v-col cols="12" class="ma-0 pa-0 mt-8">
      <v-card outlined class="elevation-0">
        <v-card-title class="d-flex primary lighten-4 pa-0 ma-0">
          <v-col cols="12" md="2" class="text-center">
            <h1>ترکیب</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>قیمت به تومان</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>بارکد</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>بارکد کامل</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>تخفیف</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>حداقل</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>حداکثر</h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>
              نقطه سفارش
              <br />
              در نمایندگی
            </h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>
              نقطه سفارش
              <br />
              در انبار مرکزی
            </h1>
          </v-col>
          <v-col cols="12" md="1" class="text-center">
            <h1>گارانتی</h1>
          </v-col>
        </v-card-title>
        <v-card-text
          v-if="!loading"
          v-for="(item, index) in variations"
          :key="index"
          class="card-style pa-0 ma-0"
        >
          <v-row class="align-center">
            <v-col cols="2" class="d-flex align-center">
              <v-btn icon class="grey lighten-3 white--black mr-3" small>
                <h1>{{ index + 1 }}</h1>
              </v-btn>
              <div class="mr-3">
                <h1>
                  <small> {{ item.var1 }} </small>
                  <br />
                  <small> {{ item.var2 }} </small>
                  <br />
                  <small> {{ item.var3 }} </small>
                  <br />
                </h1>
              </div>
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <amp-input is-price v-model="item.price" class="mt-8" />
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <h1>
                {{ item.barcode }}
              </h1>
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <h1>
                {{ item.full_barcode }}
              </h1>
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <amp-input is-price v-model="item.discount" class="mt-8" />
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <amp-input
                cClass="ltr-item"
                rules="number"
                v-model="item.maximum"
                class="mt-8"
              />
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <amp-input
                cClass="ltr-item"
                v-model="item.minimum"
                class="mt-8"
                rules="number"
              />
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <amp-input
                cClass="ltr-item"
                v-model="item.order_point_agency"
                class="mt-8"
                rules="number"
              />
            </v-col>

            <v-col cols="12" md="1" class="text-center">
              <amp-input
                cClass="ltr-item"
                v-model="item.order_point_center"
                class="mt-8"
                rules="number"
              />
            </v-col>
            <v-col cols="12" md="1" class="text-center">
              <h1 v-if="Boolean(item.warranty) && Boolean(item.warranty.value)">
                <v-icon color="green darken-2"> task_alt </v-icon>
                <br />
                {{ item.warranty.value }}
              </h1>
              <v-icon v-else color="red darken-2"> close </v-icon>
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="12" md="1" class="text-center">
              <amp-button
                block
                height="36"
                text="به روز رسانی"
                color="green darken-1"
                :loading="loading"
                @click="update(item.id)"
              >
              </amp-button>
              <amp-button
                block
                height="36"
                class="mt-2"
                text="حذف"
                color="red darken-1"
                :loading="loading"
                @click="deleteDialog(true, index)"
              >
              </amp-button>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-text>
        <div v-if="loading">
          <v-col cols="12" v-for="i in 4" :key="i">
            <v-skeleton-loader
              class="mx-auto"
              height="100"
              type="card"
            ></v-skeleton-loader
          ></v-col>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" v-if="variations.length == 0 && !loading">
      <v-alert outlined type="warning" prominent border="left" class="text-center">
        هنوز برنامه فروشی برای این محصول درج نشده است.
      </v-alert>
    </v-col>

    <v-dialog v-model="deleteDiaolog" :width="$vuetify.breakpoint.mdAndUp ? 380 : 470">
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
  </div>
</template>

<script>
import VariationForm from "../Product/VariationForm.vue";
import CombinationForm from "../Product/CombinationForm.vue";

export default {
  components: { VariationForm, CombinationForm },
  props: {
    product: {
      type: Object,
      require: true,
    },
  },

  data: () => ({
    loading: false,
    variations: [],
    total_data: [],

    deleteDiaolog: false,
    variationDiaolog: {
      show: false,
      item: "",
    },
    addCombinationDiaolog: {
      show: false,
      item: "",
    },
    selected_item: "",
    form: {
      id: "",
      name: "",
      slug: "",
      code: "",
      status: "hidden",
      has_single_sell: "1",
      has_whole_sell: "0",
      createUrl: "/product-variation-combination/insert",
      updateUrl: "/product-variation-combination/update",
      mixturable: "0",
      main_picture_path: "/uploads/main_pics/main_pic1.jpeg",
      base_whole_sell_unit: "",
      mixture_type_id: "",
      categories: [],
      keywords: [],
      medias: [],
      description: "",
      seo_description: "",
      sort: "",
    },
  }),
  mounted() {
    this.getCombinations();
  },
  methods: {
    submit() {
      let form = this.$copyForm(this.form);
      form["has_single_sell"] = parseInt(form["has_single_sell"]);
      form["has_whole_sell"] = parseInt(form["has_whole_sell"]);
      form["mixturable"] = parseInt(form["mixturable"]);

      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    update(id) {
      this.loading = true;
      let data = this.total_data;
      let selected_item = {};
      let find_changed_combination = {};
      selected_item = data.find((f) => f.id == id);
      find_changed_combination = this.variations.find((f) => (f.id = id));

      if (Boolean(selected_item) && Boolean(find_changed_combination)) {
        let form = selected_item;

        form.minimum = find_changed_combination.minimum;
        form.maximum = find_changed_combination.maximum;
        form.price = find_changed_combination.price;
        form.discount = find_changed_combination.discount;
        form.sort = find_changed_combination.sort;
        if (!form.price && !form.barcode) {
          this.$toast.error("لطفا ورودی ها را کنترل کنید.");
          this.loading = false;
          return;
        }
        form.sort = 0;
        this.$reqApi("/product-variation-combination/update", form)
          .then((response) => {
            this.$toast.success("اطلاعات ویرایش شد");
            this.getCombinations();
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    deleteDialog(flag, index) {
      this.deleteDiaolog = flag;
      this.selected_item = index;
    },
    reloadVriations() {
      this.$refs.variationsFormSingleSeal.loadData();
    },
    deleteItem() {
      this.loading = true;
      let selected_id = this.variations[this.selected_item].id;
      this.$reqApi("/product-variation-combination/delete", { id: selected_id })
        .then((response) => {
          this.$toast.success("ویژگی مد نظر با موفقیت حذف شد");
          this.$emit("reloadPage");
          this.deleteDiaolog = false;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    closeAddCombination() {
      this.addCombinationDiaolog.show = false;
      this.$emit("reloadPage");
    },
    showVariationList() {
      this.variationDiaolog.show = true;
      this.variationDiaolog.item = this.product;
    },
    showAddCombination() {
      this.addCombinationDiaolog.show = true;
      this.addCombinationDiaolog.item = this.product;
    },
    getCombinations() {
      this.loading = true;
      let product_id = this.product.id;
      this.$reqApi("product-variation-combination/variety-list", {
        product_id: product_id,
      })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          this.total_data = data.sort((a, b) => {
            return a.sort - b.sort;
          });
          try {
            for (let i = 0; i < data.length; i++) {
              const x = data[i];
              let var1 = Boolean(x.variation1.codes)
                ? x.variation1.variation_type.value + " " + x.variation1.colors
                : x.variation1.variation_type.value + " " + x.variation1.value;
              let var2 = x.variation2.variation_type.value + " " + x.variation2.value;
              let var3 = x.variation3.variation_type.value + " " + x.variation3.value;
              items.push({
                var1: var1,
                var2: var2,
                var3: var3,
                price: x.price,
                id: x.id,
                barcode: x.barcode,
                full_barcode: x.full_barcode,
                discount: x.discount,
                maximum: x.maximum,
                minimum: x.minimum,
                sort: x.sort,
                order_point_agency: x.order_point_agency,
                order_point_center: x.order_point_center,
                warranty: x.warranty,
              });
            }
          } catch (error) {}

          this.variations = items.sort((a, b) => {
            return a.sort - b.sort;
          });
          this.loading = false;
        })

        .catch((err) => {
          this.loading = false;
        });
    },

  },
};
</script>
<style scoped>
.card-style {
  border: 1px solid #1d1c1c13 !important;
}

.card-style:hover {
  background-color: #ffcb776b;
  cursor: pointer;
}
</style>

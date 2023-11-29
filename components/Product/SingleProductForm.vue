<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <CombinationForm
          :product_id="product.id"
          @closeAddCombination="closeAddCombination()"
          @reloadVaritoinsForm="reloadVriations()"
          :dataItems="product.category_ids"
        />
      </v-col>
      <v-col cols="12" md="12">
        <VariationForm
          :product_id="product.id"
          @closeVariationForm="closeVariationForm()"
          ref="variationsFormSingleSeal"
          :dataItems="product.category_ids"
        />

      </v-col>
    </v-row>

    <v-row class="pa-2 mt-10">
      <v-col cols="12" md="2" class="text-center"> محصول </v-col>
      <v-col cols="12" md="1" class="text-center"> قیمت به تومان</v-col>
      <!-- <v-col cols="12" md="1" class="text-center"> قیمت با تخفیف </v-col> -->
      <v-col cols="12" md="1" class="text-center"> بارکد </v-col>
      <v-col cols="12" md="2" class="text-center"> بارکد کامل </v-col>
      <v-col cols="12" md="1" class="text-center"> تخفیف </v-col>
      <v-col cols="12" md="1" class="text-center"> حداقل </v-col>
      <v-col cols="12" md="1" class="text-center"> حداکثر </v-col>
      <v-col cols="12" md="1" class="text-center"> ترتیب نمایش </v-col>
      <!-- <v-col cols="12" md="1" class="text-center"> موجودی </v-col>
      <v-col cols="12" md="3" class="text-center"> عملیات </v-col> -->
    </v-row>

    <v-col cols="12" v-if="product.product_variation_combinations.length == 0">
      <v-alert
        outlined
        type="warning"
        prominent
        border="left"
        class="text-center"
      >
        هنوز برنامه فروشی برای این محصول درج نشده است.
      </v-alert>
    </v-col>

    <v-row
      v-for="(sv, index) in product.product_variation_combinations.filter(
        x => x.sell_type == 'single'
      )"
      :key="'sv' + index"
      :class="index % 2 == 0 ? 'odd-row' : ''"
    >
      <v-col cols="12" md="2" class="text-center mt-3">
        <span v-if="sv.variation1">
          {{ sv.variation1.value }}
        </span>
        <span v-if="sv.variation2"> / {{ sv.variation2.value }} </span>
        <span v-if="sv.variation3"> / {{ sv.variation3.value }} </span>
      </v-col>
      <v-col cols="12" md="1" class="text-center mt-3">
        <amp-input is-price v-model="sv.price" />
      </v-col>
      <!-- <v-col cols="12" md="1" class="text-center"> <amp-input is-price v-model="sv.discounted_price" /></v-col> -->
      <v-col cols="12" md="1" class="text-center mt-3">
        <!-- <amp-input is-price v-model="sv.barcode" /> -->
        <span>{{ sv.barcode }} </span>
        <!-- <span v-if="sv.variation_2_id">{{ sv.variation_2_id.barcode }} | </span>
        <span v-if="sv.variation_3_id">{{ sv.variation_3_id.barcode }} </span> -->
      </v-col>
      <v-col cols="12" md="2" class="text-center mt-5">
        <span>{{ sv.full_barcode }} </span>
        <!-- <span v-if="sv.variation_2_id">{{ sv.variation_2_id.barcode }} | </span>
        <span v-if="sv.variation_3_id">{{ sv.variation_3_id.barcode }} </span> -->
      </v-col>
      <v-col cols="12" md="1" class="text-center mt-3">
        <amp-input is-price v-model="sv.discount" />
        <!-- <span v-if="sv.variation_2_id">{{ sv.variation_2_id.barcode }} | </span>
        <span v-if="sv.variation_3_id">{{ sv.variation_3_id.barcode }} </span> -->
      </v-col>
      <v-col cols="12" md="1" class="text-center mt-3">
        <amp-input is-price v-model="sv.maximum" />
        <!-- <span v-if="sv.variation_2_id">{{ sv.variation_2_id.barcode }} | </span>
        <span v-if="sv.variation_3_id">{{ sv.variation_3_id.barcode }} </span> -->
      </v-col>
      <v-col cols="12" md="1" class="text-center mt-3">
        <amp-input is-price v-model="sv.minimum" />
        <!-- <span v-if="sv.variation_2_id">{{ sv.variation_2_id.barcode }} | </span>
        <span v-if="sv.variation_3_id">{{ sv.variation_3_id.barcode }} </span> -->
      </v-col>

      <v-col cols="12" md="1" class="text-center mt-3">
        <span>{{ sv.sort }} </span>
        <!-- <span v-if="sv.variation_2_id">|{{ sv.sort }} | </span>
        <span v-if="sv.variation_3_id">{{ sv.sort }} </span>  -->
      </v-col>
      <!-- <v-col cols="12" md="1" class="text-center"><amp-input  is-number  v-model="sv.max"></amp-input></v-col>
      <v-col cols="12" md="1" class="text-center"><amp-input  is-number v-model="sv.weight"></amp-input></v-col> -->
      <v-col cols="12" md="2" class="text-center mt-3">
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
      require: true
    }
  },
  data: () => ({
    loading: false,
    deleteDiaolog: false,
    variationDiaolog: {
      show: false,
      item: ""
    },
    addCombinationDiaolog: {
      show: false,
      item: ""
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
      sort: 1
    }
  }),
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
        .then(response => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    update(index) {
      this.loading = true;
      let form = this.product.product_variation_combinations[index];
      form.minimum =
        +this.product.product_variation_combinations[index].minimum;
      form.maximum =
        +this.product.product_variation_combinations[index].maximum;
      form.price = +this.product.product_variation_combinations[index].price;
      form.discount =
        +this.product.product_variation_combinations[index].discount;
      if (!form.price && !form.barcode) {
        this.$toast.error("لطفا ورودی ها را کنترل کنید.");
        this.loading = false;
        return;
      }
      form.sort = 0
      this.$reqApi("/product-variation-combination/update", form)
        .then(response => {
          this.$toast.success("اطلاعات ویرایش شد");
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
    reloadVriations() {
      this.$refs.variationsFormSingleSeal.loadData();
    },
    deleteItem() {
      this.loading = true;
      let selected_id =
        this.product.product_variation_combinations[this.selected_item].id;
      this.$reqApi("/product-variation-combination/delete", { id: selected_id })
        .then(response => {
          this.$toast.success("ویژگی مد نظر با موفقیت حذف شد");
          this.$emit("reloadPage");
          this.deleteDiaolog = false;
          this.loading = false;
        })
        .catch(error => {
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
    }
  }
};
</script>

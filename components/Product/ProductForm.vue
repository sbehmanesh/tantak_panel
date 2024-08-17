<template>
  <div>
    <v-stepper alt-labels v-model="step_number">
      <v-stepper-header>
        <v-stepper-step :complete="step_number > 1" editable step="1">
          اطلاعات پایه محصول
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step_number > 2" editable step="2">
          جزئیات محصول</v-stepper-step
        >
        <v-divider></v-divider>
        <v-stepper-step :complete="step_number > 3" editable step="3">
          قیمت گذاری
        </v-stepper-step>
        <v-divider></v-divider>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
            <v-row dense>
              <v-col cols="12" md="3">
                <amp-input text="نام محصول" v-model="form.name" rules="require" />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input text="لینک" v-model="form.slug" rules="" />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input
                  text="قیمت  پایه (ریال)"
                  is-price
                  rules="require"
                  v-model="form.base_price"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input
                  is-price
                  text="قیمت عمده فروشی پایه (ریال)"
                  rules="require"
                  v-model="form.base_wholesale_price"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input
                  text="بارکد"
                  is-number
                  :disabled="modelId ? true : false"
                  v-model="form.barcode"
                  rules="number,max_10"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input
                  text="ترتیب نمایش"
                  v-model="form.sort"
                  is-number
                  rules="number"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-select
                  text="واحد فروش عمده"
                  rules="require"
                  v-model="form.wholesale_unit"
                  :items="wholesale_unit_items"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-select
                  text="وضعیت انتشار"
                  multiple
                  rules="require"
                  v-model="publish_status"
                  :items="publish_status_items"
                />
              </v-col>
              <v-col cols="12" md="3" v-if="Boolean(chek_phone_sale)">
                <amp-select
                  text="نوع پیش پرداخت"
                  rules="require"
                  v-model="prepay_type"
                  :items="prepay_type_item"
                />
              </v-col>
              <v-col cols="12" md="3" v-if="Boolean(chek_phone_sale)">
                <amp-input
                  v-if="prepay_type == 'amount'"
                  text="مبلغ پیش پرداخت (ریال)"
                  rules="require"
                  is-price
                  cClass="ltr-item"
                  v-model="prepayment"
                />
                <amp-input
                  v-else
                  text="درصد پیش پرداخت"
                  rules="require,percent"
                  cClass="ltr-item"
                  v-model="prepayment"
                />
              </v-col>

              <v-col cols="12" md="3">
                <amp-select
                  text="برند"
                  rules=""
                  v-model="form.brand_id"
                  :items="this.$store.state.setting.barnds"
                />
              </v-col>
              <v-col cols="12" md="12">
                <SelectCategory
                  v-model="form.category_ids"
                  :loadCategory="category_ids"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" class="text-center">
                <amp-button
                  large
                  icon="redo"
                  class="my-1"
                  color="error"
                  text="انصراف"
                  @click="redirectPage()"
                />
                <amp-button
                  large
                  icon="done"
                  class="my-1"
                  type="submit"
                  color="success"
                  :loading="loading"
                  :disabled="!valid || loading"
                  :text="modelId ? 'ذخیره تغییرات' : 'ذخیره و ادامه'"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-items>
        <v-stepper-content step="2">
          <v-alert
            outlined
            type="warning"
            prominent
            border="left"
            class="text-center"
            v-if="!modelId"
          >
            برای فعال شدن بخش جزئیات محصول ، بعد از ورود اطلاعات پایه دکمه ذخیره و ادامه
            را بزنید.
          </v-alert>
          <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading" v-else>
            <v-row dense>
              <v-col cols="12" md="4" class="mt-10">
                <v-row>
                  <v-col cols="12" md="12" class="center-div">
                    <v-img
                      min-width="150"
                      min-height="150"
                      max-width="365"
                      max-height="365"
                      class="rounded"
                      :src="$getImage(form.main_image, 'medium')"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <AmpUploadFile v-model="form.main_image" title="تصویر" />
                  </v-col>
                  <v-col cols="12" md="12">
                    <amp-button
                      :class="{
                        'mt-9': $vuetify.breakpoint.mdAndUp,
                        'mt-2': $vuetify.breakpoint.smAndDown,
                      }"
                      height="40"
                      block
                      @click="openGalleryDialog()"
                      text="تنظیم گالری تصاویر"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="8" class="mt-10">
                <v-card class="pa-4 elevation-6">
                  <AmpEditor
                    v-model="form.product_infos.summerized_description"
                    text="توضیحات مختصر"
                  />
                </v-card>
              </v-col>
              <v-col cols="12" md="12" class="mt-10">
                <v-card class="pa-5 elevation-0 my-3">
                  <AmpEditor
                    v-model="form.product_infos.description"
                    text="توضیحات کامل محصول"
                  />
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <AmpJsonInput v-model="specefication_table" text="ویژگی ها" />
              </v-col>
              <v-col cols="12" md="6" class="px-4">
                <amp-tags v-model="form.tags" text="برچسب ها" />
              </v-col>

              <v-col cols="12" md="5">
                <AmpJsonInput
                  textPlaceholder=" مثال: برای بیماران با احتیاط مصرف شود"
                  text="موارد منع مصرف "
                  v-model="form.additional_description"
                  :showValue="false"
                />
              </v-col>

              <v-col cols="12" md="12">
                <amp-textarea
                  text="توضیحات سئو"
                  v-model="form.product_infos.seo_description"
                  :rows="4"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" class="text-center">
                <amp-button
                  large
                  icon="redo"
                  class="my-1"
                  color="error"
                  text="انصراف"
                  @click="redirectPage()"
                />
                <amp-button
                  large
                  icon="done"
                  class="my-1"
                  type="submit"
                  color="success"
                  :loading="loading"
                  :disabled="!valid || loading"
                  :text="modelId ? 'ذخیره تغییرات' : 'ذخیره و ادامه'"
                />
              </v-col>
              <Gallery
                :gallery_imgs="form.medias"
                v-model="gallery_dialog"
                @insertGallery="insertGallery"
              />
            </v-row>
          </v-form>
        </v-stepper-content>
      </v-stepper-items>
      <v-stepper-content step="3">
        <v-row>
          <v-col cols="12" class="d-flex align-center">
            <v-alert
              outlined
              type="warning"
              prominent
              border="left"
              class="text-center mt-2 mx-3"
              v-if="!modelId"
            >
              برای فعال شدن بخش ویژگی های محصول ، بعد از ورود اطلاعات پایه دکمه ذخیره و
              ادامه را بزنید.
            </v-alert>
            <v-row v-else class="mt-5">
              <v-tabs v-model="tab" centered icons-and-text>
                <v-tab
                  ><span class="font-weight-medium">تنظیمات فروش تکی</span>
                  <v-icon class="font_30">shopping_cart</v-icon></v-tab
                >
                <v-tab>
                  <span> تنظیمات فروش عمده </span>
                  <v-icon class="font_30">scale</v-icon>
                </v-tab>
              </v-tabs>
              <v-col cols="12" v-if="tab == 0">
                <SingleProductForm @reloadPage="reloadPage()" :product="form" />
              </v-col>
              <v-col cols="12" v-if="tab == 0">
                <v-alert
                  outlined
                  type="warning"
                  prominent
                  border="left"
                  class="text-center"
                >
                  فروش تکی برای این محصول غیر فعال است
                </v-alert>
              </v-col>
              <v-col cols="12" v-if="tab == 1">
                <WholeProductForm @reloadPage="reloadPage()" :product="form" />
              </v-col>
              <v-col cols="12" v-if="tab == 1">
                <v-alert
                  outlined
                  type="warning"
                  prominent
                  border="left"
                  class="text-center"
                >
                  فروش عمده برای این محصول غیر فعال است
                </v-alert>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="modelId">
          <v-col cols="12" md="12" class="text-center">
            <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
              <amp-button
                large
                icon="redo"
                class="my-1"
                color="error"
                text="انصراف"
                @click="redirectPage()"
              />
              <amp-button
                large
                icon="done"
                class="my-1"
                type="submit"
                color="success"
                :loading="loading"
                :disabled="!valid || loading"
                :text="modelId ? 'ذخیره تغییرات' : 'ذخیره و ادامه'"
              />
            </v-form>
          </v-col>
        </v-row>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import Gallery from "@/components/Product/Gallery.vue";
import SingleProductForm from "@/components/Product/SingleProductForm.vue";
import WholeProductForm from "@/components/Product/WholeProductForm.vue";
import AmpAutocomplete from "../Base/AmpAutocomplete.vue";
import SelectCategory from "@/components/Product/SelectCategory.vue";
export default {
  components: {
    SingleProductForm,
    WholeProductForm,
    Gallery,
    AmpAutocomplete,
    SelectCategory,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    step_number: 1,
    valid: false,
    loading: false,
    prepayment: "",
    gallery_dialog: false,
    tab: 0,
    publish_status: [],
    publish_status_items: [
      { text: "فروش آنلاین", value: "online_sale" },
      { text: "فروش تلفنی", value: "phone_sale" },
      { text: "فروش حضوری", value: "person_sale" },
    ],
    category_ids: [],
    createUrl: "/product/insert",
    updateUrl: "/product/update",
    showUrl: "/product/show",
    product_categories: [],
    units: [],
    mixtureTypes: [],
    wholesale_unit_items: [],
    variationTypes: [],
    specefication_table: [],
    prepay_type: "amount",
    prepay_type_item: [
      { text: "درصد", value: "percent" },
      { text: "مقدار", value: "amount" },
    ],

    // 'tags' => 'nullable|array',
    //             'slug' => 'nullable|string',
    //             'online_sale' => 'boolean',
    //             'phone_sale' => 'boolean',
    //             'person_sale' => 'boolean',
    //             'barcode' => 'nullable|string',
    //             'category_ids' => 'nullable|array',
    //             'base_price' => 'nullable|integer',
    //             'main_image' => 'nullable|string',
    //             'product_infos' => 'nullable|array',
    //             'wholesale_unit' => 'nullable|string',
    //             'base_wholesale_price' => 'nullable|integer',

    form: {
      wholesale_unit: "",
      id: "",
      name: "",
      slug: "",
      code: "",
      barcode: "",
      online_sale: false,
      phone_sale: false,
      person_sale: false,
      has_single_sell: "1",
      has_whole_sell: "0",
      mixturable: "0",
      single_sell_variation_combinations: [],
      whole_sell_variation_combinations: [],
      product_variation_combinations: [],
      base_price: "",
      main_image: "/image/no_image.png",
      brand_id: "",
      base_wholesale_price: "",
      category_ids: [],
      tags: [],
      medias: [],
      additional_description: [],
      sort: 1,
      excerpt_description: "",
      product_infos: {
        seo_description: "",
        description: "",
        summerized_description: "",
        specefication_table: [],
      },
    },
  }),
  beforeMount() {
    this.$store.dispatch("setting/setBrand");
  },
  mounted() {
    if ("step" in this.$route.query) {
      this.step_number = this.$route.query.step;
    }
    if (this.modelId) {
      this.loadData();
    }
    // this.getCategories();
    this.getSettings();
    this.loadWholesaleUnit();
  },
  watch: {
    specefication_table() {
      if (this.specefication_table) {
        this.form.product_infos.specefication_table = this.convetrSpacefication(
          this.specefication_table
        );
      }
    },
    step_number() {
      if (this.step_number > 3) {
        this.step_number = 3;
      }
    },
  },
  computed: {
    chek_phone_sale() {
      if (Boolean(this.$store.state.auth.role)) {
        return this.publish_status.indexOf("phone_sale") > -1;
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = this.$copyForm(this.form);
      form["online_sale"] = false;
      form["prepay_type"] = this.prepay_type;
      form["phone_sale"] = false;
      form["person_sale"] = false;
      this.publish_status.map((y) => {
        if (y == "person_sale") {
          form.person_sale = true;
        }
        if (y == "online_sale") {
          form.online_sale = true;
        }

        if (y == "phone_sale") {
          form.phone_sale = true;
          form["prepay_amount"] = this.prepayment;
        }
      });

      for (let index = 0; index < this.publish_status_items.length; index++) {
        const x = this.publish_status_items[index];
        this.publish_status.map((y) => {
          if (y == x.value) {
            form[y] = true;
          }
        });
      }
      form["has_single_sell"] = parseInt(form["has_single_sell"]);
      form["has_whole_sell"] = parseInt(form["has_whole_sell"]);
      form["mixturable"] = parseInt(form["mixturable"]);
      // if (form.additional_description) {
      //   form.additional_description = JSON.stringify(
      //     form.additional_description
      //   );
      // }

      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;

        // if (form.status == "hidden") {
        //   if (
        //     this.form.single_sell_variation_combinations.length > 0 ||
        //     form.whole_sell_variation_combinations.length > 0
        //   ) {
        //     form.status = "active";
        //   }
        // }

        // if (
        //   this.form.single_sell_variation_combinations.length == 0 &&
        //   form.whole_sell_variation_combinations.length == 0
        // ) {
        //   form.status = "hidden";
        // }
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات اولیه محصول مورد نظر شما ثبت شد");
            this.$router.push("/product/" + response.id + "?step=2");
            return;
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
            if (this.step_number == 3) {
              this.redirectPage();
            }
            this.step_number += 1;
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          try {
            response = response.model;
            this.form["id"] = response.id;
            //  this.

            this.form.name = response.name;
            this.form.main_image = response.main_image;
            this.form.wholesale_unit = response.wholesale_unit;

            if (Boolean(response.online_sale)) {
              this.publish_status.push("online_sale");
            }
            if (Boolean(response.person_sale)) {
              this.publish_status.push("person_sale");
            }
            if (Boolean(response.phone_sale)) {
              this.publish_status.push("phone_sale");
              this.preprepay_type = response.preprepay_type;
              this.prepayment = response.prepay_amount;
            }

            this.form.slug = response.slug;
            this.form.base_price = response.base_price;
            this.form.base_wholesale_price = response.base_wholesale_price;
            this.form.barcode = response.barcode;
            this.form.brand_id = response.brand_id;
            this.form.product_variation_combinations =
              response.product_variation_combinations;
            for (let i = 0; i < response.categories.length; i++) {
              this.category_ids.push(response.categories[i]);
            }

            this.form.code = response.code;
            if (response.product_infos) {
              response.product_infos.map((x) => {
                if (x.type == "table_item") {
                  this.specefication_table.push({
                    [x.key]: x.value,
                  });
                }
                if (x.type == "seo_description") {
                  this.form.product_infos.seo_description = x.value;
                }
                if (x.type == "summerized_description") {
                  this.form.product_infos.summerized_description = x.value;
                }
                if (x.type == "description") {
                  this.form.product_infos.description = x.value;
                }
              });
              // if (response.description.additional_description) {
              //   this.form.additional_description = JSON.parse(
              //     response.description.additional_description
              //   );
              // }
            }
            for (let i = 0; i < response.tags.length; i++) {
              this.form.tags.push(response.tags[i].name);
            }
            this.form.main_image = response.main_image;
            this.form.single_sell_variation_combinations =
              response.single_sell_variation_combinations;
            this.form.whole_sell_variation_combinations =
              response.whole_sell_variation_combinations;

            this.form.medias = [];
            this.form.sort = response.sort;
            this.loading = false;
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
    getCategories() {
      let form = {
        row_number: 2000,
      };

      this.$reqApi("/product-variation", form)
        .then((response) => {
          this.product_categories = response.model.data.map((x) => ({
            value: x.id,
            text: x.value,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadWholesaleUnit() {
      let filters = {
        key: {
          op: "=",
          value: "wholesale_unit",
        },
      };

      this.$reqApi("/setting", { filters: filters })
        .then((response) => {
          this.wholesale_unit_items = response.model.data.map((x) => ({
            value: x.id,
            text: x.value,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    reloadPage() {
      this.loadData();
    },
    convetrSpacefication(arr) {
      return arr
        .map((obj) =>
          Object.keys(obj).map((key) => ({
            key,
            value: obj[key],
          }))
        )
        .flat();
    },
    openGalleryDialog() {
      this.gallery_dialog = !this.gallery_dialog;
    },
    insertGallery(gallery_array) {
      this.form.medias = gallery_array;
    },

    getSettings() {
      this.loading = true;

      let form = {
        row_number: 1000,
        // filters: { key: 'variation_type' },
        filters: {
          key: { op: "in", value: ["variation_type", "units", "mixture_type"] },
        },
      };

      this.$reqApi("/setting", form)
        .then((response) => {
          this.variationTypes = [];
          this.units = [];
          this.mixture_type = [];
          for (let i = 0; i < response.model.data.length; i++) {
            let x = response.model.data[i];
            if (x["key"] == "variation_type") {
              this.variationTypes.push({ value: x.id, text: x.value });
            }
            if (x["key"] == "units") {
              this.units.push({ value: x.value, text: x.value });
            }
            if (x["key"] == "mixture_type") {
              this.mixture_type.push({ value: x.id, text: x.value });
            }
          }

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>

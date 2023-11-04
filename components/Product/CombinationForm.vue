<template>
  <v-card class="pa-1 ma-0 elevation-0">
    <v-expansion-panels variant="popout" class="my-4 elevation-5" >
      <v-expansion-panel >
        <v-expansion-panel-header expand-icon="precision_manufacturing" class="primary lighten-4">
          ترکیب جدید
        </v-expansion-panel-header>
        <v-expansion-panel-content class="primary lighten-5" >
          <v-form v-model="valid" @submit.prevent="submit()" v-if="!loading">
            <v-row>
              <v-col cols="12">
                <amp-title
                  text="افزودن تنوع فروش جدید برای این محصول"
                ></amp-title>
              </v-col>
              <v-col cols="2" v-for="(v, index) in variations" :key="v.id">
                <amp-select
                  v-if="index == 0"
                  :text="v.text.value"
                  :items="v.items"
                  v-model="form.variation_1_id"
                  @input="setVariationId(v, 1, form.variation_1_id)"
                  rules="require"
                />
                <amp-select
                  v-if="index == 1"
                  :text="v.text.value"
                  :items="v.items"
                  v-model="form.variation_2_id"
                  @input="setVariationId(v, 2, form.variation_2_id)"
                  rules="require"
                />
                <amp-select
                  v-if="index == 2"
                  :text="v.text.value"
                  :items="v.items"
                  v-model="form.variation_3_id"
                  @input="setVariationId(v, 3, form.variation_3_id)"
                  rules="require"
                />
              </v-col>
              <v-col cols="2">
                <amp-input
                  is-price
                  text="قیمت تومان"
                  v-model="form.price"
                  rules="require"
                />
              </v-col>
              <v-col cols="2">
                <amp-input
                  text="بارکد"
                  dir="ltr"
                  v-model="form.barcode"
                  :rules="sellType == 'single,max_4' ? '' : 'require,max_4'"
                />
              </v-col>
              <v-col cols="2">
                <amp-input
                  is-price
                  text="تخفیف"
                  v-model="form.discount"
                  rules="percent"
                />
              </v-col>
              <v-col cols="2">
                <amp-input
                  is-price
                  text="حداقل"
                  v-model="form.minimum"
                  :rules="sellType == 'single' ? '' : 'require'"
                />
              </v-col>
              <v-col cols="2">
                <amp-input
                  is-price
                  text="حداکثر"
                  v-model="form.maximum"
                  :rules="sellType == 'single' ? '' : 'require'"
                />
              </v-col>
              <v-col cols="1">
                <amp-input
                  is-number
                  text="ترتیب "
                  v-model="form.sort"
                  rules="number,require"
                />
              </v-col>
              <v-col cols="12" md="1" class="text-center mt-8">
                <amp-button
                  :disabled="!valid || loading"
                  small
                  text="افزودن"
                  color="success"
                  :loading="loading"
                  @click="submit()"
                >
                </amp-button>
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  props: {
    product_id: { default: null },
    type: { default: "single_sell" },
    sellType: { default: "single" },
    categoryID: { default: "" },
    dataItems: { default: "" },
  },
  data: () => ({
    valid: false,
    loading: false,
    variations: [],
    variations_ids: [],
    variation_value1: "",
    variation_id1: "",
    variation_value2: "",
    variation_id2: "",
    variation_value3: "",
    variation_id3: "",
    variatoins_items: [],
    all_variations: [],
    form: {
      id: "",
      sort: 1,
      price: "",
      weight: "",
      variation_1_id: "",
      variation_2_id: "",
      variation_3_id: "",
      min: "",
      max: "",
      type: "",
      product_id: "",
      is_default: 0,
      sell_type: "single",
    },
  }),
  mounted() {
    this.form.sell_type = this.sellType;
  },
  watch:{
    dataItems(){
      if(this.dataItems){
        this.loadVariationItems()
      }
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$reqApi("/product-variation", {
        filters: { product_id: this.$route.params.id },
      })
        .then(async (response) => {
          let re = response.model.data;
          re.map((x) => {
            this.all_variations.push({
              text: x.value,
              value: x.id,
            });
          });
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    async submit() {
      let form = this.$copyForm(this.form);
      this.loading = true;
      form["product_id"] = this.product_id;
      form["type"] = this.sellType;
      form.variation_1_id = await this.checkVariatoin(
        this.form.variation_1_id,
        1
      );
      form.variation_2_id = await this.checkVariatoin(
        this.form.variation_2_id,
        2
      );
      form.variation_3_id = await this.checkVariatoin(
        this.form.variation_3_id,
        3
      );
      if (form.variation_1_id && form.variation_2_id && form.variation_3_id) {
        setTimeout(() => {
          this.$reqApi("/product-variation-combination/insert", form)
            .then((response) => {
              this.$toast.success("اطلاعات ثبت شد");
              this.$emit("closeAddCombination");
              this.$emit("reloadVaritoinsForm");
              this.loadData();
              this.loading = false;
              this.form = {
                id: "",
                sort: 1,
                price: "",
                weight: "",
                variation_1_id: "",
                variation_2_id: "",
                variation_3_id: "",
                barcode: "",
                discount: "",
                minimum: "",
                min: "",
                max: "",
                type: "",
                product_id: "",
              };
            })
            .catch((error) => {
              this.loading = false;
            });
        }, 600);
      } else {
        this.$toast.error("در روند ایجاد ترکیب مشکلی به وجود آمده است");
      }
    },
    loadVariationItems(value) {
      if (this.dataItems) {
        this.loading = true;
        let filters = {
          category_id: {
            op: "between",
            value: this.dataItems,
          },
        };
        this.$reqApi("/product-variation", { filters: filters })
          .then(async (response) => {
            let re = response.model.data;
            for (let i = 0; i < re.length; i++) {
              if (!this.variations_ids.includes(re[i].variation_type_id)) {
                let items = [];
                this.variations_ids.push(re[i].variation_type_id);
                for (let j = 0; j < re.length; j++) {
                  if (re[j].variation_type_id == re[i].variation_type_id) {
                    items.push({
                      text: re[j].value,
                      value: re[j].id,
                    });
                  }
                }
                this.variations.push({
                  text: re[i].variation_type,
                  value: re[i].variation_type_id,
                  items: items,
                });
              }
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    checkVariatoin(id, count) {
      let hvae_variation = false;
      let ids = id;
      this.all_variations.forEach((element) => {
        if (element.value == id) {
          hvae_variation = true;
        }
      });

      if (hvae_variation == false) {
        this.createNewVariation(id, count).then((res) => {
          if (res) {
            ids = res;
          }
        });
      }
      return ids;
    },
    setVariationId(v, count, id) {
      if (count == 1) {
        this.variation_id1 = v.value;
        v.items.map((x) => {
          if (x.value == id) {
            this.variation_value1 = x.text;
          }
        });
      } else if (count == 2) {
        this.variation_id2 = v.value;
        v.items.map((x) => {
          if (x.value == id) {
            this.variation_value2 = x.text;
          }
        });
      } else if (count == 3) {
        this.variation_id3 = v.value;
        v.items.map((x) => {
          if (x.value == id) {
            this.variation_value3 = x.text;
          }
        });
      }
    },
    createNewVariation(id, count) {
      return new Promise((response) => {
        let variations_id = "";
        let value = "";
        if (count == 1) {
          variations_id = this.variation_id1;
          value = this.variation_value1;
        } else if (count == 2) {
          variations_id = this.variation_id2;
          value = this.variation_value2;
        } else if (count == 3) {
          variations_id = this.variation_id3;
          value = this.variation_value3;
        }
        let form = {
          variation_type_id: variations_id,
          product_id: this.product_id,
          value: value,
        };
        this.$reqApi("/product-variation/insert", form)
          .then((res) => {
            response(res.id);
          })
          .catch((err) => {
            return err;
          });
      });
    },
  },
};
</script>

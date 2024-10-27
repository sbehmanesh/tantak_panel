<template>
  <v-card class="pa-1 ma-0 elevation-0">
    <v-expansion-panels class="my-4 elevation-0 style-class" >
      <v-expansion-panel>
        <v-expansion-panel-header
          expand-icon="add_circle"
          class="primary lighten-4 text-center"
        >
          <strong class="font_17"> ایجاد ترکیب جدید</strong>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form v-model="valid" @submit.prevent="submit()">
            <v-card class="elevation-0 mt-4" :disabled="loading">
              <v-row v-if="!loading">
                <v-col cols="12">
                  <amp-title
                    text="افزودن تنوع فروش جدید برای این محصول"
                  ></amp-title>
                </v-col>
                <v-col cols="12" md="3" v-for="(v, index) in variations" :key="v.id">
                  <amp-select
                    v-if="index == 0"
                    :text="v.text.value"
                    :items="v.items"
                    v-model="variation_1_id"
                    @change="
                      setVariationId(variation_1_id, v.text.sort, v.text.id, v)
                    "
                    rules="require"
                  />
                  <amp-select
                    v-if="index == 1"
                    :text="v.text.value"
                    :items="v.items"
                    v-model="variation_2_id"
                    @change="
                      setVariationId(variation_2_id, v.text.sort, v.text.id, v)
                    "
                    rules="require"
                  />
                  <amp-select
                    v-if="index == 2"
                    :text="v.text.value"
                    :items="v.items"
                    v-model="variation_3_id"
                    @change="
                      setVariationId(variation_3_id, v.text.sort, v.text.id, v)
                    "
                    rules="require"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <amp-input
                    is-price
                    text="قیمت تومان"
                    v-model="form.price"
                    rules="require"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <amp-input
                    is-price
                    text="تخفیف"
                    v-model="form.discount"
                    rules="percent"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <amp-input
                    is-price
                    text="حداقل"
                    v-model="form.minimum"
                    :rules="sellType == 'single' ? '' : 'require'"
                  />
                </v-col>
                <v-col cols="12" md="3">
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
                    @click="createVariatoin_1()"
                  >
                  </amp-button>
                </v-col>
              </v-row>
            </v-card>
          </v-form>
          <v-card
            :disabled="loading"
            class="elevation-0 primary lighten-5 mt-4"
            v-if="loading"
          >
            <v-col cols="12" class="text-center py-10">
              <v-progress-circular
                :width="5"
                :size="45"
                color="grey"
                indeterminate
              ></v-progress-circular>
            </v-col>
          </v-card>
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
    selected_variations: [],
    variations_ids: [],
    variation_value1: "",
    variation_id1: "",
    variation_value2: "",
    variation_id2: "",
    variation_value3: "",
    variation_id3: "",
    variatoins_items: [],
    all_variations: [],
    variation_1_id: "",
    variation_2_id: "",
    variation_3_id: "",
    form: {
      id: "",
      sort: 1,
      price: "",
      weight: "",

      min: "",
      max: "",
      is_default: 0,
      sell_type: "single",
    },
  }),
  mounted() {
    this.form.sell_type = this.sellType;
  },
  watch: {
    dataItems() {
      if (this.dataItems) {
        this.loadVariationItems();
      }
    },
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
    submit() {
      let form = { ...this.form };
      form["product_id"] = this.product_id;
      form["type"] = this.sellType;
      this.$reqApi("/product-variation-combination/insert", form)
        .then((response) => {
          this.$toast.success("اطلاعات ثبت شد");
          this.$emit("closeAddCombination");
          this.$emit("reloadVaritoinsForm");
          this.loadData();
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadVariationItems(value) {
      if (this.dataItems) {
        this.loading = true;
        let filters = {
          category_id: {
            op: "in",
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
                    if (re[j].variation_type.value_2 == "product_colors") {
                      let value_json = [];
                      if (re[j].value.startsWith("[")) {
                        value_json = JSON.parse(re[j].value);
                      }
                      let text = re[j].colors ? re[j].colors : re[j].value;
                      items.push({
                        text: text,
                        value: value_json,
                        id: re[j].id,
                        type: re[j].variation_type.value_2,
                      });
                    } else {
                      items.push({
                        text: re[j].value,
                        value: re[j].id,
                        id: re[j].id,
                        type: re[j].variation_type.value_2,
                      });
                    }
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
    setVariationId(value, sort, variation_type_id, v) {
      let items = {};
      if (Boolean(v)) {

        if (typeof value == "object") {
          items["sort"] = sort;
          items["type"] = value[0].type;
          items["value_id"] = value;
          items["variation_type_id"] = variation_type_id;
        } else {
          let find = v.items.find((t) => t.id == value);
          if (Boolean(find)) {
            items["sort"] = sort;
            items["type"] = value[0].type;
            items["value_id"] = find.text;
            items["variation_type_id"] = variation_type_id;
          }
        }
        this.selected_variations.push(items);
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

    createVariatoin_1() {
      this.loading = true;
      return new Promise((res, rej) => {
        let form = {};
        let variation = this.selected_variations.find((x) => x.sort == 1);

        if (Boolean(variation)) {
          if (variation.type == "product_colors") {
            let id = [];
            id.push(variation.value_id);
            form = {
              variation_type_id: variation.variation_type_id,
              product_id: this.product_id,
              value: id,
            };
          } else {
            form = {
              variation_type_id: variation.variation_type_id,
              product_id: this.product_id,
              value: variation.value_id,
            };
          }

          this.$reqApi("/product-variation/insert", form)
            .then((response) => {
              this.form["variation_1_id"] = response.id;
              res(response.id);
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      })
        .then((res) => {
          this.createVariatoin_2(res);
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
    createVariatoin_2(id) {
      return new Promise((res, rej) => {
        let form = {};
        let variation = this.selected_variations.find((x) => x.sort == 2);
        if (Boolean(variation)) {
          form = {
            variation_type_id: variation.variation_type_id,
            product_id: this.product_id,
            value: variation.value_id,
          };
          this.$reqApi("/product-variation/insert", form)
            .then((response) => {
              this.form["variation_2_id"] = response.id;
              res(response.id);
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      })
        .then((res) => {
          this.createVariatoin_3();
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
    createVariatoin_3() {
      return new Promise((res, rej) => {
        let form = {};
        let variation = this.selected_variations.find((x) => x.sort == 3);
        if (Boolean(variation)) {
          form = {
            variation_type_id: variation.variation_type_id,
            product_id: this.product_id,
            value: variation.value_id,
          };
          this.$reqApi("/product-variation/insert", form)
            .then((response) => {
              this.form["variation_3_id"] = response.id;
              res(response.id);
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      })
        .then((res) => {
          this.submit();
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.style-class {
  border-radius: 10px !important;
}
</style>

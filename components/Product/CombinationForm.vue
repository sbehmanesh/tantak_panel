<template>
  <v-card class="pa-1 ma-0 elevation-0">
    <v-expansion-panels class="my-4 elevation-0 style-class">
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
                <v-col
                  cols="12"
                  md="3"
                  v-for="(v, index) in variations"
                  :key="v.index"
                >
                  <amp-select
                    multiple
                    v-if="v.sort == 1"
                    :text="v.title"
                    :items="v.items"
                    v-model="variation_1_id"
                    @change="
                      setVariationId(
                        variation_1_id,
                        v.sort,
                        v.variation_type_id,
                        v
                      )
                    "
                    rules="require"
                  />
                  <amp-select
                    multiple
                    v-if="v.sort == 2"
                    :text="v.title"
                    :items="v.items"
                    v-model="variation_2_id"
                    @change="
                      setVariationId(
                        variation_2_id,
                        v.sort,
                        v.variation_type_id,
                        v
                      )
                    "
                    rules="require"
                  />
                  <amp-select
                    v-if="v.sort == 3"
                    :text="v.title"
                    :items="v.items"
                    v-model="variation_3_id"
                    @change="
                      setVariationId(
                        variation_3_id,
                        v.sort,
                        v.variation_type_id,
                        v
                      )
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
    variation_1_ids: [],
    variation_2_ids: [],
    variation_3_id: "",
    form: {
      id: "",
      sort: 1,
      price: "",
      weight: "",
      variation_1_ids: [],
      variation_2_ids: [],
      min: "",
      max: "",
      is_default: 0,
      sell_type: "single",
    },
  }),
  mounted() {
    this.form.sell_type = this.sellType;
    this.loadVariationItems();
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
          this.$emit("reloadCombinations");
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
        // let filters = {
        //   category_id: {
        //     op: "in",
        //     value: this.dataItems,
        //   },
        // };
        this.$reqApi("product-variation/only-product", {
          product_id: this.product_id,
        })
          .then(async (response) => {
            let colors = [];
            let sizes = [];
            let qualityes = [];
            let value_json = "";

            let data = JSON.parse(JSON.stringify(response.model));

            let find_var1 = data.find((f) => f.variation_type.sort == 1);
            let find_var2 = data.find((f) => f.variation_type.sort == 2);
            let find_var3 = data.find((f) => f.variation_type.sort == 3);

            if (
              Boolean(find_var1) &&
              Boolean(find_var2) &&
              Boolean(find_var3)
            ) {
              for (let index = 0; index < data.length; index++) {
                const x = data[index];

                let key = x.variation_type_id;
                if (key == find_var1.variation_type_id) {
                  if (x.value.startsWith("[")) {
                    value_json = JSON.parse(x.value);
                  } else {
                    value_json = x.id;
                  }

                  colors.push({
                    text: Boolean(x.colors) ? x.colors : x.value,
                    value: value_json,
                  });
                } else if (key == find_var2.variation_type_id) {
                  sizes.push({
                    text: x.value,
                    value: x.value,
                  });
                } else if (key == find_var3.variation_type_id) {
                  qualityes.push({
                    text: x.value,
                    value: x.id,
                  });
                }
              }
            }
            let variation1 = {};
            let variation2 = {};
            let variation3 = {};

            variation1["title"] = find_var1.variation_type.value;
            variation1["value_2"] = find_var1.variation_type.value_2;
            variation1["sort"] = find_var1.variation_type.sort;
            variation1["variation_type_id"] = find_var1.variation_type_id;
            variation1["items"] = colors;

            this.variations.push(variation1);
            variation2["title"] = find_var2.variation_type.value;
            variation2["value_2"] = find_var2.variation_type.value_2;
            variation2["sort"] = find_var2.variation_type.sort;
            variation2["variation_type_id"] = find_var2.variation_type_id;
            variation2["items"] = sizes;
            this.variations.push(variation2);

            variation3["title"] = find_var3.variation_type.value;
            variation3["value_2"] = find_var3.variation_type.value_2;
            variation3["sort"] = find_var3.variation_type.sort;
            variation3["variation_type_id"] = find_var3.variation_type_id;
            variation3["items"] = qualityes;
            this.variations.push(variation3);

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
          items["type"] = v.value_2;
          items["value_id"] = value;
          items["variation_type_id"] = variation_type_id;
        } else {
          let find = v.items.find((t) => t.value == value);

          if (Boolean(find)) {
            items["sort"] = sort;
            items["type"] = v.value_2;
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
      return new Promise(async (res, rej) => {
        let form = {};

        let variations = this.selected_variations.filter((x) => x.sort == 1);
        for (let i = 0; i < variations.length; i++) {
          const variation = variations[i];
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

            let response = await this.$reqApi("/product-variation/insert", {
              ...form,
              value: form.value[0][i],
            });
            this.form["variation_1_ids"].push(response.id);
          }
        }
        this.loading = false;

        res();
      })
        .then((res) => {
          this.createVariatoin_2(res);
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
    createVariatoin_2(id) {
      return new Promise(async (res, rej) => {
        let form = {};
        let variations = this.selected_variations.filter((x) => x.sort == 2);
        for (let i = 0; i < variations.length; i++) {
          const variation = variations[i];
          
          if (Boolean(variation)) {
            form = {
              variation_type_id: variation.variation_type_id,
              product_id: this.product_id,
              value: variation.value_id,
            };
            if (
              !Boolean(variation.value_id) ||
              variation.value_id.length < i + 1 ||
              !Boolean(variation.value_id[i])
            ) {
              continue;
            }

            let response = await this.$reqApi("/product-variation/insert", {
              ...form,
              value: form.value[i],
            });

            this.form["variation_2_ids"].push(response.id);
          }
        }
        res();
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

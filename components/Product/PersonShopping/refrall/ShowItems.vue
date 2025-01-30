<template>
  <v-dialog v-model="dialog" width="520" persistent>
    <v-card class="pa-2">
      <div class="">
        <v-col cols="12" class="d-flex align-top">
          <h1 class="font_19">جزییات</h1>

          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon color="grey"> cancel </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" class="d-flex py-0">
          <v-card
            width="48%"
            class="text-center pa-2 py-4 ma-2 elevation-0"
            outlined
          >
            <v-icon color="grey">attach_money</v-icon>
            <h1>
              <small>
                مجموع قیمت
                <br />
                {{ $price(items.total_price) }} ریال
              </small>
            </h1>
          </v-card>
          <v-card
            width="48%"
            class="text-center py-4 pa-2 ma-2 elevation-0"
            outlined
          >
            <v-icon color="grey ">qr_code_2</v-icon>
            <h1>
              <small>
                شماره فاکتور
                <br />
                {{ items.factor_number }}
              </small>
            </h1>
          </v-card>
          <v-card
            width="48%"
            class="text-center pa-2 py-4 ma-2 elevation-0"
            outlined
          >
            <v-icon color="grey ">shopping_cart</v-icon>
            <h1 v-if="Object.keys(items).length > 0">
              <small>
                تعداد موجودی
                <br />
                {{ items.return_factory_items.length }} عدد
              </small>
            </h1>
          </v-card>
        </v-col>

        <v-col cols="12" v-if="!loading" class="py-0">
          <div v-for="(x, i) in items.return_factory_items" :key="i">
            <v-card
              v-if="x.section_name == 'ProductVariationCombination'"
              style="border-right: 4px solid #8585858a"
              class="elevation-1 my-4 pa-4 d-flex align-center"
              outlined
            >
              <h1>
                <small>
                  {{ x.name }}
                </small>

                <h1 class="grey--text">
                  <small>
                    {{
                      x.product_variation_combination.variation1.variation_type
                        .value
                    }}
                  </small>
                  <small
                    v-if="
                      Boolean(x.product_variation_combination.variation1.codes)
                    "
                  >
                    {{ x.product_variation_combination.variation1.colors }}
                  </small>
                  <small v-else>
                    {{ x.product_variation_combination.variation1.value }}
                  </small>
                  /
                  <small>
                    {{
                      x.product_variation_combination.variation2.variation_type
                        .value
                    }}
                    {{ x.product_variation_combination.variation2.value }}
                  </small>
                  /
                  <small>
                    {{
                      x.product_variation_combination.variation3.variation_type
                        .value
                    }}
                    {{ x.product_variation_combination.variation3.value }}
                  </small>
                </h1>
              </h1>
              <v-spacer></v-spacer>
              <div class="text-center">
                <v-icon color="grey lighten-1"> local_mall </v-icon>
                <h1>
                  <small> تعداد {{ x.number }} عدد </small>
                  <br />
                  <small> جمع کل {{ $price(x.price) }} ریال </small>
                </h1>
              </div>
            </v-card>

            <v-card
              v-if="x.section_name == 'Package'"
              style="border-right: 4px solid #8585858a"
              class="elevation-1 my-4 pa-4 d-flex align-center"
              outlined
            >
              <h1>
                <small>
                  {{ x.name }} </small
                ><br />

                <small class="grey--text">
                  قیمت پکیج :
                  {{ $price(x.package.price) }} ریال
                </small>
              </h1>
              <v-spacer></v-spacer>
              <div class="text-center">
                <v-icon color="grey"> format_list_bulleted </v-icon>
                <h1>
                  <small> تعداد {{ x.number }} عدد </small>
                  <br />
                  <small> جمع کل {{ $price(x.price) }} ریال </small>
                </h1>
              </div>
            </v-card>
          </div>
        </v-col>
        <v-col v-if="loading" class="text-center my-10" cols="12">
          <v-progress-circular
            :size="30"
            :width="4"
            indeterminate
            color="grey"
          />
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    modelId: {
      default: "",
    },
    dialog: {
      default: false,
    },
  },
  data: () => ({
    valid: true,
    loading: false,
    items: [],
  }),
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      this.$reqApi("return-factory/show", { id: this.modelId })
        .then((res) => {
          this.items = res.model;

          this.loading = false;
        })
        .catch((err) => {
          this.closeDialog();
        });
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form["return_product_id"] = this.data.id;
      this.$reqApi("return-product/change-status", form)
        .then((res) => {
          this.loading = false;
          this.$emit("reload");
          this.closeDialog();
          this.$toast.success("عملیات با موفقیت انجام شد");
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

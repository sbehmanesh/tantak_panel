<template>
  <v-card class="pa-5">
    <v-form v-model="valid" @submit.prevent="submit()" v-if="!loading">
      <v-row>
        <v-col cols="12">
          <amp-title text="افزودن تنوع فروش جدید برای این محصول"></amp-title>
        </v-col>
        <v-col cols="2" v-for="(v, index) in variations" :key="v.id">
          <amp-select
            v-if="index == 0"
            :text="v.text.value"
            :items="variatoins_items"
            v-model="form.variation_1_id"
            rules="require"
          />
          <amp-select
            v-if="index == 1"
            :text="v.text.value"
            :items="variatoins_items"
            v-model="form.variation_2_id"
            rules="require"
          />
          <amp-select
            v-if="index == 2"
            :text="v.text.value"
            :items="variatoins_items"
            v-model="form.variation_3_id"
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
            is-price
            text="بارکد"
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
  </v-card>
</template>

<script>
export default {
  props: {
    product_id: { default: null },
    type: { default: "single_sell" },
    sellType: { default: "single" }
  },
  data: () => ({
    valid: false,
    loading: false,
    variations: [],
    variations_ids: [],
    variatoins_items: [],
    all_variations:[],
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
      sell_type: "single"
    }
  }),
  mounted() {
    this.loadData();
    this.loadVariationItems();
    this.form.sell_type = this.sellType;
  },
  watch: {
    "form.variation_1_id"() {
      this.checkVariatoin(this.form.variation_2_id);
    },
    "form.variation_2_id"() {
      this.checkVariatoin(this.form.variation_2_id);
    },
    "form.variation_3_id"() {
      this.checkVariatoin(this.form.variation_3_id);
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
          let re = response.model.data;
          for (let i = 0; i < re.length; i++) {
            if (!this.variations_ids.includes(re[i].variation_type_id)) {
              let items = [];
              this.variations_ids.push(re[i].variation_type_id);
              for (let j = 0; j < re.length; j++) {
                if (re[j].variation_type_id == re[i].variation_type_id) {
                  items.push({
                    text: re[j].value,
                    value: re[j].id
                  });
                }
              }
              this.variations.push({
                text: re[i].variation_type,
                value: re[i].variation_type_id,
                items: items
              });
            }
          }
          re.map((x)=>{
            this.all_variations.push({
              text:x.value,
              value: x.variation_type.id
            })
          })
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    submit() {
      let form = this.$copyForm(this.form);

      form["product_id"] = this.product_id;
      form["type"] = this.sellType;
      this.loading = true;
      if (!form["weight"]) {
        form["weight"] = form["min"];
      }

      this.$reqApi("/product-variation-combination/insert", form)
        .then(response => {
          this.$toast.success("اطلاعات ثبت شد");
          this.$emit("closeAddCombination");
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
            product_id: ""
          };
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadVariationItems() {
      this.$reqApi("/product-variation", { row_number: 30000 })
        .then(res => {
          let response = res.model.data;
          let items = [];
          response.map(x => {
            items.push({
              text: x.value,
              value: x.id
            });
          });
          this.variatoins_items = items;
        })
        .catch(err => {
          return err;
        });
    },
    checkVariatoin(id) {
      if(id){
        console.log(this.all_variations)
        console.log(this.variatoins_items)
        if(this.all_variations.indexOf(id) > -1){
          console.log('have variaiton')
        }else{
          console.log('dont variaiotn')
        }
      }
    }
  }
};
</script>

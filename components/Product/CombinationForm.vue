<template>
  <v-card class="pa-5">
    <v-form v-model="valid" @submit.prevent="submit()" v-if="!loading">
      <v-row>
        <v-col cols="12">
          <amp-title text="افزودن تنوع فروش جدید برای این محصول"></amp-title>
        </v-col>
        <v-col cols="2" v-for="(v, index) in variations" :key="v.id">
          <amp-select v-if="index == 0" :text="v.text" :items="v.items" v-model="form.variation1" rules="require" />
          <amp-select v-if="index == 1" :text="v.text" :items="v.items" v-model="form.variation2" rules="require" />
          <amp-select v-if="index == 2" :text="v.text" :items="v.items" v-model="form.variation3" rules="require" />
        </v-col>
        <v-col cols="2">
          <amp-input is-price text="قیمت تومان" v-model="form.price" rules="require" />
        </v-col>

        <v-col cols="2">
          <amp-input is-price text="قیمت با تخفیف" v-model="form.discounted_price" />
        </v-col>
        <v-col cols="2" v-if="type == 'single_sell'">
          <amp-input is-number text="وزن بسته بندی gr" v-model="form.weight" rules="require" />
        </v-col>
        <v-col cols="2" v-if="type != 'single_sell'">
          <amp-input  is-number text="حداقل قابل سفارش" v-model="form.min" rules="require" />
        </v-col>
        <v-col cols="2">
          <amp-input  is-number :text="type == 'single_sell' ? 'موجودی' : 'حداکثر قابل سفارش'" v-model="form.max" rules="require" />
        </v-col>
        <v-col cols="1">
          <amp-input  is-number text="ترتیب " v-model="form.sort" rules="number,require" />
        </v-col>
        <v-col cols="12" md="1" class="text-center mt-8">
          <amp-button :disabled="!valid || loading" small text="افزودن" color="success" :loading="loading" @click="submit()">
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
    type: { default: 'single_sell' },
  },
  data: () => ({
    valid: false,
    loading: false,
    variations: [],
    variations_ids: [],
    form: {
      id: '',
      sort: 1,
      price: '',
      weight: '',
      variation1: '',
      variation2: '',
      variation3: '',
      min: '',
      max: '',
      type: '',
      product_id: '',
      is_default: 0,
    },
  }),

  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      this.$reqApi('/product-variation', { filters: { product_id: this.product_id } })
        .then(async (response) => {
          this.variations = []
          let re = response.model.data

          for (let i = 0; i < re.length; i++) {
            if (!this.variations_ids.includes(re[i].variation_type_id)) {
              let items = []
              this.variations_ids.push(re[i].variation_type_id)

              for (let j = 0; j < re.length; j++) {
                if (re[j].variation_type_id == re[i].variation_type_id) {
                  items.push({
                    text: re[j].value,
                    value: re[j].id,
                  })
                }
              }
              this.variations.push({
                text: re[i].variation_type,
                value: re[i].variation_type_id,
                items: items,
              })
            }
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    submit() {
      let form = this.$copyForm(this.form)

      form['product_id'] = this.product_id
      form['type'] = this.type
      this.loading = true

      if (!form['weight']) {
        form['weight'] = form['min']
      }

      this.$reqApi('/product-variation-combination/insert', form)
        .then((response) => {
          this.$toast.success('اطلاعات ثبت شد')
          this.$emit('closeAddCombination')
          this.loading = false
          this.form = {
            id: '',
            sort: 1,
            price: '',
            weight: '',
            variation1: '',
            variation2: '',
            variation3: '',
            min: '',
            max: '',
            type: '',
            product_id: '',
            is_default: 0,
          }
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
}
</script>

<template>
  <div>
    <BaseTable url="/wholesell-price" createUrl="/product/wholesell-price/insert" :headers="headers" :BTNactions="btn_actions" />

    <v-dialog v-model="update_price_dialog" :width="$vuetify.breakpoint.mdAndUp ? 1000 : 1000">
      <v-card class="pa-5">
        <span class="mb-2 font_20 font_bold">به روز رسانی قیمت عمده محصول</span>
        <v-form v-model="valid" @submit.prevent="submit()" class="mt-2">
          <v-row class="pa-3">
            <v-col cols="4">
              <amp-input text="نام محصول" v-model="form.name" rules="require" />
            </v-col>
            <v-col cols="4">
              <amp-input is-price text="قیمت" v-model="form.price" rules="require" />
            </v-col>
            <v-col cols="6">
              <amp-button
                text="به روزرسانی"
                class="w-max"
                color="success"
                type="submit"
                :loading="loading"
                :disabled="!valid || loading"
              />
            </v-col>
            <v-col cols="6">
              <amp-button text="منصرف شدم" color="accent" class="w-max" @click="showUpdateDialog(false)" :disabled="loading" />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable'

export default {
  components: { BaseTable },
  data: () => ({
    loading: false,
    valid: false,
    update_price_dialog: false,

    headers: [],
    btn_actions: [],
    title: 'فهرست محصولات',
    form: {
      id: '',
      name: '',
      price: '',
    },
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [
      { text: 'نام محصول', value: 'name' },
      { text: 'قیمت', value: 'price', type: 'price' },
    ]

    this.btn_actions = [
      {
        color: 'success',
        text: 'به روزرسانی قیمت',
        fun: (body) => {
          this.showUpdateDialog(true, body)
        },
      },
    ]
  },

  methods: {
    showUpdateDialog(
      flag,
      item = {
        name: '',
        price: '',
      }
    ) {
      this.form = item
      this.update_price_dialog = flag
    },

    submit() {
      let form = {
        id: this.form.id,
        name: this.form.name,
        price: this.form.price,
      }
      this.loading = true
      this.$reqApi('/wholesell-price/update', form)
        .then((response) => {
          this.$toast.success('اطلاعات ویرایش شد')
          this.showUpdateDialog(false)
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
}
</script>

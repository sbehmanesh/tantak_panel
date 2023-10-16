<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="2">
          <amp-input text="عنوان روش ارسال" v-model="form.value.title" rules="require" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input is-price text="هزینه پایه به تومان" v-model="form.value.base" rules="require" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input is-price text="هزینه برای هر کیلوگرم اضافه به تومان" v-model="form.value.ratio" rules="require" />
        </v-col>

        <v-col cols="12" md="2">
          <amp-select
            help_text="با انتخاب این گزینه هزینه ارسال محاسبه می شود اما به سبد خرید کاربر اضافه نخواهد شد"
            text="پرداخت در محل"
            rules="require"
            v-model="form.value.pay_at_delivery"
            :items="this.$store.state.static.bool_number_enum"
          />
        </v-col>

        <v-col cols="12" md="2">
          <amp-input
            :help_text="help_text"
            is-number
            text="حداقل قیمت برای ارسال رایگان تومان"
            v-model="form.value.send_free_threshold"
            rules="require"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button large icon="redo" class="my-1" color="error" text="انصراف" @click="redirectPage()" />
          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: '/setting/insert',
    updateUrl: '/setting/update',
    showUrl: '/setting/show',
    help_text:
      'اگر می خواهید در صورتی که مجموع سبد خرید کاربر از یک قیمت بیشتر شد ارسال رایگان باشد، مبلغ سبد را اینجا وارد کنید، در غیر این صورت مقدار را روی 0 تنظیم کنید.',
    settings: [],
    selected: {},
    form: {
      id: '',
      key: 'delivery_method',
      value: {
        title: '',
        base: '', // ==> هزینه پایه بر حسب تومان
        ratio: '', //==> هزینه برای هر کیلوگرم اضافه
      },
      landing_page_needed: 1,
      send_free_threshold: '0',
      pay_at_delivery: '0',
    },
  }),

  beforeMount() {},
  mounted() {
    if (this.modelId) {
      this.loadData()
    }
  },

  methods: {
    submit() {
      let form = { ...this.form }
      this.loading = true
      let url = this.createUrl
      if (this.modelId) {
        url = this.updateUrl
        form['id'] = this.modelId
      }
      form.value = JSON.stringify(form.value)

      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success('اطلاعات ثبت شد')
          } else {
            this.$toast.success('اطلاعات ویرایش شد')
          }
          this.redirectPage()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    loadData() {
      this.loading = true
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          response = response.model
          this.form['id'] = response.id
          this.form.key = response.key
          this.form.value = JSON.parse(response.value)
          this.form.landing_page_needed = response.landing_page_needed
          this.loading = false
        })
        .catch((error) => {
          this.redirectPage()
          this.loading = false
        })
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push(this.path)
      }
    },
  },
}
</script>

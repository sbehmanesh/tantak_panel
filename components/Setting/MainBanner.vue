<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-alert dense type="info">سایز پیشنهادی 280*610 پیکسل</v-alert>

          <amp-inline-upload v-model="form.value.right_banner" title="بنر سمت راست " />
          <amp-input text="لینک" v-model="form.value.right_link" class="ltr-item" />
        </v-col>
        <v-col cols="12" md="6">
          <v-alert dense type="info">سایز پیشنهادی 280*610 پیکسل</v-alert>

          <amp-inline-upload v-model="form.value.left_banner" title="بنر سمت چپ " />
          <amp-input text="لینک" v-model="form.value.left_link" class="ltr-item" />
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
import AmpAutocomplete from '../Base/AmpAutocomplete.vue'
import AmpInput from '../Base/AmpInput.vue'
export default {
  components: { AmpAutocomplete, AmpInput },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: '/setting/insert',
    updateUrl: '/setting/update',
    showUrl: '/setting',

    form: {
      id: '',
      key: 'main_banner',
      value: {
        right_banner: '',
        right_link: '',
        left_banner: '',
        left_link: '',
      },
      landing_page_needed: 1,
    },
  }),

  mounted() {
    this.loadData()
  },

  methods: {
    submit() {
      let form = { ...this.form }
      this.loading = true
      let url = this.updateUrl
      if (!form['id']) {
        url = this.createUrl
      }
      form.value = JSON.stringify(this.form.value)
      this.$reqApi(url, form)
        .then((response) => {
          this.$toast.success('اطلاعات ثبت شد')
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    loadData() {
      this.loading = true

      this.$reqApi(this.showUrl, { filters: { key: 'main_banner' } })
        .then(async (response) => {
          if (response.model.data.length == 0) {
          } else {
            response = response.model.data[0]
            this.form['id'] = response.id
            this.form.key = response.key
            this.form.value = JSON.parse(response.value)
            this.form.landing_page_needed = response.landing_page_needed
          }
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

<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="6">
          <amp-input text="عنوان ویژگی" v-model="form.value" rules="require" />
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
    settings: [],
    selected: {},
    form: {
      id: '',
      key: 'variation_type',
      value: '',
      landing_page_needed: 0,
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
          this.form.value = response.value
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

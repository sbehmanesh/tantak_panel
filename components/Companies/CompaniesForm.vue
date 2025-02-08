<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="2">
          <amp-input text="عنوان شرکت " v-model="form.fa_name" rules="require" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input text="عنوان شرکت  (انگلیسی)" v-model="form.en_name" rules="require" />
        </v-col> 
        <v-col cols="12" md="2">
          <amp-input text="آدرس ایمیل" v-model="form.en_name" rules="email,require" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-upload-file title="بارگذاری لوگو" v-model="form.logo" />
        </v-col>
         <v-col cols="12" md="2">
          <amp-input text="عنوان دسته بندی" v-model="form.value" rules="require" />
        </v-col>
        <v-col cols="12">
          <amp-textarea text="توضیحات " v-model="form.description" />
        </v-col>
      </v-row>


      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button large icon="redo" class="my-1" color="error" text="انصراف" @click="redirectPage()" />
          <amp-button large icon="done" class="my-1" type="submit" color="success" :loading="loading"
            :disabled="!valid || loading" :text="modelId ? 'ویرایش' : 'ثبت'" />
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
    createUrl: '/company/insert',
    updateUrl: '/company/update',
    showUrl: '/company/show',
    companys: [],
    selected: {},
    form: {
      fa_name: "",
      en_name: "",
      city: "",
      email: "",
      logo: "",
      registered_at: "",
      description: "",
      national_id: "",
      status: "",
    },
  }),
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
          this.form.value_2 = response.value_2
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
<style>

</style>
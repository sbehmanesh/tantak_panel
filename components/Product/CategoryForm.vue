<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="عنوان دسته بندی" v-model="form.title" rules="require" />
        </v-col>

        <v-col cols="12" md="3">
          <amp-input text="لینک" v-model="form.slug" rules="" />
        </v-col>

        <v-col cols="12" md="3">
          <amp-autocomplete text="دسته بندی والد" v-model="form.parent_category_id" :items="categories" />
        </v-col>

        <v-col cols="12" md="1">
          <amp-input text="ترتیب نمایش" v-model="form.sort" rules="number" />
        </v-col>

        <v-col cols="12" md="4">
          <v-row>
            <v-col cols="12" md="6">
              <AmpUploadFile v-model="form.main_pic_path" title="تصویر شاخص" />
            </v-col>
            <v-col cols="12" md="6"> <v-img max-width="300" max-height="300" :src="$getImage(form.main_pic_path)" /> </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <amp-textarea text="توضیحات سئو" v-model="form.seo_description" />
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
    createUrl: '/category/insert',
    updateUrl: '/category/update',
    showUrl: '/category/show',
    categories: [],

    form: {
      id: '',
      title: '',
      slug: '',
      category_status: 'active',
      parent_category_id: '',
      seo_description: '',
      main_pic_path: '/image/no_image.png',

      sort: 1,
    },
  }),

  mounted() {
    if (this.modelId) {
      this.loadData()
    }
    this.getCategories()
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
          response = response.data
          this.form['id'] = response.id

          this.form.title = response.title
          this.form.slug = response.slug
          this.form.category_status = response.category_status
          this.form.parent_category_id = response.parent_category_id
          this.form.seo_description = response.seo_description
          this.form.main_pic_path = response.main_pic_path

          this.form.sort = response.sort
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
    getCategories() {
      let form = {
        row_number: 2000,
      }

      this.$reqApi('/product-category', form)
        .then((response) => {
          this.categories = response.model.data
            .filter((x) => !x.parent_category_id && this.modelId != x.id)
            .map((x) => ({
              value: x.id,
              text: x.title,
            }))

          this.categories.push({
            value: '',
            text: 'بدون والد',
          })

          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
}
</script>

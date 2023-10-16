<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense v-for="(m, index) in form.value['settings']" :key="index" class="mt-5">
        <v-col cols="12">
          <v-chip label color="success" class="mx-2 mb-1">{{ m['name'] }}</v-chip>
        </v-col>
        <v-col cols="2">
          <amp-input is-number text="حداقل وزن قابل سفارش" v-model="m.min" />
        </v-col>
         <v-col cols="2">
          <amp-input is-number text="حداکثر وزن قابل سفارش" v-model="m.max" />
        </v-col>
         <v-col cols="10">
          <amp-input cClass="ltr-item" text="اوزان بسته بندی ( با , (کاما) جدا شود)" v-model="m.weights" />
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

    init_form: {
      id: '',
      key: 'mixture_setting',
      value: {
        settings: [
          {
            mixture_id: '1ab4ba37-cf14-4ff8-bfe4-a2250c7c0495',
            min: '200',
            max: '10000',
            weights: '250,500,1000',
            slug: 'دمنوش_ساز',
            name: 'دمنوش ساز',
          },
          {
            mixture_id: '1dl4ba37-cf14-4ff8-bfe4-a2250c7c0495',
            min: '200',
            max: '10000',
            weights: '250,500,1000',
            slug: 'ادویه_ساز',
            name: 'ادویه ساز',
          },
          {
            mixture_id: '1dl4ba37-cf14-4ff8-bfe4-a2250c7c8895',
            min: '2',
            max: '100',
            weights: '1,2,3',
            slug: 'عرقیجات_ساز',
            name: 'عرقیجات ساز',
          },
        ],
      },
      landing_page_needed: 0,
    },

    form: {
      id: '',
      key: '',
      value: {
        settings: [],
      },
      landing_page_needed: 1,
    },
    mixtures: [],
  }),

  mounted() {
    this.selected = this.$store.state.static.mixture_types[0].value
    this.loadData()
  },

  methods: {
    submit() {
      let form = { ...this.form }
      this.loading = true
      let url = this.updateUrl
      form['id'] = this.form['id']
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

      this.$reqApi(this.showUrl, { filters: { key: 'mixture_setting' } })
        .then(async (response) => {
          if (response.model.data.length == 0) {
          } else {
            response = response.model.data[0]
            this.form['id'] = response.id
            this.form.key = response.key
            this.form.value = JSON.parse(response.value)
            this.form.landing_page_needed = response.landing_page_needed
            this.loading = false
          }
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

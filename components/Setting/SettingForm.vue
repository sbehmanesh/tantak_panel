<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="عنوان سایت" v-model="form.value.site_title" />
        </v-col>
        <v-col cols="12" md="1"> </v-col>

        <v-col cols="12" md="3">
          <v-alert dense type="warning">سایز پیشنهادی 80*80 پیکسل</v-alert>
          <AmpUploadFile v-model="form.value.logo" title="انتخاب لگو" />
        </v-col>
        <v-col cols="12" md="1"> </v-col>
        <v-col cols="12" md="3"> <v-img contain max-width="80" max-height="80" :src="$getImage(form.value.logo)" /> </v-col>

        <v-col cols="12" md="12" class="mt-5">
          <amp-textarea v-model="form.value.footer_text" text="متن فوتر" />
        </v-col>

        <v-col cols="12" md="12" class="mt-10">
          <v-row>
            <v-col cols="12" md='4' >
              <amp-input text="تلفن تماس" :is-number='true' v-model="form.value.phone" />
            </v-col>
            <v-col cols="12" md='4' >
              <amp-input text="پست الکترونیک"  cClass='ltr-item' rules="email" v-model="form.value.email" />
            </v-col>
            <v-col cols="12" md='4' >
              <amp-input text="آدرس" v-model="form.value.address" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="4" md="4">
          <amp-input text="اینستاگرام" cClass='ltr-item'  v-model="form.value.instagram" />
        </v-col>
        <v-col cols="4" md="4">
          <amp-input text="فیس بوک" cClass='ltr-item' v-model="form.value.facebook" />
        </v-col>
        <v-col cols="4" md="4">
          <amp-input text="پینترست" cClass='ltr-item'  v-model="form.value.pintrest" />
        </v-col>

        <v-col cols="4">
          <amp-input text="واتس آپ" cClass='ltr-item'  v-model="form.value.whatsup" />
        </v-col>

        <v-col cols="4">
          <amp-input text="یوتیوب" cClass='ltr-item'  v-model="form.value.youtube" />
        </v-col>

        <v-col cols="4">
          <amp-input text="آپارات" cClass='ltr-item'  v-model="form.value.aparat" />
        </v-col>

        <v-col cols="12">
          <amp-input text="کد نماد اعتماد" cClass='ltr-item'  v-model="form.value.enamad" />
        </v-col>

        <v-col cols="12">
          <amp-input text="کد ساماندهی" cClass='ltr-item'  v-model="form.value.samandehi" />
        </v-col>

        <v-col cols="12">
          <amp-input text="کد اتحادیه کسب و کار مجازی" cClass='ltr-item'  v-model="form.value.etehadieh" />
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
            color="primary"
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
import AmpAutocomplete from '@/components/Base/AmpAutocomplete.vue'
import AmpInput from '@/components/Base/AmpInput.vue'
import AmpEdito from '@/components/Base/AmpEditor'
export default {
  components: { AmpAutocomplete, AmpInput ,AmpEdito },
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
      key: 'main_setting',
      value: {
        site_title: '',
        logo: '',
        footer_text: '',
        phone: '',
        email: '',
        address: '',
        instagram: '',
        facebook: '',
        pintrest: '',
        whatsup: '',
        youtube: '',
        aparat: '',
        enamad: '',
        samandehi: '',
        etehadieh: '',
      },
      landing_page_needed: 1,
    },
  }),

  beforeMount() {},
  mounted() {
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
          this.$store.dispatch('setting/getPublicSetting')
          this.$toast.success('اطلاعات ثبت شد')
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    loadData() {
      this.loading = true
      this.$reqApi(this.showUrl, { filters: { key: 'main_setting' } })
        .then(async (response) => {
          if (response.model.data.length == 0) {
            this.init()
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
    init() {
      this.loading = true
      this.form.value = JSON.stringify(this.form.value)

      this.$reqApi(this.createUrl, this.form)
        .then(async (response) => {
          this.$store.dispatch('setting/getPublicSetting')
          this.loadData()
        })
        .catch((error) => {
          this.loading = false
        })
    },
  },
}
</script>

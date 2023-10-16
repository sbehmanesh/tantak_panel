<template>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="3">
            <amp-input text="نام محصول" rules="require,fa_chart" v-model="form.name" />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input is-price class="ltr-item" text="قیمت" rules="require" v-model="form.price" />
          </v-col>
        </v-row>
  
        <v-row dense>
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
              text="ثبت"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </template>
  
  <script>
  export default {
    data: () => ({
      valid: false,
      loading: false,
      form: {
        name: '',
        price: ''
      },
    }),
    methods: {
      submit() {
        let form = { ...this.form }
        this.loading = true
        this.$reqApi('/wholesell-price/insert', form)
          .then((response) => {
              this.$toast.success('اطلاعات ثبت شد')
            this.redirectPage()
          })
          .catch((error) => {
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
  
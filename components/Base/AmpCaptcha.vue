<template>
  <v-row dense>
    <v-col class=" " v-if="Boolean(image)" cols="6">
      <img :src="image" class="parent-captcha captha-w-100" />
    
    </v-col>
    <v-col class="center-div" v-else cols="6">
      <v-skeleton-loader height="60" width="100%" type="image" />
    </v-col>
    <v-col cols="6" class="d-flex align-center">
      <v-icon @click="loadCaptcha" color="white">
        refresh
      </v-icon>
      <amp-input
        is-number
        rules="require"
        text="کد امنیتی"
        v-model="inp_value"
        color="white--text"
        background-color="#fff"
      />
    
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    image: null,
    inp_key: '',
    inp_value: '',
  }),
  watch: {
    inp_value() {
      this.$emit('input', {
        captcha_code: this.inp_key,
        captcha_value: this.inp_value,
      })
    },
  },
  mounted() {
    this.loadCaptcha()
  },
  methods: {
    loadCaptcha() {
      this.image = null
      this.$reqApi('/public/captcha')
        .then((response) => {
          this.inp_value = ''
          this.inp_key = response.key
          this.image = 'data:image/png;base64,' + response.image
        })
        .catch((error) => {})
    },
  },
}
</script>

<style>
.parent-captcha > svg {
  height: 70px;
  width: 180px;
}
.captha-w-100 {
  width: 60%;
}
</style>

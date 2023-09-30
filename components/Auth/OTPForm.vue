<template>
  <v-form v-model="valid" @submit.prevent="submit()">
    <div class="center-div mt-n5">
      <span class="white--text">ورود با کد یکبار مصرف</span>
    </div>
    <amp-input
      text="تلفن همراه"
      color="white--text"
      rules="require,phone"
      v-model="form.username"
      background-color="#fff"
      prepend-inner-icon="person"
      cClass="ltr-item small-input"
    />
    <div class="px-3">
      <amp-labale text="کد ورود" color="white--text" />
      <v-otp-input plain length="4" v-model="form.code" :dark="!activeLogin" :disabled="!activeLogin" class="ltr-item small-input" />
    </div>
    <div class="px-3 mt-4 mb-4">
      <amp-button
        block
        height="40"
        text="ورود"
        icon="login"
        type="submit"
        color="success"
        :loading="loading"
        v-if="activeLogin"
        :disabled="!valid || loading"
        
      />
      <amp-button
        block
        v-else
        icon="sms"
        height="40"
        type="submit"
        color="success"
        text="ارسال کد"
        :loading="loading"
        @click="sendCode()"
        :disabled="!valid || loading"
      />
    </div>
  </v-form>
</template>

<script>
export default {
  props: { redirect: { default: true } },
  data: () => ({
    valid: false,
    loading: false,
    verify_time: 0,
    timeInterval: null,
    form: {
      code: '',
      username: '',
    },
  }),
  computed: {
    activeLogin() {
      return this.verify_time > 0
    },
  },
  beforeDestroy() {
    this.stopTime()
  },
  methods: {
    submit() {
      if (!Boolean(this.form.code)) {
        this.$toast.error('کد ارسال شده به شماره همراه خود را وارد کنید')
        return
      }
      this.loading = true
      let form = {
        code: this.$FarsiToEnglishNumber(this.form.code),
        username: this.$FarsiToEnglishNumber(this.form.username),
      }
      this.$reqApi('/auth/otp/login', form)
        .then((response) => {
          this.$store.dispatch('auth/login', response).then((data) => {
            this.stopTime()
            if (this.redirect) {
              this.$router.push('/panel')
            }
          })
        })
        .catch((error) => {
          this.loading = false
        })
    },
    sendCode() {
      this.loading = true
      let form = {
        section: 'panel',
        username: this.$FarsiToEnglishNumber(this.form.username),
      }
      this.$reqApi('/auth/otp/send', form)
        .then((response) => {
          this.stopTime()
          this.verify_time = 3 * 60
          this.timeInterval = setInterval(() => {
            if (this.verify_time > 0) {
              this.verify_time -= 1
            } else {
              this.stopTime()
            }
          }, 1000)
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    stopTime() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
        this.timeInterval = null
      }
    },
  },
}
</script>

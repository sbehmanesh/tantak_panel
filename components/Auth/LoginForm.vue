<template>
  <v-form v-model="valid" @submit.prevent="submit()">
    <v-col cols="12" class="d-flex text-center justify-center flex-column">

    
  <v-row class=" d-flex  justify-center  mb-2">
   <v-avatar color="white">
        <v-icon color="primary">
      lock</v-icon>
      </v-avatar>
</v-row>
          <b class="font_18 white--text">
    ورود به {{ $store.state.app_name }}
      </b>
            <small class="white--text ">ورود با رمز عبور</small>
    
    </v-col>
    <amp-input
      is-number
      text="تلفن همراه"
      color="white--text"
      rules="require,phone"
      v-model="form.username"
      background-color="#fff"
      prepend-inner-icon="person"
      cClass="ltr-item small-input"
    />
    <amp-input
      rules="require"
      type="password"
      text="کلمه عبور"
      color="white--text"
      background-color="#fff"
      v-model="form.password"
      prepend-inner-icon="lock"
      cClass="ltr-item small-input success"
    />
    <div class="d-flex justify-center mb-5">
      <amp-captcha v-model="captcha" ref="captchaLogin" />
    </div>
    <div class="px-3 mt-6 mb-4">
    <v-btn block  height="40"  class="rounded-lg"  :disabled="!valid || loading"   :loading="loading"  type="submit" color="white">
    <b class="primary--text" 
       > ورود</b>
       <v-icon color="primary" class="mr-2">
       login
       </v-icon>
    </v-btn>
 
    </div>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    loading: false,
    form: {
      username: "",
      password: "",
    },
    captcha: {},
  }),
  methods: {
    submit() {
      this.loading = true;
      let form = {
        password: this.form.password,
        username: this.$FarsiToEnglishNumber(this.form.username),
      };
      form.captcha_code = this.captcha.captcha_code;
      form.captcha_value = this.$FarsiToEnglishNumber(
        this.captcha.captcha_value
      );
      this.$reqApi("/auth/login", form)
        .then((response) => {
          this.$store.dispatch("auth/login", response).then((data) => {
            this.$router.push("/bpmn-dashboard");
          });
        })
        .catch((error) => {
          this.loading = false;
          this.$refs.captchaLogin.loadCaptcha();
          s;
        });
    },
  },
};
</script>

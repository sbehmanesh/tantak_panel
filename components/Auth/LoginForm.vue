<template>
  <v-form v-model="valid" @submit.prevent="submit()">
    <div class="center-div mt-n5">
      <span class="white--text">ورود با رمز عبور</span>
    </div>
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
    <div class="px-3 mt-6 mb-4">
      <amp-button
        block
        height="40"
        text="ورود"
        icon="login"
        type="submit"
        color="success"
        :loading="loading"
        :disabled="!valid || loading"
      />
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
  }),
  methods: {
    submit() {
      this.loading = true;
      let form = {
        password: this.form.password,
        username: this.$FarsiToEnglishNumber(this.form.username),
      };
      this.$reqApi("/auth/login", form)
        .then((response) => {
          this.$store.dispatch("auth/login", response).then((data) => {
            this.$router.push("/panel");
          });
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>

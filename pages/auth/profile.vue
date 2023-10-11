<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input
            readonly
            text="نام"
            rules="require,fa_chart"
            v-model="form.first_name"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            readonly
            text="نام خانوادگی"
            rules="require,fa_chart"
            v-model="form.last_name"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="رمز عبور"
            type="password"
            class="ltr-item"
            rules="password"
            v-model="form.password"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-upload-file v-model="form.avatar" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            text="ویرایش"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: { modelId: { default: null } },
  data: () => ({
    valid: false,
    loading: false,
    form: {
      avatar: "",
      password: "",
      last_name: "",
      first_name: "",
    },
    user_id: "",
    desserts: [],
    title: "پروفایل",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
    this.loadData();
  },
  methods: {
    submit() {
      this.loading = true;
      this.$reqApi("/user/profile", {
        avatar: this.form.avatar,
        password: this.form.password,
      })
        .then((response) => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.$store.dispatch("auth/nuxtServerInit");
          this.loading = false;
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/auth/user")
        .then(async (response) => {
          this.user_id = response.user.id;
          this.form.avatar = response.user.avatar;
          this.form.password = response.user.password;
          console.log(this.form.password);
          console.log(response.user);
          this.form.last_name = response.user.last_name;
          this.form.first_name = response.user.first_name;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>
<style scoped>
.width_box {
  width: 20.255555555%;
}
</style>

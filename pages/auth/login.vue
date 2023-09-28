<template>
  <v-container fluid class="h-max">
    <v-row dense class="h-max">
      <v-col />
      <v-col class="h-max center-div-justify pt-16">
        <div>
          <div class="text-center logo_bg pb-1 elevation-5">
            <img
              :src="$store.state.logo"
              width="200"
              height="auto"
              class="mt-1"
            />
          </div>
          <div class="text-center mb-4 mt-3">
            <span class="font_20 black--text">ورود به {{ page_title }}</span>
          </div>
          <v-card
            color="#00000000"
            elevation="0"
            :width="$vuetify.breakpoint.mdAndUp ? '800' : '100%'"
          >
            <v-row dense>
              <v-col cols="12" md="6" class="pl-2">
                <v-card class="rounded-lg login-card pa-6">
                  <LoginForm />
                </v-card>
              </v-col>
              <v-col cols="12" md="6" class="pr-2">
                <v-card class="rounded-lg login-card pa-6">
                  <OTPForm />
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
      <v-col />
    </v-row>
  </v-container>
</template>

<script>
import OTPForm from "@/components/Auth/OTPForm.vue";
import LoginForm from "@/components/Auth/LoginForm.vue";
export default {
  layout: "site",
  components: { OTPForm, LoginForm },
  data: () => ({
    active_otp: false,
    title: "ورود به سایت",
    page_title: "",
  }),
  mounted() {
    this.checkDomain();
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    checkDomain() {
      this.page_title = this.$store.state.app_name;
    },
  },
};
</script>

<style scoped>
.login-card {
  background-color: #000000d2;
}
.logo_bg {
  background-image: radial-gradient(circle at 0 0, #ecb71879,#c60a0a46 100%);
  border-radius: 0px 80px 0px 80px;
}
</style>

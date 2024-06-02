<template>
  <v-container fluid class="h-max container-class">
    <v-row dense class="h-max">
      <v-col />
      <v-col class="h-max center-div-justify pt-16">
        <div>
          <div class="text-center logo_bg pb-1 mb-4 ">
            <img
              :src="$store.state.logo"
              width="230"
              height="auto"
              class="mt-1"
            />
            <br>
            <span class="font_18 black--text">ورود به {{ page_title }}</span>
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
  background-color: #000000a6;
}

.container-class{
  background: linear-gradient(to top, #040a3b, #641818d5, #ff6600e7) !important;
}
</style>

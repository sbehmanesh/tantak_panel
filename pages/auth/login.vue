<template>
  <v-container fluid class="h-max container-class pa-8">
    <v-row dense class="h-max align-center justify-center">
     
      <v-col cols="12"  class="text-center">
         <img
              :src="$store.state.logo"
              width="200"
              height="auto"
              class="mt-1"
            />
          <h3>  <span class="font_18 primary--text">ورود به {{ page_title }}</span></h3>
      </v-col>
      <v-col cols="12" md="4" class="mt-1">
      <v-window v-model="activeWindow" >
<v-window-item :value="1" >
<v-card style="" class="pa-5 rounded-xl card-style primary"  >
<LoginForm />
<v-btn @click="activeWindow++"  text small color="white">
<small>
فراموشی | دریافت رمز عبور</small>
<v-icon small class="mr-2"> arrow_back</v-icon>
</v-btn>
</v-card>
</v-window-item >
<v-window-item  :value="2">
<v-card  class="pa-5 rounded-xl card-style primary" >
                  <OTPForm />
                  <v-btn @click="activeWindow++"  text small color="white">
                  <v-icon small class="ml-2"> chevron_right</v-icon>
<small>
 برگشت</small>

</v-btn>

</v-card>
</v-window-item>
</v-window></v-col>
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
    activeWindow: 1,
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

.card-style {
  background: linear-gradient(to top, #183960d7, #1748a2cc, #064e9a) !important;
}
.card-style:hover {
  color: #000000bb;
  cursor: pointer;

  transition: all 0.8s ease !important;
  filter: opacity(1);
}




</style>
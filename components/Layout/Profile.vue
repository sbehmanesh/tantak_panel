<template>
  <v-menu offset-y bottom v-model="menu">
    <template v-slot:activator="{ on, attrs }">
      <div class="center-div">
        <span class="white--text px-2 font_15 font_bold" v-if="$vuetify.breakpoint.mdAndUp">{{ fullname }}</span>
        <img :src="avatar" width="50" height="50" :class="is_mobile ? 'image_profile_mobile my-6 ml-3' : 'image_profile'" v-bind="attrs" v-on="on" />
      </div>
    </template>
    <v-card width="250" class="pa-2">
      <div class="pa-3 primary">
        <v-icon class="pointer" size="22" color="#fff" @click="openSetting()">settings</v-icon>
      </div>
      <div class="d-flex justify-space-between align-center ml-6">
        <div class="font_bold mt-2 mx-3">{{ fullname }}</div>
        <img :src="avatar" width="66" class="border-img mt-n8" />
      </div>
      <div class="text-center d-flex justify-space-between py-2">
        <div class="mx-3 text-right">
          <span v-for="(role, i) in roles" :key="i" class="">{{ role }}</span>
        </div>
      </div>

      <div class="d-flex justify-center">
        <v-btn class="ma-1 rounded-xl" outlined color="success" height="26" width="90" @click="$router.push('/auth/profile')"> پروفایل </v-btn>
        <v-btn class="ma-1 rounded-xl" outlined color="error" height="26" width="90" @click="logout()"> خروج </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    menu: false,
    element: [],
  }),
  computed: {
    avatar() {
      let user = this.$store.state.auth.user
      if (user && typeof user.avatar == 'string') {
        return this.$getImage(user.avatar, false)
      }
      return '/image/login.png'
    },
    fullname() {
      let user = this.$store.state.auth.user
      if (user && typeof user.first_name == 'string') {
        if (typeof user.last_name == 'string') {
          return `${user.first_name} ${user.last_name}`
        }
        return user.first_name
      }
      return '- -'
    },
    roles() {
      let user = this.$store.state.auth.user
      if (user) {
        let roles = user.roles
        let element = []
        // roles.forEach((each) => {
        for (let x = 0; x < roles.length; x++) {
          element.push(roles[x].name)
        }
        return element.join('، ')
        // })
      }
    },
    show_salary() {
      // after test remove return false
      // return false
      if (
        this.$store.state.auth.role.is_sales_manager ||
        this.$store.state.auth.role.is_supervisor ||
        this.$store.state.auth.role.is_sales_consultants ||
        this.$store.state.auth.role.is_bozcoordinator
      ) {
        return true
      } else {
        return false
      }
    },
    is_mobile() {
      return !this.$vuetify.breakpoint.mdAndUp
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    },
    openSetting() {
      this.$router.push('/auth/profile')
    },
  },
}
</script>
<style scoped>
.image_profile {
  border-radius: 50%;
  object-fit: cover;
}
.image_profile_mobile {
  border-radius: 50%;
  position: absolute;
  top: -13px;
  object-fit: cover;
}
</style>

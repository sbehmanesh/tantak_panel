<template>
  <v-app>
    <AppBar
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="drawer"
      class="container_menu"
    />
    <AppBarMobile v-else v-model="drawer"  />
    <MenuDrawer
      v-model="drawer"
      v-if="!$vuetify.breakpoint.mdAndUp"
      class="container_menu"
    />
    <v-main v-if="show_body">
      <v-card class="ma-2 rounded-t-lg">
        <PageTitle />
        <nuxt />
      </v-card>
    </v-main>
    <WaitingLine
      v-if="show_list_call"
      :dialog-show="show_list_call"
      :waiting-line="waiting_line"
      @closeDialog="closeCallerIdDialog('waiting_line')"
      @updateList="caller_id_dialog.item = $event"
    />
    <Customer
      v-if="caller_id_dialog.show"
      :dialog="caller_id_dialog.show"
      :customer="caller_id_dialog.item"
      @closeDialog="closeCallerIdDialog"
    />
    <div class="btn-list" v-if="waiting_line.length > 0">
      <v-badge bordered overlap :content="waiting_line.length">
        <v-btn  @click="openListCals()" depressed color="primary">
          <h1 class="white--text">لیست تماس های در صف</h1>
        </v-btn></v-badge
      >

      <!-- <amp-button text=" color="primary "></amp-button> -->
    </div>
  </v-app>
</template>

<script>
import AppBar from "@/components/Layout/AppBar.vue";
import AppBarMobile from "@/components/Layout/AppBarMobile.vue";
import PageTitle from "~/components/Layout/PageTitle.vue";
import MenuDrawer from "@/components/Layout/MenuDrawer.vue";
import CallerId from "@/components/Call/CallerIdDialog.vue";
import Customer from "@/components/Call/Customer.vue";
import WaitingLine from "@/components/Call/WaitingLine.vue";
export default {
  name: "default",
  components: {
    AppBar,
    AppBarMobile,
    PageTitle,
    MenuDrawer,
    CallerId,
    Customer,
    WaitingLine,
  },
  data: () => ({
    title: "",
    drawer: false,
    show_body: false,
    call_notif: false,
    show_list_call: false,
    waiting_line: [],
    caller_id_dialog: { show: false, item: null },
  }),
  mounted() {
    this.checkAuth();
    this.checkNotification();
    this.callNotif();
  },
  watch: {
    "$store.state.ws.caller_id"(newVall, oldVall) {
  
      if (newVall && (this.show_list_call || this.caller_id_dialog.show)) {
        return;
      }
      if (this.$store.state.ws.caller_id) {
        this.showCallerIdDialog(this.$store.state.ws.call_info);
      }
    },

    "$store.state.ws.caller_phone"(newVall, oldVall) {
      if (Boolean(this.$store.state.ws.caller_phone)) {
        this.waiting_line.push(this.$store.state.ws.call_info);
      }
    },
    "$store.state.auth.action"() {
      if (this.$store.state.auth.action.length > 0) {
        if (this.$checkAccess("brand/delete")) {
          this.$store.dispatch("setting/setBrand");
        }
        if (this.$checkAccess("country_division/index")) {
          this.$store.dispatch("setting/setCountryDivision");
        }
        if (this.$checkAccess("branch/index")) {
          this.$store.dispatch("setting/setBranchCod");
        }
        if (this.$checkAccess("region/index")) {
          this.$store.dispatch("setting/setgetRegion");
        }
        if (this.$checkRole("action/index")) {
          this.$store.dispatch("setting/getActions");
        }
      }
    },
  },
  head() {
    this.checkDomain();
    return {
      title: this.title,
    };
  },

  methods: {
    showBody() {
      this.show_body = true;
      this.$initWS();
      setTimeout(() => {
        // this.$store.dispatch("setting/setgetRegion", {}, { root: true });
        document.getElementById("landing-parent").style.display = "none";
      }, 1000);
    },
    checkAuth() {
      let user = this.$store.state.auth.user;
      document.getElementById("landing-parent").style.display = "flex";
      if (Boolean(user)) {
        this.showBody();
      } else {
        this.$store.dispatch("auth/nuxtServerInit").then(() => {
          this.showBody();
        });
      }
    },
    checkDomain() {
      this.$store.dispatch("setAppName");
      this.$store.dispatch("setLogo");
      this.title = this.$store.state.page_title;
    },
    checkNotification() {
      this.$store.dispatch("notification/getNotif");
    },
    goMessages() {
      var link = document.createElement("a");
      link.href = this.$store.state.chat_url + "/#/messages";
      link.target = "_blanck";
      link.click();
    },
    callNotif() {
      setInterval(() => {
        this.checkNotification();
      }, 900000);
    },
    showCallerIdDialog(data) {
      this.caller_id_dialog.show = true;
      this.caller_id_dialog.item = data;
    },
    closeCallerIdDialog(key = null) {
      if (key == "waiting_line") {
        this.show_list_call = false;
      }
      this.caller_id_dialog.show = false;
      this.caller_id_dialog.item = null;
    },
    openListCals() {
      this.show_list_call = true;
    },
  },
};
</script>
<style scoped>
.fix_btn {
  position: fixed;
  bottom: 12px;
  z-index: 10000;
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
  width: 100%;
  /* max-width: 400px; */
}
.container_menu {
  z-index: 12;
}
.btn-list {
  position: fixed !important;
  bottom: 0 !important;
  left: 40px;
  margin-bottom: 60px;
}
</style>

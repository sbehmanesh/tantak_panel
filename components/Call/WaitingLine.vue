<template>
  <div>
    <v-dialog persistent v-model="dialogShow" width="550">
      <v-card class="pa-3" style="overflow: hidden">
        <v-row class="pa-2">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon size="18"> close </v-icon></v-btn
          >
        </v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <div class="text-center mb-3">
            <v-icon size="43"> groups </v-icon>
            <h1 class="font_12">
              صف انتظار
              <br />
              <small> لیست تماس های گرفته شده با شما </small> <br />
              <small class="grey--text">
                برای مشاهده اطلاعات کاربر روی آن کلیک کنید</small
              >
            </h1>
          </div>
        </v-col>
        <v-row class="my-2">
          <v-col class="py-1" cols="12" md="12" v-for="(x, i) in waitingLine">
            <v-card
              class="elevation-3 pa-3 call-cards"
              outlined
              @click="showInformationsUser(x)"
            >
              <v-row class="pa-3 align-center">
                <v-icon v-if="!x.avatar" size="39" color="grey lighten-2">
                  account_circle
                </v-icon>
                <v-avatar v-else size="34">
                  <v-img :src="$getImage(x.avatar)"></v-img>
                </v-avatar>
                <h1 class="mr-1">
                  <small v-if="x.first_name && x.last_name">
                    {{ x.first_name }} {{ x.last_name }}
                  </small>
                  <small v-else> تماس ناشناس</small>
                  <br />
                  <small class="grey--text" v-if="x.person_type == 'real'">
                    کاربر حقیقی</small
                  >
                  <small v-else class="grey--text"> کاربر حقوقی </small>
                </h1>
                <v-spacer></v-spacer>

                <div class="text-center">
                  <v-progress-circular
                    class="mr-1"
                    :width="1"
                    indeterminate
                    :size="18"
                    color="blue-grey"
                  >
                    <v-icon size="10" color="blue-grey"
                      >call</v-icon
                    ></v-progress-circular
                  >
                  <h1>
                    <small class="blue-grey--text">
                      {{ x.username }}
                    </small>
                  </h1>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="deleteCall(i)">
                  <v-icon size="14" color=""> close </v-icon>
                </v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <Customer
        v-if="caller_id_dialog.show"
        :dialog="caller_id_dialog.show"
        :customer="caller_id_dialog.item"
        @closeDialog="closeCallerIdDialog"
      />
    </v-dialog>
  </div>
</template>
<script>
import Customer from "@/components/Call/Customer.vue";

export default {
  components: {
    Customer,
  },
  props: {
    dialogShow: {
      require: false,
      default: false,
    },
    waitingLine: {
      require: false,
      default: false,
    },
  },
  data: () => ({
    caller_id_dialog: { show: false, item: null },
    loading: false,
    call_list: [],
  }),
  watch: {
    call_list: {
      deep: true,
      handler() {
        setTimeout(() => {
          this.setStyleCards();
        }, 50);
      },
    },
  },
  mounted() {
    this.call_list = this.waitingLine;
    setTimeout(() => {
      this.setStyleCards();
    }, 190);
  },
  methods: {
    showInformationsUser(user) {
      this.caller_id_dialog.show = true;
      this.caller_id_dialog.item = user;
    },
    deleteCall(index) {
      this.loading = true;
      let items = this.call_list;
      if (this.call_list[index].username == this.$store.state.ws.caller_phone) {
        this.$store.dispatch("ws/resetCallerId");
      }
      items.splice(index, 1);
      this.call_list = items;
      this.$emit("updateList", items);
      this.loading = false;
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    closeCallerIdDialog() {
      this.caller_id_dialog.show = false;
      this.caller_id_dialog.item = null;
    },
    setStyleCards() {
      let cards = document.getElementsByClassName("call-cards");
      for (let i = 0; i <= cards.length; i++) {
        const x = cards[i];

        setTimeout(() => {
          x.style.opacity = 1;
          x.style.transition = `all 1.${i}5s ease`;
          x.style.transform = `scale3d(1, 1, 1)`;
        }, 200 * i);
      }
    },
  },
};
</script>
<style scoped>
.call-cards {
  opacity: 0;
  border-right: 1px solid #fd580b56;
  transform: scale3d(0.5, 1, 0.5);
  border-radius: 8px !important;

  background: linear-gradient(
    to right,
    #fd580b41,
    rgb(255, 255, 255),
    rgb(255, 255, 255),
    rgb(255, 255, 255),
    #ffffff
  ) !important;
  transition: all 0.5s ease !important;

}

</style>

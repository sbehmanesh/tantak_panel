<template>
  <v-dialog v-model="showDialog" fullscreen>
    <v-card class="dialog-style">
      <div class="callerid-div">
        <v-row class="pa-5 d-flex align-center mr-2">
          <v-progress-circular  :size="50" color="grey">
            <v-icon size="46" color="grey"
              >circle_notifications</v-icon
            ></v-progress-circular
          >
          <v-col cols="10" class="mr-1">
            <v-row class="pa-0 d-flex align-center pr-3">
              <h1 class="font_14">تماس ورودی جدید</h1>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog">
                <v-icon small color="grey">close</v-icon>
              </v-btn>
            </v-row>
            <CallerIdUserInfo :call="callInfo" />
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import AmpButton from "../Base/AmpButton.vue";
import CallerIdUserInfo from "@/components/Call/CallerIdUserInfo.vue";
import CallerIdUserOpportunity from "@/components/Call/CallerIdUserOpportunity.vue";
import CallerIdUserCallHistory from "@/components/Call/CallerIdUserCallHistory.vue";

export default {
  components: {
    AmpButton,
    CallerIdUserInfo,
    CallerIdUserOpportunity,
    CallerIdUserCallHistory,
  },
  props: {
    item: {
      type: Object,
      require: true,
    },
    showDialog: {
      type: Boolean,
      require: true,
    },
  },
  data: () => ({
    loading: false,
    valid: false,
    timeInterval: null,
    sound: false,
    tab: null,
    opportunity_list: [],
  }),
  watch: {
    "$store.state.ws.call_info": {
      handler(val) {
        this.opportunity_list = [];
      },
      deep: true,
    },
    tab() {
      if (this.tab == "tab-2") {
        this.loadOpportunity();
      }
    },
  },

  computed: {
    callInfo() {


      return this.$store.state.ws.call_info;
    },
  },

  beforeMount() {},
  beforeDestroy() {
    this.closeDialog();
  },
  mounted() {},

  methods: {
    closeDialog() {
      this.$store.dispatch("ws/resetCallerId");
      this.$emit("closeDialog");
    },
    playAudio() {
      this.$refs.audio.play();
      this.timeInterval = setInterval(() => {
        this.$refs.audio.play();
      }, 7000);
    },
    stopAudio() {
      clearInterval(this.timeInterval);
      if (this.$refs.audio) {
        this.$refs.audio.pause();
        this.$refs.audio.currentTime = 0;
      }
    },
    changePlay(flag) {
      this.sound = flag;
    },

    loadOpportunity() {
      if (this.item.customer_id && !this.opportunity_list.length) {
        this.loading = true;
        this.$reqApi("/new-opportunity/list", {
          filters: { IdentityId: this.item.customer_id },
          all: true,
        })
          .then(async (response) => {
            let opp_list = [];
            response.model.data.map((x) => {
              let all_price = 0;
              let recive_confirmed = 0;
              if (
                x.payments &&
                Array.isArray(x.payments) &&
                x.payments.length > 0
              ) {
                for (let i = 0; i < x.payments.length; i++) {
                  const element = x.payments[i];
                  all_price += Number(element.price);
                  if (
                    element.type == "daryaft" &&
                    element.status == "confirmed"
                  ) {
                    recive_confirmed += Number(element.price);
                  }
                }
              }
              let text =
                "  تاریخ ایجاد : " +
                this.$toJalali(x.created_at, "YYYY-MM-DD", " jYYYY/jMM/jDD") +
                "| بیعانه : " +
                this.$price(x.FBOVZDeposit) +
                " ریال ";
              if (x.FBOVZSalesConsultant_advisor) {
                text +=
                  "مشاور: " + x.FBOVZSalesConsultant_advisor.full_name + "|";
              }

              if (x.FBOVZSalesManager_modir_forush) {
                text +=
                  " مدیر فروش: " +
                  x.FBOVZSalesManager_modir_forush.full_name +
                  "|";
              }
              if (x.FBOVZSalesManager_modir_forush) {
                text += " هماهنگ کننده: " + x.bozcoordinator_role.full_name;
              }

              opp_list.push({
                text: text,
                value: x._id,
                coordinator: x.bozcoordinator_role,
                all_price: all_price,
                recive_confirmed: recive_confirmed,
                identity: x.Identity,
              });
            });
            this.opportunity_list = opp_list;
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.callerid-div {
  position: fixed;
  bottom: 0;
  left: 30px;
  margin-bottom: 30px;
  background-color: #fcfcfc;
  border: 1px solid #ffffff;
  border-radius: 10px !important;
  width: 480px;
  z-index: 9;
}
.cller-tabs {
  border-top: 1px solid gainsboro;
}
.dialog-style {
  background-color: #00000060 !important;
}
</style>

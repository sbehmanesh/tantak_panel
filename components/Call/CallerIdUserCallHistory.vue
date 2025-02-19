<template>
  <div>
    <v-col cols="12">
      <amp-select
        first-select
        v-if="!loading"
        text="آخرین تماس های داخلی شما با شماره"
        v-model="selected_phone"
        :items="userPhones"
      ></amp-select>

      <div class="mt-3" v-for="(c, index) in call_list" :key="index">
        <v-icon color="warning" v-if="c.call_type == 'in'">call_made</v-icon>
        <v-icon color="green" v-else>call_received</v-icon>
        |
        {{
          $toJalali(c.created_at, "YYYY-MM-DD HH:mm:ss", "jYYYY/jMM/jDD HH:mm")
        }}
        |{{ c.disposition }} | {{ c.call_time }}
      </div>
      <div class="mt-4 mb-4" v-if="!loading && !call_list.length">
        تاکنون تماسی برای این شماره مشتری ثبت نشده است.
      </div>
      <v-skeleton-loader
        :loading="loading"
        type="list-item-two-line"
        v-if="loading"
      ></v-skeleton-loader>
    </v-col>
  </div>
</template>

<script>
import AmpSection from "../Base/AmpSection.vue";
import AmpSelect from "../Base/AmpSelect.vue";
export default {
  components: { AmpSection, AmpSelect },
  props: {},
  data: () => ({
    loading: false,
    valid: false,
    call_list: [],
    selected_phone: "",
  }),
  computed: {
    callInfo() {
      return this.$store.state.ws.call_info;
    },
    userPhones() {
      let phones = [];
      
      // if (this.$store.state.ws.call_info) {
      //   let user_phones =
      //     this.$store.state.ws.call_info.user_extra_phone_numbers;
      //   for (let i = 0; i < user_phones.length; i++) {
      //     phones.push({ text: user_phones[i], value: user_phones[i] });
      //   }
      // }
      if (!phones.length) {
        phones.push({ text: this.callInfo.phone, value: this.callInfo.phone });
      }
      return phones;
    },
  },

  watch: {
    "$store.state.ws.call_info": {
      handler(val) {
        this.call_list = [];
      },
      deep: true,
    },
    selected_phone() {
      this.loadCallHistory();
    },
    unKnownUser() {
      if (this.call.customer_first_name || this.call.customer_last_name) {
        return false;
      }
      return true;
    },
  },

  beforeMount() {},
  beforeDestroy() {},
  mounted() {
    this.selected_phone = this.callInfo.phone;
    this.loadCallHistory();
  },

  methods: {
    loadCallHistory() {
      if (this.selected_phone) {
        this.loading = true;
        this.call_list = [];

        this.$reqApi("/mehrkav-voip/caller-id-report", {
          issabel_server_en_name: this.callInfo.issabel_server_en_name,
          range: this.callInfo.rang,
          phone: this.selected_phone,
        })
          .then((response) => {
            response.model.slice(0, 8).map((x) => {
              let user_range = this.callInfo.rang;

              this.call_list.push({
                created_at: x.created_at,
                call_time: this.getCallTime(x.billsec),
                disposition: this.getStatus(x.disposition),
                call_type: x.cnum == user_range ? "in" : "out",
              });
            });
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    getCallTime(billsec) {
      const seconds = parseInt(billsec);
      if (Number.isInteger(seconds)) {
        if (seconds < 1) {
          return "1 ثانیه";
        } else if (seconds < 60) {
          return seconds + " ثانیه";
        } else {
          return Math.round(parseInt(seconds / 60)) + " دقیقه";
        }
      } else return "-";
    },
    getStatus(disposition) {
      const list = this.$store.state.static.issabel_status;
      for (let i = 0; i < list.length; i++) {
        if (list[i].value == disposition) {
          return list[i].text;
        }
      }
      return "-";
    },
  },
};
</script>
<style scoped></style>

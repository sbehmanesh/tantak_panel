<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="1200" persistent>
      <v-card style="overflow: hidden" class="pa-5">
        <v-row class="pa-4 align-center">
          <h1 class="font_20">لیست کل تماس مجدد های شما</h1>
          <v-spacer></v-spacer>
          <v-btn text icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-row>

        <v-col cols="12" md="12" class="center-div">
          <v-chip
            dark
            label
            class="ma-2 px-3 mb-4"
            color="blue-grey"
            v-for="item in items"
            :key="item.key"
            @click="tab = item.key"
            :outlined="tab != item.key"
          >
            {{ item.text }}
          </v-chip>
          <v-divider></v-divider>
        </v-col>
        <v-row v-if="!loading" class="align-center my-3">
          <v-col v-for="(x, i) in call_back_list" :key="i" cols="12" md="6">
            <v-card
              :class="show_cards ? ' befor-style' : 'card-style '"
              :color="x.color == 'green' ? '#f6fff5' : ''"
              outlined
              class="pa-5 elevation-2"
              :style="
                Boolean(x.color) ? `border-right:2px solid ${x.color}` : ''
              "
            >
              <div v-if="Boolean(x.color)">
                <v-icon x-small :color="`${x.color}`">
                  fiber_manual_record
                </v-icon>
                <span class="font_13" v-if="x.color == 'red'"
                  >زمان تعیین از زمان موعود رد شده</span
                >
                <span class="font_13" v-if="x.color == 'green'"
                  >زمان موعود فرا رسیده</span
                >
              </div>

              <v-row class="align-center">
                <v-col cols="12" md="6">
                  <div>
                    <h1 class="grey--text">
                      <v-icon color="grey" small> person </v-icon>
                      <small
                        v-if="
                          Boolean(x.user_first_name) &&
                          Boolean(x.user_last_name)
                        "
                      >
                        {{ x.user_first_name }} {{ x.user_last_name }}
                      </small>
                      <small v-else>
                        {{ $showUsername(x.user_username) }}
                      </small>
                    </h1>
                    <h1 v-if="!Boolean(x.color) && Boolean(x.violation_time)">
                      <small>
                        {{ x.violation_time }} روز مانده به تاریخ مشخص شده
                      </small>
                    </h1>
                    <h1>
                      <small>
                        شناسه پیام
                        {{ x.messageid }}
                      </small>
                      <br />

                      <small>
                        زمان تعیین شده برای تماس مجدد :‌
                        {{
                          $toJalali(
                            x.call_again_time,
                            "YYYY-MM-DD",
                            "jYYYY/jMM/jDD"
                          )
                        }}
                      </small>
                    </h1>
                    <h1 v-if="x.status == 'call_back'" class="font_12">
                      * تماس مجدد
                    </h1>
                    <h1 v-if="x.status == 'delayed'" class="font_12">
                      * معوقه
                    </h1>
                  </div>
                </v-col>
                <v-col cols="12" md="6" class="">
                  <v-row class="pa-2 justify-center">
                    <v-btn
                      outlined
                      color="success"
                      small
                      text
                      class="ma-2"
                      @click="openCallDialog(x.user_username)"
                    >
                      تماس
                    </v-btn>
                    <v-btn
                      outlined
                      color="info"
                      small
                      text
                      class="ma-2"
                      @click="changeStatus(x)"
                      >تغییر وضعیت
                    </v-btn>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-divider></v-divider>
                  <v-row class="justify-space-between mt-3">
                    <v-btn
                      outlined
                      color="blue-grey"
                      small
                      text
                      class="ma-2"
                      @click="manageOpenDialogs(x , 'basket')"
                    >
                      ثبت فاکتور
                    </v-btn>
                    <v-btn
                      outlined
                      color="blue-grey"
                      small
                      text
                      class="ma-2"
                      @click="manageOpenDialogs(x , 'history_change_status')"
                      >تاریخچه تغییر وضعیت
                    </v-btn>
                    <v-btn
                      outlined
                      color="blue-grey"
                      small
                      text
                      class="ma-2"
                      @click="manageOpenDialogs(x, 'customer')"
                    >
                      اطلاعات مشتری
                    </v-btn>
                    <v-btn
                      outlined
                      color="blue-grey"
                      small
                      text
                      class="ma-2"
                      @click="manageOpenDialogs(x, 'history_refrall')"
                    >
                      تاریخچه ارجاعات
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <div class="my-15 d-flex justify-center align-center" v-if="loading">
          <v-progress-circular
            size="40"
            width="5"
            indeterminate
            color="blue-grey"
          >
          </v-progress-circular>
        </div>

        <ChangeStatus
          v-if="dialog_change_status.show"
          :dialog_change_status="dialog_change_status"
          :messageInfo="message_info"
          :userInfo="user_info"
          @relod="relod"
        />
        <CallDialog
          v-if="show_call_dialog"
          :dialog="show_call_dialog"
          :username="username"
          @closeDialog="show_call_dialog = false"
        />
        <History
          v-if="dialog_history.show"
          :DialogHistory="dialog_history"
          :MessageId="message_id"
        />
        <Customer
          v-if="dialog_customer.show"
          :DialogCustomer="dialog_customer"
          :customer="customer"
        />
        <BasketDialog
          v-if="dialog_basket.show"
          :BasketDialog="dialog_basket"
          :user_basket="user_basket"
        />

        <MessageLog
          v-if="dialog_message_log.show"
          :dialogMessageLog="dialog_message_log"
          :message_id="message_id"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ChangeStatus from "~/components/CallCenter/ChangeStatus.vue";
import CallDialog from "~/components/CallCenter/CallDialog.vue";

import Customer from "~/components/CallCenter/Customer.vue";
import History from "~/components/NewCallCenter/History.vue";
import Refer from "~/components/NewCallCenter/Refer.vue";
import MessageLog from "~/components/NewCallCenter/MessageLog.vue";
import BasketDialog from "@/components/NewCallCenter/BasketDialog.vue";
import CallBackLogs from "@/components/CallCenter/CallBackLogs.vue";

export default {
  components: {
    ChangeStatus,
    CallDialog,
    Customer,
    History,
    Refer,
    MessageLog,
    BasketDialog,
    CallBackLogs,
  },
  props: {
    dialog: {
      require: false,
      default: false,
    },
    now: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      call_back_list: [],
      status_items: [
        { text: "تماس مجدد", value: "call_back", icon: "", count: "" },
        { text: "معوقه", value: "delayed", icon: "", count: "" },
      ],
      dialog_change_status: { show: false, items: null },
      user_info: {},
      customer: {},
      user_basket: {},
      username: "",
      message_info: {},
      totla_data: [],
      loading: true,
      dialog_customer: { show: false, items: null },
      dialog_basket: { show: false, items: null },
      dialog_message_log: { show: false, items: null },
      dialog_change_status: { show: false, items: null },
      dialog_Refer: { show: false, items: null },
      dialog_history: {
        show: false,
        items: null,
      },
      message_id: "",
      show_cards: true,
      show_call_dialog: false,
      items: [
        { text: "همه", key: "all" },
        { text: "امروز", key: "now" },
        { text: "فرا نرسیده", key: "before_now" },
        { text: "رد شده", key: "rejected" },
      ],
      tab: "all",
    };
  },
  watch: {
    loading() {
      if (!Boolean(this.loading)) {
        setTimeout(() => {
          this.show_cards = false;
        }, 150);
      }
    },
    tab() {
      this.loading = true;
      let data = JSON.parse(JSON.stringify(this.totla_data));
      if (this.tab == "all") {
        this.call_back_list = data;
      }
      if (this.tab == "now") {
        this.call_back_list = data.filter((x) => x.color == "green");
      }

      if (this.tab == "before_now") {
        this.call_back_list = data.filter(
          (x) => Boolean(x.violation_time) && !Boolean(x.color)
        );
      }
      if (this.tab == "rejected") {
        this.call_back_list = data.filter((x) => x.color == "red");
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$reqApi("/message", {
        row_number: 4000,
      })
        .then((res) => {
          let data = res.model.data.filter(
            (x) => x.status == "call_back" || x.status == "delayed"
          );
          let items = [];
          let now_date = this.$toJalali(
            this.now,
            "YYYY-MM-DD",
            "jYYYY/jMM/jDD"
          );
          if (Boolean(data) && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              const x = data[i];
              x["color"] = "";
              x["violation_time"] = "";
              let call_back_date = "";
              if (Boolean(x.call_again_time)) {
                call_back_date = this.$toJalali(
                  x.call_again_time,
                  "YYYY-MM-DD",
                  "jYYYY/jMM/jDD"
                );
              }

              let time1 = new Date(call_back_date).getTime();
              let time2 = new Date(now_date).getTime();
              if (time1 == time2) {
                x.color = "green";
              } else if (time1 < time2) {
                x.color = "red";
              }

              let milliseconds = Math.abs(time1 - time2);

              let violation_day = Math.floor(
                milliseconds / (1000 * 60 * 60 * 24)
              );
              x.violation_time = violation_day;

              items.push(x);
            }
          }
          this.totla_data = items.sort((a, b) => {
            a.created_at - b.created_at;
          });
          this.call_back_list = this.totla_data;
          let just_call_back = this.totla_data.filter(
            (y) => y.status == "call_back"
          );
          let just_delayed = this.totla_data.filter(
            (y) => y.status == "delayed"
          );
          this.status_items[0].count = just_call_back.length;
          this.status_items[1].count = just_delayed.length;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    relod() {
      this.getList();
      this.$emit("relod");
    },
    changeStatus(item) {
      this.user_info = item.user;
      this.message_info = item;
      this.dialog_change_status.show = true;
    },
    openCallDialog(username) {
      this.show_call_dialog = true;
      this.username = username;
    },
    manageOpenDialogs(item, key) {
      switch (key) {
        case "history_refrall":
          this.message_id = item.id;
          this.dialog_history.show = true;
          break;
        case "customer":
          this.customer = item.user;
          this.dialog_customer.show = true;
          break;
        case "basket":
          this.user_basket = item.user;
          this.dialog_basket.show = true;
          break;    
           case "history_change_status":
           this.dialog_message_log.show = true;
           this.message_id = item.id;
          break;

        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.befor-style {
  filter: brightness(98%);
  transition: all 1.8s ease !important;
  animation-timing-function: cubic-bezier(0.1, -0.6, 0.2, 0);
  filter: opacity(0.3);
}
.card-style {
  filter: brightness(98%);
  transition: all 0.9s ease !important;
  animation-timing-function: cubic-bezier(0.1, -0.6, 0.2, 0);
  filter: opacity(0.9);
}
.card-style:hover {
  filter: opacity(1);
  filter: drop-shadow(0 0 0.7rem rgba(77, 76, 76, 0.466));
  background-color: rgb(241, 241, 241);
  transition: all 0.4s ease;
}
</style>

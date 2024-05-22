<template>
  <div>
    <v-row class="d-flex justify-center px-4">
      <v-col col="12" md="10">
        <v-expansion-panels variant="poput" v-model="panel" accordion>
          <v-expansion-panel class="class-bg">
            <v-expansion-panel-header dark expand-icon="published_with_changes">
              <span class="font_18 white--text"> برسی پیام ها </span>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pb-3 px-8">
              <Refer
                :messageInfo="message_info"
                :userInfo="user_info"
                :selected_item="selected_item"
                @relod="relod"
                @clearBox="clearBox"
                @setHeaders="setHeaders($event)"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-row class="d-flex justify-center pt-4">
        <v-chip
          dark
          label
          class="ma-2"
          :color="tab != item.value ? 'grey ' : 'grey darken-1'"
          v-for="(item, key) in items"
          :key="key"
          @click="selectItem(item)"
          :outlined="tab != item.value"
        >
          {{ item.text }}
        </v-chip>
      </v-row>
    </v-col>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="12">
        <BaseTable
          url="/message"
          :headers="headers"
          :createUrl="create_url"
          :autoUpdate="update_url"
          :autoDelete="delete_url"
          :BTNactions="btn_actions"
          :filters="filters"
          v-model="selected_item"
          ref="refreshMessage"
        />
        <History
          v-if="dialog_history.show"
          :DialogHistory="dialog_history"
          :MessageId="id_message"
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
        <ChangeStatus
          v-if="dialog_change_status.show"
          :dialog_change_status="dialog_change_status"
          :messageInfo="message_info"
          :userInfo="user_info"
          @relod="relod"
        />
        <MessageLog
          v-if="dialog_message_log.show"
          :dialogMessageLog="dialog_message_log"
          :message_id="message_id"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import ChangeStatus from "~/components/CallCenter/ChangeStatus.vue";
import Customer from "~/components/CallCenter/Customer.vue";
import History from "~/components/NewCallCenter/History.vue";
import Refer from "~/components/NewCallCenter/Refer.vue";
import MessageLog from "~/components/NewCallCenter/MessageLog.vue";
import BasketDialog from "@/components/NewCallCenter/BasketDialog.vue";
export default {
  components: { BaseTable, History, ChangeStatus, Customer, Refer, MessageLog, BasketDialog },
  data: () => ({
    headers: [],
    panel: 1,
    user: [],
    tab: "all",
    items: [
      { text: "همه پیام ها", value: "all" },
      { text: "فعال ( قابل برسی )", value: "active" },
      { text: "غیر فعال", value: "in_activ" },
    ],
    dialog_history: {
      show: false,
      items: null,
    },
    dialog_customer: { show: false, items: null },
    dialog_basket: { show: false, items: null },
    dialog_message_log: { show: false, items: null },
    dialog_change_status: { show: false, items: null },
    dialog_Refer: { show: false, items: null },
    filters: {},
    user_info: {},
    selected_item: [],
    user_info: {},
    customer: {},
    user_basket: {},
    btn_actions: [],
    create_url: "",
    message_info: {},
    update_url: "",
    delete_url: "",
    message_id: "",
    title: "لیست پیام ها",
  }),
  beforeMount() {
    if (this.$store.state.auth.action.indexOf("messages/insert") > -1) {
      this.create_url = "/new-call-center/insert";
    }
    if (this.$store.state.auth.action.indexOf("messages/update") > -1) {
      this.update_url = "/new-call-center";
    }
    if (this.$store.state.auth.action.indexOf("messages/delete") > -1) {
      this.delete_url = "/message/delete";
    }
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "ارسال کننده",
        value: (body) => {
          if (body.user) {
            if (
              this.$checkRole(this.$store.state.auth.role.admin_id) ||
              this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
            ) {
              return body.user.username;
            } else {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "گیرنده",
        value: "receptor",
      },
      {
        text: "شناسه پیام",
        value: "messageid",
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_message,
      },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.step_message,
      },

      {
        filterable: false,
        text: "پیام",
        filterCol: "message",
        type: "tooltip",
        function: (body) => {
          if (body.message) {
            return body.message;
          }
        },
        value: (body) => {
          if (typeof body.message == "string") {
            if (body.message.length < 25) {
              return body.message;
            }
            return body.message.slice(0, 25) + "...";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        color: "primary",
        icon: "history",
        text: "تاریخچه",
        fun: (body) => {
          if (body.id) {
            this.dialog_history.show = true;
            this.id_message = body.id;
          }
        },
      },

      {
        icon: "published_with_changes",
        color: "orange",
        text: "برسی ",
        fun: (body) => {
          this.dialog_change_status.show = true;
          this.message_info = body;
          this.user_info = body.user;
        },
        show_fun: (body) => {
          if (
            this.$checkRole(this.$store.state.auth.role.oprator_id) &&
            body.step == "supervisor_to_operator" &&
            body.status != "done"
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        icon: "assignment_ind",
        color: "info",
        text: "اطلاعات مشتری",
        fun: (body) => {
          this.dialog_customer.show = true;
          this.customer = body.user;
        },
      },
      {
        icon: "fact_check",
        color: "grey darken-3",
        text: "ثبت فاکتور",
        fun: (body) => {
          this.dialog_basket.show = true;
          this.user_basket = body.user;
          console.log("this.user_basket --> " , this.user_basket);
        },
      },
      {
        icon: "history",
        color: "red darken-2",
        text: "تاریخچه تغییر وضعیت ",
        fun: (body) => {
          this.dialog_message_log.show = true;
          this.message_id = body.id;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },

  methods: {
    relod() {
      this.$refs.refreshMessage.getDataFromApi();
      this.selected_item = [];
    },
    setHeaders(event) {
      let header = [];
      if (event && Boolean(event)) {
        header = [
          {
            text: "",
            width: "10px",
            type: "checkbox",
            disableSort: true,
            filterable: false,
            show_box: (body) => {
              let show = false;

              if (Boolean(event)) {
                if (
                  (this.$checkRole(this.$store.state.auth.role.admin_id) ||
                    this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) &&
                  (body.step == "init" || body.step == "supervisor_to_manager")
                ) {
                  show = true;
                } else if (
                  this.$checkRole(this.$store.state.auth.role.superviser_id) &&
                  (body.step == "manager_to_supervisor" ||
                    body.step == "operator_to_supervisor")
                ) {
                  show = true;
                } else if (
                  this.$checkRole(this.$store.state.auth.role.oprator_id) &&
                  body.step == "supervisor_to_operator" &&
                  body.status != "done"
                ) {
                  show = true;
                }
              } else {
                show = false;
              }

              return show;
            },
          },
          {
            text: "زمان ثبت",
            filterType: "date",
            filterCol: "created_at",
            value: (body) => {
              if (body.created_at) {
                return this.$toJalali(body.created_at);
              }
              return "";
            },
          },
          {
            text: "ارسال کننده",
            value: (body) => {
              if (body.user) {
                if (
                  this.$checkRole(this.$store.state.auth.role.admin_id) ||
                  this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
                ) {
                  return body.user.username;
                } else {
                  let start = body.user.username.slice(0, 3);
                  let end = body.user.username.slice(-4);

                  let phone_number = end + "****" + start;
                  return phone_number;
                }
              }
            },
          },
          {
            text: "گیرنده",
            value: "receptor",
          },
          {
            text: "شناسه پیام",
            value: "messageid",
          },
          {
            text: "وضعیت",
            value: "status",
            filterType: "select",
            items: this.$store.state.static.status_message,
          },
          {
            text: "مرحله",
            value: "step",
            filterType: "select",
            items: this.$store.state.static.step_message,
          },

          {
            filterable: false,
            text: "پیام",
            filterCol: "message",
            type: "tooltip",
            function: (body) => {
              if (body.message) {
                return body.message;
              }
            },
            value: (body) => {
              if (typeof body.message == "string") {
                if (body.message.length < 25) {
                  return body.message;
                }
                return body.message.slice(0, 25) + "...";
              }
            },
          },
        ];
      } else {
        header = [
          {
            text: "زمان ثبت",
            filterType: "date",
            filterCol: "created_at",
            value: (body) => {
              if (body.created_at) {
                return this.$toJalali(body.created_at);
              }
              return "";
            },
          },
          {
            text: "ارسال کننده",
            value: (body) => {
              if (body.user) {
                if (
                  this.$checkRole(this.$store.state.auth.role.admin_id) ||
                  this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
                ) {
                  return body.user.username;
                } else {
                  let start = body.user.username.slice(0, 3);
                  let end = body.user.username.slice(-4);

                  let phone_number = end + "****" + start;
                  return phone_number;
                }
              }
            },
          },
          {
            text: "گیرنده",
            value: "receptor",
          },
          {
            text: "شناسه پیام",
            value: "messageid",
          },
          {
            text: "وضعیت",
            value: "status",
            filterType: "select",
            items: this.$store.state.static.status_message,
          },
          {
            text: "مرحله",
            value: "step",
            filterType: "select",
            items: this.$store.state.static.step_message,
          },

          {
            filterable: false,
            text: "پیام",
            filterCol: "message",
            type: "tooltip",
            function: (body) => {
              if (body.message) {
                return body.message;
              }
            },
            value: (body) => {
              if (typeof body.message == "string") {
                if (body.message.length < 25) {
                  return body.message;
                }
                return body.message.slice(0, 25) + "...";
              }
            },
          },
        ];
      }

      this.headers = header;
    },
    clearBox() {
      this.selected_item = [];
      this.panel = 1;
    },
    selectItem(item) {
      this.tab = item.value;
      let filters = {};

      if (
        this.$checkRole(this.$store.state.auth.role.admin_id) ||
        this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
      ) {
        if (this.tab == "active") {
          filters["step"] = {
            op: "in",
            value: ["supervisor_to_manager", "init"],
          };
        }
        if (this.tab == "in_activ") {
          filters["step"] = {
            op: "in",
            value: [
              "done",
              "operator_to_supervisor",
              "supervisor_to_operator",
              "manager_to_supervisor",
              "close",
            ],
          };
        }
      }
      if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
        if (this.tab == "active") {
          filters["step"] = {
            op: "in",
            value: ["manager_to_supervisor", "operator_to_supervisor"],
          };
        }
        if (this.tab == "in_activ") {
          filters["step"] = {
            op: "in",
            value: ["done", "supervisor_to_operator"],
          };
        }
      }
      if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
        if (this.tab == "active") {
          filters["step"] = {
            op: "=",
            value: "supervisor_to_operator",
          };
        }
        if (this.tab == "in_activ") {
          filters["step"] = {
            op: "!=",
            value: "supervisor_to_operator",
          };
        }
      }
      this.filters = filters;
    },
  },
};
</script>
<style scoped>
.class-bg {
  background: linear-gradient(to left, #384e58e7, #607d8baf, #8597a1cc);
}
</style>

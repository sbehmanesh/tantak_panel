<template>
  <div>
    <v-row class="d-flex justify-center px-4">
      <v-col
        col="12"
        md="10"
        class="mt-5"
        v-if="!$checkRole(this.$store.state.auth.role.admin_id)"
      >
        <v-expansion-panels variant="poput" v-model="panel" accordion>
          <v-expansion-panel class="class-bg">
            <v-expansion-panel-header dark expand-icon="published_with_changes">
              <div>
                <span class="font_18 white--text"> برسی پیام ها </span>
              </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pb-3 px-8">
              <Refer
                :messageInfo="message_info"
                :userInfo="user_info"
                :selected_item="selected_item"
                @relod="relod"
                @count="setCount($event)"
                @clearBox="clearBox"
                @setHeaders="setHeaders($event)"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-col cols="12" v-if="!$checkRole(this.$store.state.auth.role.admin_id)">
      <v-row class="d-flex justify-center pt-4">
        <v-chip
          dark
          label
          class="ma-2"
          :color="tab != item.value ? 'grey' : 'grey darken-1'"
          v-for="(item, key) in items"
          :key="key"
          @click="selectItem(item)"
          :outlined="tab != item.value"
        >
          {{ item.text }}
        </v-chip>
      </v-row>
      <v-row
        cols="12"
        class="center-div mt-5"
        v-if="!Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))"
      >
        <v-chip
          dark
          label
          class="ma-2 px-3"
          color="teal"
          v-for="item in items_time"
          :key="item.key"
          @click="tab_time = item.key"
          :outlined="tab_time != item.key"
        >
          {{ item.text }}
        </v-chip>
      </v-row>
    </v-col>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="12">
        <BaseTable
          v-if="show_tabale"
          url="/message"
          @getData="getTotalItems($event)"
          :headers="headers"
          :createUrl="create_url"
          :autoUpdate="update_url"
          :autoDelete="delete_url"
          :BTNactions="btn_actions"
          :extraBtn="extra_btn"
          :filters="filters"
          :rowColor="rowColor"
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
          :message-id="factor_message_id"
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
        <CallBackLogs
          @closeDialog="calls_back = false"
          v-if="calls_back"
          :dialog="calls_back"
          @relod="relod"
          :now="now"
        />
        <MessageExcel
          :dialog="excel_message"
          v-if="excel_message"
          url-list="/message"
          @closeDialog="excel_message = false"
        />
        <RefralLogExcel
          :dialog="refral_logs"
          v-if="refral_logs"
          @closeDialog="refral_logs = false"
        />
        <CollaborationManagement
          :dialog="management"
          v-if="management"
          @closeDialog="management = false"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
let jmoment = require("moment");
import BaseTable from "~/components/DataTable/BaseTable";
import ChangeStatus from "~/components/CallCenter/ChangeStatus.vue";
import Customer from "~/components/CallCenter/Customer.vue";
import History from "~/components/NewCallCenter/History.vue";
import Refer from "~/components/NewCallCenter/Refer.vue";
import MessageLog from "~/components/NewCallCenter/MessageLog.vue";
import BasketDialog from "@/components/NewCallCenter/BasketDialog.vue";
import CallBackLogs from "@/components/CallCenter/CallBackLogs.vue";
import MessageExcel from "@/components/NewCallCenter/MessageExcel.vue";
import RefralLogExcel from "@/components/NewCallCenter/RefralLogExcel.vue";
import CollaborationManagement from "@/components/NewCallCenter/CollaborationManagement.vue";

export default {
  components: {
    BaseTable,
    History,
    ChangeStatus,
    Customer,
    Refer,
    MessageLog,
    BasketDialog,
    CallBackLogs,
    MessageExcel,
    RefralLogExcel,
    CollaborationManagement,
  },
  data: () => ({
    headers: [],
    extra_btn: [],
    panel: 1,
    calls_back: false,
    excel_message: false,
    refral_logs: false,
    management: false,
    show_tabale: true,
    total_items: [],
    user: [],
    now: "",
    tab: "all",
    items: [
      { text: "همه پیام ها", value: "all" },
      { text: "فعال ( قابل برسی )", value: "active" },
      { text: "غیر فعال", value: "in_activ" },
    ],
    tab_time: "all",
    items_time: [
      { text: "همه", key: "all" },
      { text: "کارهای امروز من", key: "my_today_work" },
      { text: "کارهای دارای تاخیر", key: "my_late_work" },
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
    factor_message_id: "",
    title: "لیست پیام ها",
  }),
  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
    if (this.$route.query.filter == "my_today_work") {
      this.tab_time = "my_today_work";
    }
    if (this.$route.query.filter == "my_late_work") {
      this.tab_time = "my_late_work";
    }
    if (this.$route.query.filter == "all") {
      this.tab_time = "all";
    }
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
        text: "زمان ثبت پیام",
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
        text: "آخرین تخصیص",
        filterType: "date",
        filterCol: "allocation_at",
        value: (body) => {
          if (body.allocation_at) {
            return this.$toJalali(body.allocation_at);
          }
          return "";
        },
      },
      { text: "نام کاربر", value: "user_first_name" },
      { text: "نام خانوادگی", value: "user_last_name" },

      {
        text: "شماره ارسال کننده",
        type: "phone",
        filterCol: "user_username",
        value: (body) => {
          if (body.user_username) {
            return body.user_username;
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
            body.status != "done" &&
            body.status != "regect"
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
          this.factor_message_id = body.id;
        },
        show_fun: () => {
          if (
            Boolean(
              this.$store.state.auth.action.indexOf(
                "basket/show_btn_in_call_center"
              ) > -1
            )
          ) {
            return true;
          } else {
            return this.factor_message_id;
          }
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
    this.extra_btn = [
      {
        color: "blue-grey",
        icon: "call",
        text: "تماس مجدد",
        fun: (body) => {
          this.calls_back = true;
        },
        show_fun: (body) => {
          if (
            Boolean(this.$checkRole(this.$store.state.auth.role.admin_id)) ||
            Boolean(this.$checkRole(this.$store.state.auth.role.oprator_id))
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    if (!Boolean(this.$checkRole(this.$store.state.auth.role.oprator_id))) {
      this.extra_btn.push({
        text: "خروجی اکسل",
        icon: "download",
        color: "teal ",
        fun: (body) => {
          this.excel_message = true;
        },
      });
    }

    if (
      Boolean(this.$store.state.auth.action.indexOf("messages/insert") > -1)
    ) {
      if (
        Boolean(this.$checkRole(this.$store.state.auth.role.superviser_id)) ||
        Boolean(
          this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
        ) ||
        Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))
      ) {
        this.extra_btn.push({
          text: "گزارشات",
          icon: "pending_actions",
          color: "info ",
          fun: () => {
            this.refral_logs = true;
          },
        });
      }
    }
    if (
      this.$checkRole(this.$store.state.auth.role.admin_id) ||
      this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {
      this.extra_btn.push({
        text: " مدیریت همکاری",
        icon: "manage_accounts",
        color: "primary ",
        fun: () => {
          this.management = true;
        },
      });
    }
    this.$store.dispatch("setPageTitle", this.title);
  },
  watch: {
    tab_time() {
      let filter = {};
      switch (this.tab_time) {
        case "all":
          this.filter_time = {};
          break;
        case "my_today_work":
          this.filter_time = {
            allocation_at: {
              op: "=",
              value: (this.now = jmoment().format("YYYY-MM-DD")),
            },
          };
          break;
        case "my_late_work":
          this.filter_time = {
            allocation_at: {
              op: "<",
              value: jmoment(this.now).add(-1, "days").format("YYYY-MM-DD"),
            },
          };
          break;
      }
      this.filters = { ...this.filters, ...this.filter_time };
    },
  },
  methods: {
    relod() {
      this.$refs.refreshMessage.getDataFromApi();
      this.selected_item = [];
    },
    setHeaders(event) {
      this.show_tabale = false;

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
                    this.$checkRole(
                      this.$store.state.auth.role.admin_call_center_id
                    )) &&
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
                return body.user.username;
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
      setTimeout(() => {
        this.show_tabale = true;
      }, 500);
      this.headers = header;
    },
    clearBox() {
      this.selected_item = [];
      this.panel = 1;
    },
    getTotalItems(event) {
      this.total_items = event.model.data;
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
      this.filters = { ...filters, ...this.filter_time };
    },
    rowColor(body) {
      if (body.item.status == "call_again_time") {
        let time = this.$toJalali(
          body.call_again_time,
          "YYYY-MM-DD",
          "jYYYY/jMM/jDD"
        );
        if (this.now == time) {
          return "orange lighten-4";
        }
      }
    },
    setCount(event) {
      if (event == 0) {
        this.selected_item = [];
        return;
      }
      let items = [];
      this.selected_item = [];
      for (let i = 0; i < this.total_items.length; i++) {
        const body = this.total_items[i];
        if (Boolean(event)) {
          if (
            (this.$checkRole(this.$store.state.auth.role.admin_id) ||
              this.$checkRole(
                this.$store.state.auth.role.admin_call_center_id
              )) &&
            (body.step == "init" || body.step == "supervisor_to_manager")
          ) {
            items.push(body);
          } else if (
            this.$checkRole(this.$store.state.auth.role.superviser_id) &&
            (body.step == "manager_to_supervisor" ||
              body.step == "operator_to_supervisor")
          ) {
            items.push(body);
          } else if (
            this.$checkRole(this.$store.state.auth.role.oprator_id) &&
            body.step == "supervisor_to_operator" &&
            body.status != "done"
          ) {
            items.push(body);
          }
        }
      }
      if (event > items.length) {
        this.$toast.info(
          "تعداد وارد شده بیشتر از تعداد پیام هایی است که متوانید ارجاع دهید"
        );
        return;
      }
      let ids = [];
      let random_data = items.splice(0, event);
      if (random_data.length > 0) {
        random_data.map((x) => {
          this.selected_item.push(x.id);
        });
      }
    },
    getDoneExcel() {
      let data = JSON.parse(JSON.stringify(this.total_items));
      let done_messages = [];
      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        if (x.status == "done") {
          done_messages.push({
            user_first_name: x.user_first_name,
            user_last_name: x.user_last_name,
            receptor: x.receptor,
            messageid: x.messageid,
            step: this.$getItemEnum(
              this.$store.state.static.step_message,
              x.step
            ),
            user_username: this.$showUsername(x.user_username),
          });
        }
      }

      let file_name = "پیام های انجام شده";
      let headers = [
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
        { text: "نام کاربر", value: "user_first_name" },
        { text: "نام خانوادگی", value: "user_last_name" },
        {
          text: "شماره ارسال کننده",
          type: "phone",
          filterCol: "user_username",
          value: "user_username",
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
          text: "مرحله",
          value: "step",
        },
      ];
      this.$exportCSV(headers, done_messages, file_name);
    },
  },
};
</script>
<style scoped>
.class-bg {
  background: linear-gradient(to left, #384e58e7, #607d8baf, #8597a1cc);
}
</style>

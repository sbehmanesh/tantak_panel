<template>
  <div>
    <Refer
      :messageInfo="message_info"
      :userInfo="user_info"
      :selected_item="selected_item"
      @relod="relod"
    />
    <v-row>
      <v-col cols="12" md="12">
        <BaseTable
          url="/message"
          :headers="headers"
          :createUrl="create_url"
          :autoUpdate="update_url"
          :autoDelete="delete_url"
          :BTNactions="btn_actions"
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
        <ChangeStatus
          v-if="dialog_change_status.show"
          :dialog_change_status="dialog_change_status"
          :messageInfo="message_info"
          :userInfo="user_info"
          @relod="relod"
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
export default {
  components: { BaseTable, History, ChangeStatus, Customer, Refer },
  data: () => ({
    headers: [],
    user: [],

    dialog_history: {
      show: false,
      items: null,
    },
    dialog_customer: { show: false, items: null },
    dialog_change_status: { show: false, items: null },
    dialog_Refer: { show: false, items: null },
    filters: {},
    user_info: {},
    selected_item: [],
    user_info: {},
    customer: {},
    btn_actions: [],
    create_url: "",
    message_info: {},
    update_url: "",
    delete_url: "",
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
        text: "",
        width: "10px",
        type: "checkbox",
        disableSort: true,
        filterable: false,
        show_box: (body) => {
          let show = false;
          if (
            this.$checkRole(this.$store.state.auth.role.admin_id) &&
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
            if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
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
          if (this.$checkRole(this.$store.state.auth.role.oprator_id) && body.step == "supervisor_to_operator" && body.status !="done") {
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
        // show_fun: (body) => {
        //   if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },

  watch: {
    // "form.type_send"() {
    //   if (this.type_send == "close" || this.type_send == "auto") {
    //   }
    // },
  },
  methods: {
    relod() {
      this.$refs.refreshMessage.getDataFromApi();
      this.selected_item = [];
     
    },
  },
};
</script>

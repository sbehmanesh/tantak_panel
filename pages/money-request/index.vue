<template>
  <div>
    <BaseTable
      url="/money-request"
      :headers="headers"
      :BTNactions="btn_actions"
      ref="MoneyRequest"
    />
    <Dialog
      :dialog="show_dialog"
      v-if="show_dialog"
      :requestId="request_id"
      @cloadDialog="show_dialog = false"
      @reload="refresh"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import Dialog from "~/components/MoneyRequest/Dialog.vue";
export default {
  components: { Dialog, BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    request_id: "",
    show_dialog: false,
    title: "درخواست وجه",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

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
        text: "کاربران",
        value: (body) => {
          if (Boolean(body.user)) {
            if (body.user.first_name && body.user.last_name) {
              return body.user.first_name + " " + body.user.last_name;
            } else {
              return body.user.username;
            }
          }
        },
      },
      { text: "مقدار (ریال)", value: "value", type: "price" },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_req_money,
      },
    ];
    this.btn_actions = [
      {
        text: "برسی درخواست",
        icon: "done",
        color: "primary",
        fun: (body) => {
          this.show_dialog = true;
          this.request_id = body.id;
        },
        show_fun: (body) => {
          if ((body.status = "wait")) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  methods: {
    refresh() {
      this.$refs.MoneyRequest.getDataFromApi();
    },
  },
};
</script>

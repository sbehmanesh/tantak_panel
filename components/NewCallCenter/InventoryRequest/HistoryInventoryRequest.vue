<template>
  <div>
    <v-dialog
      persistent
      v-model="dialogHistory.show"
      :model-id="dialogHistory.items"
      fullscreen
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <span style="font-size: 21px">تاریخچه درخواست موجودی</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-toolbar>
        <BaseTable
          url="/product-request/referral-history"
          :headers="headers"
          :root-body="root_body"
          :BTNactions="btn_actions"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogHistory: {
      require: false,
      default: false,
    },
    messageId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    headers: [],
    root_body: "",
    btn_actions: [],
  }),
  beforeMount() {
    this.root_body = { product_request_id: this.messageId };
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
          if (body.sender) {
            if (body.sender.first_name && body.sender.last_name) {
              let first_name = body.sender.first_name;
              let last_name = body.sender.last_name;
              let full_name = first_name + " " + last_name;
              return full_name;
            } else {
              return body.sender.username;
            }
          } else {
            return "ندارد";
          }
        },
      },
      {
        text: "دریافت کننده",
        value: (body) => {
          if (body.geter) {
            if (body.geter.first_name && body.geter.last_name) {
              let first_name = body.geter.first_name;
              let last_name = body.geter.last_name;
              let full_name = first_name + " " + last_name;
              return full_name;
            } else {
              return body.geter.username;
            }
          } else {
            return "ندارد";
          }
        },
      },
      {
        text: "نوع ارجاع",
        value: (body) => {
          if (body.text) {
            return body.text;
          }
        },
      },
      {
        text: "شماره درخواست موجودی",
        value: (body) => {
          if (body.order_number) {
            return body.order_number;
          }
        },
      },
      {
        text: "پیام",
        value: (body) => {
          if (body.message) {
            return body.message;
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "مشاهده فایل",
        icon: "attach_file",
        color: "info darken-2",
        fun: (body) => {
          window.open(this.$getImage(body.file));
        },
        show_fun: (body) => {
          if (body.file) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.dialogHistory.show = false;
      this.dialogHistory.items = null;
    },
  },
};
</script>

<style></style>

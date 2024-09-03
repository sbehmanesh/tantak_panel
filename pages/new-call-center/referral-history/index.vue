<template>
  <div>
    <v-col>
      <v-row cols="12" class="center-div mt-5">
        <v-chip
          dark
          label
          class="ma-2 px-3"
          color="teal"
          v-for="item in items"
          :key="item.key"
          @click="tab = item.key"
          :outlined="tab != item.key"
        >
          {{ item.text }}
        </v-chip>
      </v-row>
    </v-col>
    <BaseTable
      url="/product-request/referral-history-all"
      :headers="headers"
      :filters="filters"
      :BTNactions="btn_actions"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    title: "تاریخچه درخواست موجودی",
    tab: "all",
    items: [
      { text: "همه", key: "all" },
      { text: "فعالیت های من", key: "my_logs" },
    ],
    user_login_id: "",
    filters: {},
    btn_actions: [],
  }),
  watch: {
    tab() {
      switch (this.tab) {
        case "all":
          this.filters = {};
          break;
        case "my_logs":
          this.filters = {
            send_user_id: {
              op: "=",
              value: this.user_login_id,
            },
          };
          break;
      }
    },
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.user_login_id = this.$store.state.auth.user.id;
  },
  mounted() {
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
};
</script>

<style></style>

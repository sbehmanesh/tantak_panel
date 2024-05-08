vur
<template>
  <v-row>
    <v-col cols="12" md="12" v-if="is_super_admin">
      <BaseTable :headers="headers" url="recived-message" />
    </v-col>
  </v-row>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      title: "لیست پیام ها",
    };
  },
  beforeMount() {
    (this.btn_actions = [
      // {
      //   color: "green",
      //   icon: "group",
      //   text: "لیست اپراتور ها",
      //   fun: (body) => {
      //     this.dialog_oprator_list.show = true;
      //     this.show_list = body.id;
      //     this.name_superviser = body?.first_name + " " + body?.last_name;
      //   },
      // },
    ]),
      (this.btn_actions_super = [
        {
          text: "مشاهده پیام  ها ",
          icon: "contact_mail",
          color: "info",
          fun: (body) => {
            this.dialog_file.show = true;
            this.oprator_id = body.id;
          },
        },
      ]),
      (this.headers = [
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
          text: "نام مشتری",
          value: (body) => {
            if (body.user) {
              return body.user.first_name ? body.user.first_name : "--";
            }
          },
        },
        // {
        //   text: "نام خانوادگی",
        //   value: (body) => {
        //     if (body.user) {
        //       return body.user.last_name ? body.user.last_name : "--";
        //     }
        //   },
        // },
        {
          text: "شماره همراه",
          value: (body) => {
            if (body.user) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          },
        },
        {
          filterable: false,
          type: "tooltip",
          function: (body) => {
            let text = "";
            if (body.message) {
              text = "پیام : " + body.message;
            }
            return text;
          },
          value: (body) => {
            if (!Boolean(body.message)) {
              return "";
            }
            if (typeof body.message == "string") {
              if (body.message) {
                return `<i aria-hidden="true" class=" gray--text v-icon notranslate pr-16 mr-5 material-icons" style="font-size: 20px;">mark_email</i>`;
              }
            }
          },
        },
        {
          text: "نام مرکز تماس",
          value: (body) => {
            if (body.superviser) {
              return body.superviser.first_name
                ? body.superviser.first_name
                : body.superviser.username;
            }
          },
        },
        {
          text: "نام خانوادگی",
          value: (body) => {
            if (body.superviser) {
              return body.superviser.last_name ? body.superviser.last_name : "--";
            }
          },
        },
        {
          text: "نام  فروشنده",
          value: (body) => {
            if (body.operator) {
              return body.operator.first_name
                ? body.operator.first_name
                : body.operator.username;
            }
          },
        },
        // {
        //   text: "نام خانوادگی",
        //   value: (body) => {
        //     if (body.user) {
        //       if(body.operator.last_name ){

        //         return body.operator.last_name ? body.operator.last_name : "--";
        //       }
        //     }
        //   },
        // },

      ]);
    this.headers_superviser = [
      {
        text: "تصویر",
        value: "avatar",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      { text: "نام", value: "first_name" },
      // { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
      { text: "کد ملی", filterCol: "national_code", value: "national_code" },

      {
        text: "نام مدیر",
        value: (body) => {
          if (body.parent) {
            if (body.parent.first_name) {
              return body.parent.first_name;
            } else {
              return body.parent.username;
            }
          }
        },
      },
      // {
      //   text: "نام خانوادگی",
      //   value: (body) => {
      //     if (body.parent) {
      //       if (body.parent.last_name) {
      //         return body.parent.last_name;
      //       } else {
      //         return "--";
      //       }
      //     }
      //   },
      // },
    ];
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.is_superviser = true;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.is_admin = true;
    }
    this.$store.dispatch("setPageTitle", this.title);
    if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.is_super_admin = true;
      this.url = this.admin_url;
    } else if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.url = this.superviser_url;
    }
  },
  methods: {
    reloadList() {
      this.$refs.UserlIstref.getDataFromApi();
    },
  },
};
</script>

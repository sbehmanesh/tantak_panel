<template>
  <div class="text-center">
    <BaseTable
      url="/return-factory/referral-history-all/return_factories/logs "
      :headers="headers"
      :extraBtn="extra_btn"
      :rootBody="root_body"
      :rowColor="rowColor"
    />
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      panel: 1,
      continue_form: false,
      loading: false,
      filters: {},
      response: [],
      headers: [],
      btn_actions: [],
      extra_btn: [],
      product: { product_id: "" },
      root_body: {},
      url: "",
      product_var_info: "",
      valid: true,
      update: false,
      form: {
        skock: "",
        description: "",
        save_skock: "",
        sale_agency_id: "",
        product_var_id: "",
      },
    };
  },
  beforeMount() {
    this.root_body = {
      section_name: "ReturnFactory",
    };
  },
  mounted() {
    this.headers = [
      {
        text: "تاریخ ثبت",
        filterCol: "created_at",
        filterType: "date",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(
              body.created_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          } else {
            return " --";
          }
        },
      },

      {
        text: " نام ارسال کننده",
        filterCol: "send_user_first_name",
        value: "send_user_first_name",
      },
      {
        text: " نام خانوادگی ارسال کننده",
        filterCol: "send_user_last_name",
        value: "send_user_last_name",
      },
      {
        text: "شماره همراه",
        filterCol: "send_user_username",
        value: "send_user_username",
      },
      {
        text: "پیام",
        filterable: false,
        type: "tooltip",
        function: (body) => {
          if (body.text_log) {
            return body.text_log;
          }
        },
        value: (body) => {
          if (typeof body.text_log == "string") {
            if (body.text_log.length < 25) {
              return `<span class='font_12'>${body.text_log}</span>`;
            }
            return `<span class='font_12'>${body.text_log.slice(0, 25) }"..."</span>`;
          } else {
            return "-";
          }
        },
      },
      {
        text: " نام گیرنده ",
        filterCol: "get_user_first_name",
        value: "get_user_first_name",
      },
      {
        text: " نام خانوادگی گیرنده ",
        filterCol: "get_user_last_name",
        value: "get_user_last_name",
      },
      {
        text: "شماره همراه",
        filterCol: "get_user_username",
        value: "get_user_username",
      },
  

      {
        text: "وضعیت",
        filterType: "select",
        filterCol: "status",
        value: "status",
        items: this.$store.state.static.status_basket_refral,
      },
    ];

    this.btn_actions = [
      //     {
      //       icon: "visibility",
      //       color: "red",
      //       text: "نمایش فایل",
      //       fun: (body) => {
      //         if (body.file) {
      //           window.open(this.$getImage(body.file));
      //         }
      //       },
      //       show_fun: (body) => (body.file ? true : false),
      //     },
    ];
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    rowColor(body) {
      if (body.item.step == "done") {
        return "green lighten-4";
      } else if (
        body.item.step == "fiscal_to_fiscal_supervisor" ||
        body.item.step == "fiscal_supervisor_to_manager" ||
        body.item.step == "fiscal_manager_to_debtor" ||
        body.item.step == "not_accept_reviewer" ||
        body.item.step == "cancel" ||
        body.item.step == "reviewer_to_debtor"
      ) {
        return "red lighten-4";
      }
    },
  },
};
</script>

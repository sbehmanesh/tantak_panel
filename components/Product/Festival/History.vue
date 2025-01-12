<template>
  <BaseTable
    url="/festival/logs"
    :headers="headers"
    :extraBtn="extra_btn"
    :root-body="root_body"
  />
</template>

<script>
export default {
  props: {
    festivalId: { default: null },
  },
  data: () => ({
    headers: [],
    lottery_hed: [],
    extra_btn: [],
    step: 1,
    btn_actions: [],
    festival_id: "",
    model_id: "",
    root_body: {},
    title: "تاریخچه جشنواره",
    show_dialog: false,
  }),
  beforeMount() {
    this.root_body = {
      festival_id: this.festivalId,
    };
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
        text: "عنوان جشنواره",
        value: (body) => {
          if (Boolean(body.festival) && Boolean(body.festival.name)) {
            return body.festival.name;
          }
        },
      },
      {
        text: "شماره فاکتور",
        value: (body) => {
          if (Boolean(body.basket) && Boolean(body.basket.factor_number)) {
            return body.basket.factor_number;
          }
        },
      },
      {
        text: "کاربر",
        value: (body) => {
          if (Boolean(body.user) && Boolean(body.user.first_name)) {
            return body.user.first_name;
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (Boolean(body.user) && Boolean(body.user.last_name)) {
            return body.user.last_name;
          }
        },
      },
      {
        text: "پکیج / محصول استفاده شده  ",
        value: (body) => {
          if (Boolean(body.product)) {
            return body.product.name;
          } else if (Boolean(body.package)) {
            return body.package.name;
          }
        },
      },
      { text: "توضیحات", value: "text_log" },
    ];

    this.extra_btn = [
      {
        text: "برگشت",
        color: "red",
        icon: "redo",
        fun: () => {
          this.$emit("backStep");
        },
      },
    ];
  },
  methods: {},
};
</script>

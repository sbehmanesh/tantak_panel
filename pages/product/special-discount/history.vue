<template>
  <div>
    <BaseTable
      url="/special-discount/logs"
      :headers="headers"
      :extraBtn="extra_btn"
      :rootBody="root_body"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    extra_btn: [],
    title: "تاریخچه استفاده از تخفیف ویژه",
    root_body: {},
  }),
  beforeMount() {
    this.root_body = {
      special_discount_id: this.$route.query.id,
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
        text: "نام کاربر",
        value: (body) => {
          return body.user && body.user.first_name
            ? body.user.first_name
            : "--";
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          return body.user && body.user.last_name ? body.user.last_name : "--";
        },
      },    
        {
        text: "شماره همراه",
        value: (body) => {
          return body.user && body.user.username ? body.user.username : "--";
        },
      },
      {
        text: "شماره فاکتور ",
        value: (body) => {
          return body.basket.basket.factor_number;
        },
      },

      {
        text: " اطلاعات ",
        value: (body) => {
          return body.basket.information;
        },
      },
      { text: "مقدار تخفیف (ریال)", value: "amount", type: "price" },
    ];
    this.extra_btn = [
      {
        text: "برگشت",
        icon: "redo",
        color: "red",
        fun: (body) => {
          this.$router.back();
        },
      },
    ];
  },
};
</script>

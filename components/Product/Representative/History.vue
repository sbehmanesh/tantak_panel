<template>
  <div>
    <BaseTable
      url="/sale-agency-stock/history"
      @getData="totalItems($event)"
      :headers="headers"
      :filters="filters"
      :root-body="root_body"
      :extraBtn="extra_btn"
    />
  </div>
</template>
<script>
export default {
  props: {
    branchId: {
      require: false,
      default: false,
    },
    sectionId: {
      type: String,
      default: "",
    },
    productVarInfo: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      panel: 1,
      continue_form: false,
      loading: false,
      filters: {},
      response: [],
      items: [],
      headers: [],
      product: { product_id: "" },
      root_body: "",
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
    this.filters = {
      section_id: {
        op: "=",
        value: this.sectionId,
      },
    };
    this.root_body = { sale_agency_id: this.branchId };
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
        filtrabel: false,
        value: (body) => {
          if (body.user.first_name) {
            return body.user.first_name;
          } else {
            return body.user.username;
          }
        },
      },
      {
        text: "نام خانوادگی",
        filtrabel: false,
        value: (body) => {
          if (body.user.last_name) {
            return body.user.last_name;
          } else {
            return "--";
          }
        },
      },

      {
        text: " موجودی قدیم",
        filterable: false,
        value: (body) => {
          let items = [];
          items.push(
            `<span class="primary--text font_13"> موجودی  : ${body.befor_change_stock.toLocaleString()} </span>`
          );

          items.push(
            `<span class="primary--text font_13">موجودی  انبار : ${body.befor_change_saved_stock.toLocaleString()} </span>`
          );

          return items.join("<br>");
        },
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
              return body.text_log;
            }
            return body.text_log.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        text: "موجودی جدید",
        filterable: false,
        value: (body) => {
          let items = [];

          items.push(
            `<span class="teal--text font_13">موجودی :   ${body.after_change_stock.toLocaleString()} </span>`
          );

          items.push(
            `<span class="teal--text font_13">موجودی  انبار   : ${body.after_change_saved_stock.toLocaleString()} </span>`
          );
          return items.join("<br>");
        },
      },
    ];
    this.extra_btn = [
      {
        text: "خروجی اکسل",
        icon: "description",
        color: "teal",
        fun: () => {
          this.getExcelFile();
        },
      },

      {
        text: "برگشت",
        icon: "arrow_circle_right",
        color: "red",
        fun: () => {
          this.backStep();
        },
      },
    ];
  },
  methods: {
    totalItems(res) {
      this.items = res.model.data;
    },
    backStep() {
      this.$emit("backStep");
    },
    getExcelFile() {
      let body_items = [];

      for (let i = 0; i < this.items.length; i++) {
        const x = this.items[i];
        let user =
          Boolean(x.user) &&
          Boolean(x.user.first_name) &&
          Boolean(x.user.last_name)
            ? `${x.user.first_name} ${x.user.last_name}`
            : "--";
        let phone = Boolean(x.user) ? x.user.username : "--";
        body_items.push({
          created_at: this.$toJalali(x.created_at),
          user: user,
          phone: phone,
          text_log: x.text_log,
          after_change_stock: x.after_change_stock,
          after_change_saved_stock: x.after_change_saved_stock,
          befor_change_saved_stock: x.befor_change_saved_stock,
          befor_change_stock: x.befor_change_stock,
          factor_number: x.basket && Boolean(x.basket) && Object.keys(x.basket).length > 0 ?  x.basket.factor_number :"--",
        });
        let heder = [
          { text: "زمان ثبت", value: "created_at" },
          { text: "نام کاربر", value: "user" },
          { text: "شماره همراه", value: "phone" },
          { text: "آخرین وضعیت", value: "text_log" },
          { text: "موجودی جدید", value: "after_change_stock" },
          { text: "موجودی جدید انبار", value: "after_change_saved_stock" },
          { text: "موجودی قدیم انبار", value: "befor_change_saved_stock" },
          { text: "موجودی قدیم", value: "befor_change_stock" },
          { text: "شماره فاکتور سفارش", value: "factor_number" },
        ];
        let excel_name = "تاریخجه انبار";
        this.$exportCSV(heder, body_items, excel_name);
      }
    },
  },
};
</script>

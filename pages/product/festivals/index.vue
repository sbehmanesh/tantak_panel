<template>
  <div>
    <v-window v-model="step">
      <v-window-item :value="1">
        <BaseTable
          url="/festival"
          autoDelete="/festival/delete"
          autoUpdate="/product/festivals"
          createUrl="/product/festivals/insert"
          :headers="headers"
          :BTNactions="btn_actions"
        />
      </v-window-item>

      <v-window-item :value="2">
        <BaseTable
          v-if="step == 2"
          url="/lottery"
          autoDelete="/lottery/delete"
          :headers="lottery_hed"
          :BTNactions="btn_actions"
          :extraBtn="extra_btn"
          :filters="filters"
        />
      </v-window-item>
      <v-window-item :value="3">
        <History
          v-if="step == 3"
          :festival-id="festival_id"
          @backStep="step -= 2"
        />
      </v-window-item>
    </v-window>

    <LotteryDialog
      v-if="show_dialog"
      :dialog="show_dialog"
      @closeDialog="show_dialog = false"
      :festival-id="festival_id"
      :itemId="model_id"
    />
  </div>
</template>

<script>
import LotteryDialog from "@/components/Product/Festival/LotteryDialog.vue";
import History from "@/components/Product/Festival/History.vue";
export default {
  components: {
    LotteryDialog,
    History,
  },
  data: () => ({
    headers: [],
    lottery_hed: [],
    extra_btn: [],
    step: 1,
    btn_actions: [],
    festival_id: "",
    model_id: "",
    filters: {},
    title: "جشنواره",
    show_dialog: false,
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        text: "تصویر",
        value: "logo",
        type: "image",
        disableSort: "true",
        filterable: false,
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
      { text: "عنوان جشنواره", value: "name" },
      {
        text: "تعداد / خرید کاربر (ریال)",
        value: "amount_start_use",
        type: "price",
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "start_at",
        text: "تاریخ شروع جشنواره ",
        value: (body) => {
          if (body.start_at) {
            return this.$toJalali(body.start_at, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
        },
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "end_at",
        text: "تاریخ پایان ",
        value: (body) => {
          if (body.end_at) {
            return this.$toJalali(body.end_at, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
        },
      },
    ];

    this.lottery_hed = [
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
      { text: "تعداد افراد", value: "people_number_use" },
      {
        text: "وضعیت ",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "time",
        text: "تاریخ  قرعه کشی ",
        value: (body) => {
          if (body.time) {
            return this.$toJalali(body.time, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
        },
      },
    ];
    this.btn_actions = [
      {
        text: " ثبت قرعه کشی",
        color: "red",
        fun: (body) => {
          this.show_dialog = true;
          this.festival_id = body.id;
        },
        show_fun: (body) => {
          if (this.step == 1) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: " چزییات قرعه کشی",
        color: "blue-grey",
        fun: (body) => {
          this.show_dialog = true;
          this.model_id = body.id;
        },
        show_fun: (body) => {
          if (this.step == 2) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: " لیست قرعه کشی  ها ",
        color: "blue-grey",
        fun: (body) => {
          this.filters = {
            festival_id: {
              op: "=",
              value: body.id,
            },
          };
          this.step++;
          this.festival_id = body.id;
        },
        show_fun: (body) => {
          if (this.step == 1) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تاریخچه",
        color: "red",
        fun: (body) => {
          this.step += 2;
          this.festival_id = body.id;
        },
        show_fun: (body) => {
          if (this.step == 1) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.extra_btn = [
      {
        text: "برگشت",
        color: "red",
        icon: "redo",
        fun: () => {
          this.step--;
          this.model_id =""
        },
      },
    ];
  },
  methods: {},
};
</script>

<template>
  <div>
    <FilterLogs @reload="reload" />
    <BaseTable
      url="/api-call-log"
      ref="BaseTable"
      :headers="headers"
      :autoLoad="false"
      :BTNactions="btn_actions"
    />
    <ReportDialogText
      v-if="dialog_defect.show"
      :dialog_defect="dialog_defect"
      @closeDialogDefect="dialog_defect.show = false"
    />
  </div>
</template>

<script>
import ReportDialogText from "@/components/Report/ReportDialogText.vue";
import FilterLogs from "@/components/Report/FilterLogs.vue";
export default {
  components: {
    ReportDialogText,
    FilterLogs,
  },
  data: () => ({
    tilte: "خارج نگار",
    headers: [],
    btn_actions: [],
    dialog_defect: { show: false, items: null },
  }),
  beforeMount() {
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
        text: "مسیر",
        type: "tooltip",
        filterCol: "url",
        function: (body) => {
          if (body.url) {
            return body.url;
          }
        },
        value: (body) => {
          if (body.url.length < 25) {
            return body.url;
          }
          return "..." + body.url.slice(0, 25);
        },
      },
      {
        text: "نوع درخواست",
        filterCol: "method",
        value: "method",
      },
      {
        text: "وضعیت ارسال",
        value: "status",
        filterCol: "status",
      },
      {
        text: "مدت زمان در انتظار µs",
        value: "second_limit_at",
        filterable: false,
        disableSort: true,
      },
      {
        text: "وضعیت اسال مجدد",
        value: (body) => {
          if (body.resend_message == "no") {
            return "نشده";
          } else {
            return "شد";
          }
        },
        filterable: false,
        disableSort: true,
      },
    ];
    this.btn_actions = [
      {
        text: "بدنه درخواست",
        color: "blue",
        fun: (body) => {
          this.dialog_defect.show = true;
          this.dialog_defect.items = body.body;
        },
        show_fun: (body) => {
          if (body.body != null) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "نتیجه درخواست",
        color: "blue",
        fun: (body) => {
          this.dialog_defect.show = true;
          this.dialog_defect.items = body.result;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    reload() {
      this.$refs.BaseTable.getDataFromApi();
    },
  },
};
</script>

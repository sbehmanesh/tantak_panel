<template>
  <div>
    <v-row class="justify-center align-center">
      <v-col cols="12" md="11">
        <Filters
          @setFilter="getData($event)"
          :loading-items="loading"
          :search-result="main_data"
        />
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-card class="elevation-0" :disabled="loading || loading2">
        <BaseTable
          url="/cdr"
          :BTNactions="btn_actions"
          :headers="headers"
          :root-body="body_bastable"
        />
      </v-card>
    </v-col>

    <v-dialog persistent :value="voice_dialog.show" width="350">
      <v-card height="200" v-if="voice_dialog.show">
        <div class="d-flex justify-end pa-5">
          <v-icon size="28" class="pointer" @click="closeDialog()"
            >close</v-icon
          >
        </div>
        <div v-if="voice_dialog.item" class="d-flex justify-center">
          <audio controls autoplay muted>
            <source :src="voice_dialog.item" type="audio/x-wav" />
          </audio>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Filters from "@/components/CallReportsNew/Filters.vue";
export default {
  components: { Filters },
  data: () => ({
    isabel_data: [],
    show_table: false,
    voice_dialog: { item: null, show: false },
    loading: false,
    loading2: false,
    main_data: [],
    body_bastable: null,
    title: "گزارشات تماس جدید",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.body_bastable = {
      type: "all",
      with_date: false,
    };
    this.headers = [
      {
        filterCol: "created_at",
        filterable: true,
        disableSort: true,
        text: "زمان ثبت تماس",
        filterType: "date",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      {
        filterable: true,
        disableSort: true,
        filterCol: "cnum",
        text: " مبدا تماس",
        value: (body) => {
          return body.cnum;
        },
      },
      {
        filterable: true,
        disableSort: true,
        filterCol: "dst",
        text: "مقصد تماس",
        value: (body) => {
          if (body.dst.length == 12) {
            let phone_slice = body.dst.slice(1);
            let phone = phone_slice.replace(/(\d{4})(\d{3})(\d{4})/, "$1$2$3");
            return phone;
          } else {
            return body.dst;
          }
        },
      },
      {
        text: "وضعیت",
        filterType: "select",
        items: this.$store.state.static.status_call,
        disableSort: true,
        value: "disposition",
      },
      {
        text: "مرکز تماس",
        filterable: false,
        value: (body) => {
          if(body.src == "2191008028") {
            return "بیمچه";
          }if (body.src == "2191008029") {
            return "ساو";
          } else {
            return body.src;
          }
        },
      },
    ];

    this.btn_actions = [
      {
        text: "پخش صوت",
        icon: "play_circle",
        color: "primary",
        fun: (body) => {
          this.voice_dialog.show = false;
          this.downloadCallRecord(body.recordingfile);
          this.voice_dialog.item = body;
        },
        show_fun: (body) => {
          if (Boolean(body.recordingfile) && body.billsec != "00:00") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "لیست نظرسنجی",
        icon: "list",
        color: "error",
        fun: (body) => {
          this.$router.push(`/call-reports-new/${body.id}`);
        },
      },
    ];
  },
  methods: {
    getData(event) {
      this.body_bastable = event;
    },
    downloadCallRecord(value, show = false) {
      let url = "/message/issabel-request-call/get-rec-file";
      this.$reqApi(url, { recordingfile: value })
        .then((response) => {
          if (!show) {
            let result = response.split("/");
            this.downloadCallRecord(result[result.length - 1], true);
          } else {
            this.voice_dialog.show = true;
            this.voice_dialog.item = response;
          }
        })
        .catch((error) => {});
    },

    closeDialog() {
      this.voice_dialog.item = null;
      this.voice_dialog.show = false;
    },
  },
};
</script>

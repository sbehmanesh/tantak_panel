<template>
  <div>
    <v-row class="justify-center align-center">
      <v-col cols="12" md="11">
        <Filters
          @setFilter="getData($event)"
          :loading-items="loading"
          @personal="personal = $event"
          @totalUser="user_list = $event"
          @setStatusFilter="setStatusFilter($event)"
          :search-result="main_data"
        />
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-card class="elevation-0" :disabled="loading || loading2">
        <BaseTable
          :BTNactions="btn_actions"
          :headers="headers"
          localData
          :dataArray="isabel_data"
        />
      </v-card>
    </v-col>

    <v-dialog persistent :value="voice_dialog.show" width="350">
      <v-card height="200" v-if="voice_dialog.show">
        <div class="d-flex justify-end pa-5">
          <v-icon size="28" class="pointer" @click="closeDialog()">close</v-icon>
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
import Filters from "@/components/CallReports/Filters.vue";
export default {
  components: { Filters },
  data: () => ({
    headers: [],
    isabel_data: [],
    show_table: false,
    voice_dialog: { item: null, show: false },
    loading: false,
    loading2: false,
    personal: [],
    btn_actions: [],
    user_list: [],
    main_data: [],
    root_body: "",
    title: "گزارشات تماس",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.headers = [
      {
        filterable: false,
        disableSort: true,
        text: "زمان ثبت تماس",
        filterType: "date",
        filterCol: "calldate",
        value: (body) => {
          if (body.calldate) {
            return this.$toJalali(body.calldate);
          }
          return "";
        },
      },

      {
        filterable: false,
        disableSort: true,
        text: " مبدا تماس",
        value: (body) => {
          if (typeof body.personal == "object") {
            let user = body.personal;
            return `
    <h1 class='my-3'>
      <small class='font_13'>
        ${user.text}
        </small>
        <br />
      <small class='grey--text'>
          ${user.sub_title}
        </small>

      </h1>
    `;
          } else {
            if (body.personal.length == 12) {
            let phone_slice = body.personal.slice(1);
            let phone = phone_slice.replace(/(\d{4})(\d{3})(\d{4})/, "$1$2$3");
            return phone;
          } else{
            return body.personal
          }

       
          }
        },
      },
      {
        filterable: false,
        disableSort: true,
        text: "شماره همراه مبدا تماس",
        value: (body) => {
          if (typeof body.personal == "object") {
            return body.personal.username;
          } else {
            return `
    <h1 class='my-3'>
      <small class='grey--text'>
         یافت نشد
        </small>

      </h1>
    `;
          }
        },
      },
      {
        filterable: false,
        disableSort: true,
        text: "مقصد تماس",
        value: (body) => {

          if (body.dst.length == 12) {
            let phone_slice = body.dst.slice(1);
            let phone = phone_slice.replace(/(\d{4})(\d{3})(\d{4})/, "$1$2$3");
            return phone;
          } 
          else {
            return body.dst;
          }
        },
      },

      {
        text: "وضعیت",
        filterable: false,
        disableSort: true,
        value: (body) => {
          if (body.disposition == "CONGESTION") {
            return "مشغول";
          } else if (body.disposition == "BUSY") {
            return "مشغول";
          } else if (body.disposition == "NO ANSWER") {
            return "بدون پاسخ";
          } else if (body.disposition == "MISSED") {
            return "از دست رفته";
          } else if (body.disposition == "FAILED") {
            return "عدم موفقیت";
          } else if (body.disposition == "s") {
            return "قطع شده در IVR";
          } else if (body.disposition == "ANSWERED") {
            return "پاسخ داده شده";
          }
        },
      },
      {
        text: "مدت زمان تماس",
        filterable: false,
        disableSort: true,
        // type: "voice",
        // value: "recordingfile",
        value: (body) => {
          if (Boolean(body.billsec)) {
            return body.billsec;
          } else {
            return "-";
          }
        },
      },
    ];

    this.btn_actions = [
      {
        text: "پخش صوت",
        icon:"play_circle",
        color: "primary",
        fun: (body) => {
          this.voice_dialog.show = false;
          this.downloadCallRecord(body.recordingfile);
          this.voice_dialog.item = body;
          console.log(body.billsec);
          
        },
        show_fun: (body) => {
          if (Boolean(body.recordingfile) && body.billsec!='00:00'){
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  methods: {
    getData(event) {
      if (!Boolean(event) || Object.keys(event).length < 1) {
        this.$toast.info("موردی برای جستوجو انتخاب نشده ");
        return;
      }
      this.loading = true;

      this.$reqApi("message/issabel-request-call/history", { ...event })
        .then((res) => {
          let data = [];
          let items = [];
          data = res;
          if (data.length > 0) {
            // ********************get call time*****************************

            for (let i = 0; i < data.length; i++) {
              const x = data[i];
              let personal = {};
              let time = "00:00";
              if (x.billsec > 0) {
                let remainder = x.billsec % 3600;
                let minutes = Math.floor(remainder / 60);
                let secs = remainder % 60;
                time = `${minutes.toString().padStart(2, "0")}:${secs
                  .toString()
                  .padStart(2, "0")}`;
              }

              // *************************************************

              items.push({
                src: x.src,
                cnum: x.cnum,
                cnum: x.cnum,
                dst: x.dst,
                calldate: x.calldate,
                recordingfile: x.recordingfile,
                disposition: x.disposition,
                dcontext: x.dcontext,
                billsec: time,
              });

              personal = this.personal.find(
                (f) =>
                  x.cnum == f.username ||
                  Boolean(f.text.indexOf(x.cnum) > -1) ||
                  f.internal_port == x.cnum
              );

              if (Boolean(personal)) {
                items[items.length - 1]["personal"] = personal;
              } else if (Boolean(x.cnum)) {
                items[items.length - 1]["personal"] = x.cnum;
              } else{
                items[items.length - 1]["personal"] = x.src;
              }
             
            }
          }
          if (items.length > 0) {
            this.isabel_data = items;
            this.main_data = items;
          } else {
            this.$toast.info("موردی برای نتیجه  جستجوی شما پیدا نشد ");
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
      this.show_table = true;
    },
    setStatusFilter(event) {
      let data = [];
      this.loading2 = true;
      setTimeout(() => {
        if (event[0] == "all") {
          this.isabel_data = JSON.parse(JSON.stringify(this.main_data));
        } else {
          this.isabel_data = event[1];
        }
        this.loading2 = false;
      }, 800);
    },
    downloadCallRecord(value , show = false) {
      let url = "/message/issabel-request-call/get-rec-file";
      this.$reqApi(url, { recordingfile  : value } )
        .then((response) => {
          if (!show) {
            console.log("response ==> ", response);
            let result = response.split("/")
            console.log("result ==> ", result);
            this.downloadCallRecord(result[result.length-1] , true)
            
          }else{
          this.voice_dialog.show = true;
          this.voice_dialog.item =response;

          }
          ;
        })
        .catch((error) => {
        console.log("error ==> ", error);
        });
    },

     closeDialog(){
       this.voice_dialog.item = null;
        this.voice_dialog.show = false;
    }
  },
};
</script>

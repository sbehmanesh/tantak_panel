<template>
  <div>
    <v-dialog persistent v-model="dialog" fullscreen>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <span style="font-size: 18px">تاریخچه ارجاع شکایت ثبت شده</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-toolbar>
        <BaseTable
          url="/complaint/referral-history/complaints/logs"
          :headers="headers"
          :root-body="{ section_id: complaintId, section_name: 'Complaint' }"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialog: {
      require: false,
      default: false,
    },
    complaintId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    chat_dilog: false,
    headers: [],
    extra_btn: [],
    loading: false,
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
        text: "از",
        value: (body) => {
          if (body.send_user_first_name && body.send_user_last_name) {
            return body.send_user_first_name
              ? body.send_user_first_name +
                  " " +
                  body.send_user_last_name
              : "--";
          }
        },
      },
      {text:"فرستنده", value:"send_user_username"},
  
      {
        text: "به",
        value: (body) => {
          if (body.get_user_first_name) {
            return body.get_user_first_name
              ? body.get_user_first_name + " " + body.get_user_last_name
              : "--";
          } else {
            return "--";
          }
        },
      },
      {text:"گیرنده"  ,value:"get_user_username"},


      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.complaint_step,
      },      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.complaint_status,
      },
      // {
      //   text: "نوع تخصیص",
      //   value: "type_send",
      //   filterType: "select",
      //   items: [
      //     { text: "تخصیص خودکار", value: "auto" },
      //     { text: "دستی", value: "multi" },
      //     { text: "بر اساس سابقه فروش", value: "sale" },
      //     { text: "بستن", value: "close" },
      //   ],
      // },
    ];
  },
  methods: {
    submit() {
      this.loading = true;
      this.form.message_id = this.messageInfo.id;
      let form = { ...this.form };
      let url = "/call-center/change-status";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.relod();
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    closeDialog() {
      this.$emit("closeDialog");
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

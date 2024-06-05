<template>
  <div>
    <v-dialog
      persistent
      v-model="dialogMessageLog.show"
      :model-id="dialogMessageLog.items"
      width="1000"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <span style="font-size: 19px">تاریخچه تغییر وضعیت پیام</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-toolbar>
        <BaseTable
          url="/recived-message/log"
          :headers="headers"
          :root-body="{ received_message_id: message_id }"
          :BTNactions="btn_actions"
        />
      </v-card>
      <!-- <v-card class="pa-2 lighten-3">
    
            <v-card-text>
         
            </v-card-text>
          </v-card> -->
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogMessageLog: {
      require: false,
      default: false,
    },
    message_id: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    headers: [],
    btn_actions: [],
    loading: false,
  }),
  beforeMount() {
    this.btn_actions =[
      {
        icon: "visibility",
        color: "btn_color",
        text: "نمایش فایل",
        fun: (body) => {
          if (body.img) {
            window.open(this.$getImage(body.img));
          }
          show_fun: (body) => {
            if (body.img) {
              return true;
            } else {
              return false;
            }
          };
        },
        show_fun: (body) => (body.img ? true : false),
      },
    ]
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
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_message,
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
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
      this.dialogMessageLog.show = false;
      this.dialogMessageLog.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

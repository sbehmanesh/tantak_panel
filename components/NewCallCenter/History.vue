<template>
  <div>
    <v-dialog
      persistent
      v-model="DialogHistory.show"
      :model-id="DialogHistory.items"
      fullscreen
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <span style="font-size: 21px">تاریخچه پیام</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-toolbar>
        <BaseTable
          url="/message/refer-log"
          :headers="headers"
          :root-body="{ message_id: MessageId }"
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
    DialogHistory: {
      require: false,
      default: false,
    },
    MessageId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    headers: [],
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
          if (body.from_personnel) {
            return body.from_personnel.first_name
              ? body.from_personnel.first_name + " " + body.from_personnel.last_name
              : "--";
          }
        },
      },
      {
        text: "به",
        value: (body) => {
          if (body.to_personnel) {
            return body.to_personnel.first_name
              ? body.to_personnel.first_name + " " + body.to_personnel.last_name
              : "--";
          } else {
            return "--";
          }
        },
      },

      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_message,
      },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.step_message,
      },
      {
        text: "نوع تخصیص",
        value: "type_send",
        filterType: "select",
        items: [
            { text: "تخصیص خودکار", value: "auto" },
            { text: "دستی", value: "multi" },
            { text: "بر اساس سابقه فروش", value: "sale" },
            { text: "بستن", value: "close" },
          ],
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
      this.DialogHistory.show = false;
      this.DialogHistory.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

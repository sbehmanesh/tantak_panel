<template>
  <div>
    <v-dialog
      persistent
      v-model="coordinatorDialog.show"
      :model-id="coordinatorDialog.items"
      width="600"
    >
      <v-card>
        <v-row class="mx-3 pt-8">
          <h1 style="font-size: 16px">برسی سفارش ثبت شده</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-row>

        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <div class="pa-6">
          <v-col cols="12" md="12">
            <amp-select
              rules="require"
              text="انتخاب مدیر هماهنگ کننده"
              :items="coordinator_list"
              v-model="coordinator_id"
            />
            <AmpUploadFile title="بارگذاری فایل" v-model="file" />

            <amp-textarea
              rules="require"
              text="توضیحات"
              v-model="message"
            ></amp-textarea>
          </v-col>
          <v-col cols="12" md="12">
            <amp-button
              text="تایید"
              block
              @click="submit"
              color="orange darken-4"
              :disabled="!Boolean(message) || !Boolean(coordinator_id)"
            />
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    coordinatorDialog: {
      require: false,
      default: false,
    },
    bsaketId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    coordinator_id: "",
    file: "",
    message: "",
    valid_comment: true,
    coordinator_list: [],
    loading: false,
  }),
  mounted() {
    this.coordinatorList();
  },
  methods: {
    submit() {
      this.loading = true;
      let form = {};
      form["id"] = this.bsaketId;
      form["message"] = this.message;
      form["user_refer_id"] = this.coordinator_id;
      form["file"] = this.file;
      form["step"] = "admin_manager_coordinator";
      let url = "basket/referral ";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("سفارش با موفقیت به هماهنگ کننده ارجاع داده شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    coordinatorList() {
      this.loading = true;
      let url = "/user/coordinator-manager";
      this.$reqApi(url)
        .then((res) => {
          if (res.model.data.length > 0) {
            let items = [];
            for (let index = 0; index < res.model.data.length; index++) {
              const element = res.model.data[index];
              items.push({
                text: element.first_name + " " + element.last_name,
                value: element.id,
              });
            }
            this.coordinator_list = items;
          }
          this.loading = false;
        })
        .catch((err) => {});
    },

    closeDialog() {
      this.coordinatorDialog.show = false;
      this.coordinatorDialog.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

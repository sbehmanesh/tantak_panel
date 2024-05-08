<template>
  <div>
    <v-dialog
      persistent
      v-model="commentDialog.show"
      :model-id="commentDialog.items"
      width="800"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <span style="font-size: 21px">برسی درخواست</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-toolbar>
        <v-tabs>
          <v-row class="ma-1 d-flex justify-center">
            <v-tab>
              <span>
                <v-icon size="15"> fact_check </v-icon>
                تعیین وضعیت
              </span>
            </v-tab>
            <v-tab>
              <span>
                <v-icon size="15"> mail </v-icon>
                افزودن نظر
              </span>
            </v-tab>
          </v-row>

          <v-tab-item>
            <v-col cols="12" md="12"> </v-col>
            <v-form
              v-model="valid"
              @submit.prevent="submit()"
              :disabled="loading"
              class="rounded-0 pa-8 d-flex flex-column"
            >
              <v-row class="ma-2">
                <v-col cols="12" md="6">
                  <amp-select
                    text="وضعیت"
                    v-model="form.status"
                    :items="$store.state.static.message_status"
                    rules="require"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <AmpUploadFile title="بارگذاری فایل" v-model="form.document[0].img" />
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  v-if="form.status == 'delayed' || form.status == 'call_back'"
                >
                  <amp-jdate
                    rules="require"
                    text="زمان مراجع بعدی"
                    v-model="form.document[0].end_at"
                    :max="now"
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <amp-textarea
                    rules="require"
                    text="توضیحات"
                    v-model="form.document[0].description"
                  ></amp-textarea>
                </v-col>
              </v-row>
              <v-row class="mb-2 mt-4 d-flex justify-center">
                <amp-button
                  text="تایید"
                  type="submit"
                  icon="done"
                  class="ma-1"
                  :disabled="!valid || loading"
                  :loading="loading"
                ></amp-button>
              </v-row>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <v-col cols="12" md="12"> </v-col>
            <v-col cols="12" md="12">
              <v-form
                v-model="valid_comment"
                @submit.prevent="sendComment()"
                :disabled="loading"
                class="rounded-0 pa-8 d-flex flex-column"
              >
                <amp-textarea
                  rules="require"
                  text="نظر درباره مشتری "
                  v-model="comment"
                ></amp-textarea>

                <v-row class="mb-2 mt-4 d-flex justify-center">
                  <amp-button
                    text="تایید"
                    type="submit"
                    @click="sendComment()"
                    icon="done"
                    class="ma-1"
                    :disabled="!valid_comment || loading"
                    :loading="loading"
                  ></amp-button>
                </v-row>
              </v-form>
            </v-col>
          </v-tab-item>
        </v-tabs>
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
    commentDialog: {
      require: false,
      default: false,
    },
    messageInfo: {
      require: false,
      default: false,
    },
    userInfo: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,

    comment: "",
    loading: false,
    form: {
      message_id: "",
      status: "",
      document: [{ img: "", end_at: "", description: "" }],
    },
  }),
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
    sendComment() {
      this.loading = true;

      let form = {};
      form["user_id"] = this.userInfo.id;
      form["comment"] = this.comment;
      let url = "/user-comment/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("نظر شما با  موفقیت ثبت شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.commentDialog.show = false;
      this.commentDialog.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

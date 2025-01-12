<template>
  <div>
    <v-dialog
      persistent
      v-model="dialog_change_status.show"
      :model-id="dialog_change_status.items"
      width="550"
    >
      <v-card class="pa-3">
        <v-card class="card-style">
          <v-row class="pa-4 ma-1 align-center">
            <v-toolbar-title>
              <span style="font-size: 21px">برسی درخواست</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog">
              <v-icon> close </v-icon>
            </v-btn>
          </v-row>

          <v-window v-model="step">
            <v-window-item :value="1">
              <v-form
                v-model="valid"
                @submit.prevent="submit()"
                :disabled="loading"
                class="d-flex flex-column"
              >
                <v-row class="ma-1 d-flex justify-center">
                  <v-col cols="12" md="12">
                    <amp-select
                      text="وضعیت"
                      v-model="form.status"
                      :items="$store.state.static.message_status"
                      rules="require"
                    />
                    <amp-jdate
                      v-if="
                        form.status == 'delayed' || form.status == 'call_back'
                      "
                      rules="require"
                      text="زمان مراجع بعدی"
                      v-model="form.document[0].end_at"
                    />
                    <amp-select
                      text="پیام های اماده"
                      :items="$store.state.setting.ready_messages"
                      v-model="ready_message"
                    />
                    <amp-textarea
                      rules="require"
                      text="توضیحات"
                      v-model="form.document[0].description"
                    ></amp-textarea>
                    <AmpUploadFile
                      title="بارگذاری فایل"
                      v-model="form.document[0].img"
                    />
                  </v-col>
                </v-row>
                <v-row class="mb-2 d-flex justify-center">
                  <v-col cols="4">
                    <amp-button
                      block
                      height="40"
                      text="تایید"
                      @click="funStep1()"
                      class="ma-1"
                      color="green"
                      :disabled="!valid || loading"
                      :loading="loading"
                    ></amp-button>
                  </v-col>
                </v-row>
              </v-form>
            </v-window-item>

            <v-window-item :value="2">
              <v-form
                v-model="valid_comment"
                @submit.prevent="sendComment()"
                :disabled="loading"
                class="rounded-0 pa-x d-flex flex-column"
              >
                <v-col cols="12" md="12">
                  <div
                    class="px-4"
                    v-for="(question, index) in questions_list"
                    :key="index"
                  >
                    <amp-select
                      :text="index + 1 + ' - ' + question.title"
                      v-model="answers_list[index]"
                      :items="question.answer"
                      rules="require"
                    />
                  </div>
                  <amp-textarea
                    class="mx-4"
                    rules="require"
                    text="توضیحات"
                    v-model="comment"
                  ></amp-textarea>
                </v-col>

                <v-row class="mb-2 d-flex justify-center">
                  <v-col cols="6" md="3">
                    <amp-button
                      block
                      height="40"
                      text="برگشت"
                      color="red darken-2"
                      @click="step--"
                      class="ma-1"
                      :loading="loading"
                    ></amp-button>
                  </v-col>
                  <v-col cols="6" md="3">
                    <amp-button
                      block
                      height="40"
                      text="ثبت نظر"
                      color="green"
                      type="submit"
                      @click="submit()"
                      class="ma-1"
                      :disabled="!valid_comment || loading"
                      :loading="loading"
                    ></amp-button>
                  </v-col>
                </v-row>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card>
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
    dialog_change_status: {
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
    questions_list: [],
    step: 1,
    answers_list: [],
    comment: "",
    ready_message: "",

    loading: false,
    form: {
      message_id: "",
      status: "",
      document: [{ img: "", end_at: "", description: "" }],
    },
  }),
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "تعیین وضعیت پیام ارجاع داده شده";
        case 2:
          return "نظردهی درباره مشتری";
      }
    },
  },
  watch: {
    ready_message() {
      this.form.document[0].description = this.ready_message;
    },
  },
  mounted() {
    this.$store.dispatch("setting/readyMessages");

    this.loadQuestions();
  },
  methods: {
    submit() {
      this.loading = true;
      this.form.message_id = this.messageInfo.id;
      let form = { ...this.form };
      let url = "/message/change-status";
      this.$reqApi(url, form)
        .then((res) => {
          if (this.form.status == "done") {
            this.sendComment();
          } else {
            this.$toast.success("تعیین وضعیت پیام با موفقیت انجام شد");
            this.loading = false;
          }
          this.relod();
          this.closeDialog();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadQuestions() {
      this.loading = true;
      this.$reqApi(`comment-question`)
        .then((res) => {
          let questions = [];
          for (let index = 0; index < res.model.data.length; index++) {
            let answer_question = [];
            const x = res.model.data[index];
            x.answers.map((y) => {
              answer_question.push({
                text: y.answer,
                value: y.id,
              });
            });
            questions.push({
              title: x.question,
              answer: answer_question,
            });
          }
          this.questions_list = questions;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    sendComment() {
      let form = {};
      form["user_id"] = this.userInfo.id;
      form["answers"] = this.answers_list;
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
      this.dialog_change_status.show = false;
      this.dialog_change_status.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    funStep1() {
      if (this.form.status == "done") {
        this.step++;
      } else {
        this.submit();
      }
    },
  },
};
</script>

<style scoped>
.card-style {
  border: 7px double #afafaf;
}
</style>

<template>
  <div>
    <v-col cols="12">
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-col cols="12">
            <BaseTable
              url="user-comment"
              :rootBody="{user_id : modelId}"
              :headers="header_comments"
              :BTNactions="btn_actions"
            />
          </v-col>
        </v-window-item>
        <v-window-item :value="2">
          <v-col cols="12" v-for="(item, index) in question_form" :key="index">
            <v-row>
              <v-col cols="6" class="mr-2">
                <h1 class="black--text font_13">
                  {{ index + 1 }} -
                  {{ item.question }}
                </h1>

                <small class="black--text mr-5">
                  {{ item.answer }}
                </small>
              </v-col>
            </v-row>
            <v-divider class="grey mt-2 lighten-3"></v-divider>
          </v-col>
          <v-row class="d-flex justify-center mt-4">
            <v-col cols="3">
              <amp-button
                block
                height="40"
                @click="step--"
                color="red darken-1 "
                class="ma-1"
                text="برگشت"
              />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
  },
  components: {},
  data: () => ({
    header_comments: [],
    extraBtn: [],
    btn_actions: [],
    question_form: [],

    step:1,
  }),
  beforeMount() {
    this.header_comments = [
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
        text: "ثبت کننده",
        value: (body) => {
          if (body.personnel) {
            if (body.personnel.first_name && body.personnel.last_name) {
              return body.personnel.first_name + " " + body.personnel.last_name;
            } else {
              return body.personnel.username;
            }
          }
        },
      },
      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "توضیحات",
        filterCol: "comment",
        type: "tooltip",
        function: (body) => {
          if (body.comment) {
            return body.comment;
          }
        },
        value: (body) => {
          if (typeof body.comment == "string") {
            if (body.comment.length < 25) {
              return body.comment;
            }
            return body.comment.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
  },
  mounted() {
    this.btn_actions = [
      {
        text: "پاسخ های داده شده",
        icon: "chat",
        color: "info darken-2",
        fun: (body) => {
          this.step++;
          this.loadQusestions(body.answers);
        },
      },
    ];
  },
  methods: {
    loadQusestions(answers) {
      // --------------------------
      this.loading = true;
      let ids = [];
      ids = JSON.parse(answers);
      this.$reqApi(`comment-question`)
        .then((res) => {
          let questions = [];
          for (let index = 0; index < res.model.data.length; index++) {
            const x = res.model.data[index];

            x.answers.map((y) => {
              questions.push({
                title: x.question,
                answer: y.answer,
                id: y.id,
              });
            });
          }
          this.loading = false;
          this.ctrateFormQuestions(ids, questions);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    ctrateFormQuestions(ids, questions) {
      let items = [];
      for (let index = 0; index < questions.length; index++) {
        const element = questions[index];
        ids.map((x) => {
          if (x == element.id) {
            items.push({
              question: element.title,
              answer: element.answer,
            });
          }
        });
      }
      this.question_form = items;
    },

  },
};
</script>

<style></style>

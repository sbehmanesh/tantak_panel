<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense class="justify-center">
          <v-col cols="12" md="4">
            <amp-autocomplete
              text="دسته بندی"
              v-model="form.category_id"
              :items="category_items"
              rules="require"
            />
          </v-col>

          <v-col cols="12" md="4">
            <amp-autocomplete
              text="نوع سوال"
              v-model="form.type"
              :items="$store.state.static.type_questions"
              rules="require"
            />
          </v-col>

          <v-col cols="12" md="4">
            <amp-input
              prepend-inner-icon="help"
              text="عنوان سوال"
              rules="require"
              v-model="form.question"
            />
          </v-col>

          <v-col cols="12" md="9" v-if="form.type == 'option'" class="mt-5">
            <v-divider></v-divider>

            <v-divider></v-divider>

            <v-card class="pa-5 elevation-0 text-center">
              <v-btn small icon @click="addAnswer()" x-large>
                <v-icon color="grey"> add_circle </v-icon>
              </v-btn>

              <h1 class="font_13 mb-8">برای ایجاد گزینه کلیک کنید</h1>

              <v-row>
                <v-col
                  v-for="(item, index) in answers_items"
                  :key="index"
                  cols="12"
                  md="6"
                >
                  <v-card outlined class="elevation-1 rounded-0">
                    <v-card
                      class="pa-2 d-flex align-center mb-5 elevation-1 rounded-0"
                    >
                      <h1 class="font_14">گزینه {{ index + 1 }}</h1>

                      <v-spacer></v-spacer>

                      <v-btn @click="deletAnswr(index)" icon>
                        <v-icon small> delete </v-icon>ّ
                      </v-btn>
                    </v-card>

                    <v-col cols="12" class="pa-0">
                      <amp-input
                        placeholder="عنوان گزینه را وارد کنید"
                        rules="require"
                        v-model="item.answer"
                      />
                    </v-col>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <v-divider class="mt-4"></v-divider>

            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="12"> </v-col>

          <v-col cols="12" md="12" class="text-center">
            <amp-button
              large
              icon="redo"
              class="my-1"
              color="error"
              text="انصراف"
              @click="redirectPage()"
            />

            <amp-button
              large
              icon="done"
              class="my-1"
              type="submit"
              color="success"
              :loading="loading"
              :disabled="!valid || loading"
              :text="modelId ? 'ویرایش' : 'ثبت'"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  props: {
    roleId: { default: null },
    modelId: { default: null },
    path: { default: "/comment-question" },
    showUrl: { default: "/comment-question/show" },
    createUrl: { default: "/comment-question/insert" },
    updateUrl: { default: "/comment-question/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    answers_items: [],
    category_items: [],
    items: [],
    form: {
      question: "",
      category_id: "",
      type: "",
    },
  }),
  beforeMount() {
    this.loading = true;
    this.getCategouryes();
  },
  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      if (this.answers_items.length > 0) {
        form["options"] = [];
        for (let answer in this.answers_items) {
          form.options.push(this.answers_items[answer].answer);
        }
      } else if (this.form.type == "option") {
        this.$toast.error("لطفا گزینه های سوال را تعریف کنید");
        this.loading = false;
        return;
      }
      {
      }

      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          this.form.question = response.data.question;
          this.form.category_id = response.data.category_id;
          this.form.type = response.data.type;
          let items = [];
          for (let i = 0; i < response.data.answers.length; i++) {
            const x = response.data.answers[i];
            items.push({
              answer: x.answer,
            });
          }
          this.answers_items = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    addAnswer() {
      this.answers_items.push({
        answer: "",
      });
    },
    deletAnswr(index) {
      let items = this.answers_items;
      items.splice(index, 1);
      this.answers_items = items;
    },
    getCategouryes() {
      this.$reqApi("/comment-category")
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            items.push({
              text: x.title,
              value: x.id,
            });
          }
          this.category_items = items;
          if (this.modelId) {
            this.loadData();
          } else {
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>

<style>
</style>

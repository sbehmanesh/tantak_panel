<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="12">
            <amp-input
              prepend-inner-icon="help"
              text="عنوان سوال"
              rules="require"
              v-model="form.question"
            />
          </v-col>
          <v-col cols="12">
            <amp-section text="تعریف گزینه" />
          </v-col>
          <v-col cols="12">
            <v-row class="justify-end">
              <amp-button
                icon="add_circle"
                class="my-1"
                color="info"
                text="افزودن گزینه"
                @click="addAnswer()"
              />
            </v-row>
          </v-col>

          <v-col v-for="(item, index) in answers_items" :key="index" cols="12" md="12">
            <v-row>
              <v-col cols="11">
                <amp-input
                  :text="'گزینه' + ' ' + (index + 1)"
                  rules="require"
                  v-model="item.answer"
                />
              </v-col>
              <v-btn @click="deletAnswr(index)" x-small class="mt-13" text>
                <v-icon> cancel </v-icon>ّ
              </v-btn>
            </v-row>
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
    items: [],
    title: "ناحیه ها",
    form: {
      question: "",
    },
  }),
  beforeMount() {
    if (this.modelId) {
      this.loadData();
    }
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
        form["answers"] = this.answers_items;
      } else {
        this.$toast.error("لطفا گزینه های سوال را تعریف کنید");
        this.loading = false;
        return;
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
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          this.form.question = response.data.question;
          this.answers_items = response.data.answers;

          this.loading = false;
        })
        .catch((error) => {
          // this.redirectPage();
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

<style></style>

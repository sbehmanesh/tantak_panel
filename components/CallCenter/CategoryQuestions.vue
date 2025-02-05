<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense class="justify-center">
          <v-col cols="12" md="4">
            <amp-input
              text="عنوان دسته بندی"
              rules="require"
              v-model="form.title"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-input
              text="عنوان دسته بندی (انگلیسی)"
              rules="require,en_chart"
              v-model="form.en_title"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-select
              :items="$store.state.static.status"
              text="وضعیت"
              v-model="form.status"
            />
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
    showUrl: { default: "/comment-category/show" },
    createUrl: { default: "/comment-category/insert" },
    updateUrl: { default: "/comment-category/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    form: {
      title: "",
      en_title: "",
      status: "active",
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
          for (let key in response.model) {
            this.form[key] = response.model[key];
          }

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
      }
    },
  },
};
</script>

<style></style>

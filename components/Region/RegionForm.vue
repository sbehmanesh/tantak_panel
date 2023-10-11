<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="3">
            <amp-input text="نام" rules="require" v-model="form.fa_name" />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              text=" نام (English)"
              rules="require"
              v-model="form.en_name"
              class="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              class="ltr-item"
              text=" کد ناحیه"
              rules="require,number"
              v-model="form.code"
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
    path: { default: "/region" },
    showUrl: { default: "/region/show" },
    createUrl: { default: "/region/insert" },
    updateUrl: { default: "/region/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    headers: [],
    items: [],
    actions: [],
    title: "ناحیه ها",
    form: {
      fa_name: "",
      en_name: "",
      code: "",
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
      form.username = this.$FarsiToEnglishNumber(form.username);
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
          this.form.fa_name = response.model.fa_name;
          this.form.en_name = response.model.en_name;
          this.form.code = response.model.code;

          this.loading = false;
        })
        .catch((error) => {
          // this.redirectPage();
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
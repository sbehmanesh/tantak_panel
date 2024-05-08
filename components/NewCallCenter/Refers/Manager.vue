<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="6">
        <amp-select :items="step" v-model="form.step" />
      </v-col>
      <v-col cols="12" md="6">
        <amp-select :items="step" v-model="form.type_send" />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    step: [
      { text: "بستن", value: "close" },
      { text: "ارجاع به مرکز تماس", value: "manager_to_supervisor" },
    ],
    valid: false,
    loading: false,
    createUrl: "/brand/insert",
    updateUrl: "/brand/update",
    showUrl: "/brand/show",
    form: {
      step: "",
      type_send: "",
    },
  }),
  mounted() {
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
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
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
          let res = response.model;
          this.form.id = res.id;
          this.form.name = res.name;
          this.form.sort = res.sort;
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
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

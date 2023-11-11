<template>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="3">
            <amp-input text="نام" v-model="form.name" rules="require" />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input text="ترتیب نمایش" v-model="form.sort" rules="number" is-number />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12" md="12">
            <v-divider />
          </v-col>
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
  </template>
  
  <script>
  export default {
    props: {
      modelId: { default: null }
    },
    data: () => ({
      valid: false,
      loading: false,
      createUrl: "/brand/insert",
      updateUrl: "/brand/update",
      showUrl: "/brand/show",
      form: {
        name: "",
        sort:'',
      }
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
          .then(response => {
            if (!this.modelId) {
              this.$toast.success("اطلاعات ثبت شد");
            } else {
              this.$toast.success("اطلاعات ویرایش شد");
            }
            this.redirectPage();
          })
          .catch(error => {
            this.loading = false;
          });
      },
      loadData() {
        this.loading = true;
        this.$reqApi(this.showUrl, { id: this.modelId })
          .then(async response => {
            let res = response.model;
            this.form.id = res.id;
            this.form.name = res.name
            this.form.sort = res.sort
            this.loading = false;
          })
          .catch(error => {
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
    }
  };
  </script>
  
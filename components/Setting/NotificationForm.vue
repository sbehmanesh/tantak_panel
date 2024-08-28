<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="3">
          <amp-input text="متن" v-model="form.text" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="نوع "
            v-model="form.type"
            rules="require"
            :items="$store.state.static.notif_type"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="وضعیت"
            v-model="form.status"
            rules="require"
            :items="$store.state.static.status"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="مربوط به بخش"
            v-model="form.section_id"
            rules="require"
            :items="sections"
          />
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
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/custom-notification/insert",
    updateUrl: "/custom-notification/update",
    showUrl: "/custom-notification/show",
    sections: [],
    form: {
      text: "",
      status: "active",
      section_id: "",
      type: "",
    },
  }),

  beforeMount() {},
  mounted() {
    this.getKey();
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
          response = response.data;
          for (let i in response) {
            this.form[i] = response[i];
          }
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    getKey() {
      this.loading = true;

      this.$reqApi("/setting", { filters: { key: "custom_notif" } })
        .then(async (response) => {
          let data = response.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push({
              text: element.value,
              value: element.id,
            });
          }
          this.sections = items;
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

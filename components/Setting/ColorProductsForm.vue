<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="text-center"
  >
    <v-row class="pa-10 justify-center">
      <v-col cols="12" md="4">
        <amp-input text="نام رنگ" v-model="form.value" rules="require" />
      </v-col>
      <v-col cols="12" md="4">
        <amp-input
          text="نام رنگ (انگلیسی)"
          v-model="form.value_json"
          rules="require,en_chart"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-labale text=" انتخاب رنگ " />
        <v-color-picker
          dot-size="10"
          class="mr-3"
          hide-canvas
          mode="hexa"
          rules="require"
          v-model="form.value_2"
        ></v-color-picker
      ></v-col>
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
    createUrl: "/setting/insert",
    updateUrl: "/setting/update",
    showUrl: "/setting/show",
    settings: [],
    selected: {},
    form: {
      key: "product_colors ",
      value: "",
      value_2: "",
      value_json: "",
    },
  }),

  beforeMount() {},
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      let new_data = {
        name_en : form.value_json
      };
      form.value_json =     JSON.stringify(new_data)
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
          response = response.model;
          this.form["id"] = response.id;
          this.form.key = response.key;
          this.form.value = response.value;
          this.form.value_2 = response.value_2;
          let en_name = JSON.parse(response.value_json);

          this.form.value_json = en_name.name_en;
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

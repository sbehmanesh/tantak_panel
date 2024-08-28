<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="6">
          <amp-input
            text="عنوان فارسی"
            rules="require,fa_chart"
            v-model="form.value"
          />
        </v-col>
        <v-col cols="12" md="6">
          <amp-input
            text="عنوان انگلیسی"
            rules="require,en_chart"
            v-model="form.value_2"
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
            @click="$router.push('/setting/message-algouritm')"
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
  components: {},
  props: { modelId: { default: null } },
  data: () => ({
    valid: false,
    loading: false,
    form: {
      key: "custom_notif",
      value: "",
      value_2: "",
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
      let url = "/setting";
      if (this.modelId) {
        url = "/setting/update";
        form["id"] = this.modelId;
      } else {
        url = "/setting/insert";
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.$router.push("/setting/message-algouritm");
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/setting/show", { id: this.modelId })
        .then(async (response) => {
          this.form["id"] = response.model.id;
          this.form.value = response.model.value;
          this.form.value_2 = response.model.value_2;
          this.loading = false;
        })
        .catch((error) => {
          this.$router.push("/setting/message-algouritm");
          this.loading = false;
        });
    },
  },
};
</script>

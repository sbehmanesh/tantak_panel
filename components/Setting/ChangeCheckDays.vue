<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="6">
          <amp-input
            text="مقدار روزهای چک"
            v-model="form.value_2"
            rules="require"
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
            @click="$router.push('/setting/change-check-days')"
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
    showUrl: "/setting/show",
    settings: [],
    selected: {},
    form: {
      id: "",
      key: "access_demand_note",
      value_2: "",
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
      this.loading = true;
      let url = "/setting/update";
      form["id"] = this.modelId;
      this.$reqApi(url, form)
        .then((response) => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.$router.push("/setting/change-check-days");
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
          this.form.value_2 = response.value_2;
          this.loading = false;
        })
        .catch((error) => {
          this.$router.push("/setting/change-check-days");
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="4">
          <amp-autocomplete
            rules="require"
            text="انتخاب مدیر نمایندگی"
            v-model="form.value"
            :items="mangers"
          />

          <amp-input
            text=" درصد اعتبار"
            v-model="form.value_2"
            rules="require,percent"
            cClass="ltr-item"
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
import UserSelectForm from "../User/UserSelectForm.vue";

export default {
  components: {
    UserSelectForm,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/setting/insert",
    updateUrl: "/setting/update",
    showUrl: "/setting/show",

    role_id: [],
    mangers: [],
    form: {
      id: "",
      key: "credit_percentage_for_agency_manager ",
      value: "",
      value_2: "",
    },
  }),

  beforeMount() {
    this.getSealManager(this.$store.state.auth.role.seal_manager);
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
          response = response.model;
          this.form["id"] = response.id;
          this.form.key = response.key;
          this.form.value = response.value;
          this.form.value_2 = response.value_2;
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    getSealManager(id) {
      this.loading = true;
      this.$reqApi("user/searchByRole", { role_id: [id] })
        .then(async (response) => {
          for (let i = 0; i < response.model.data.length; i++) {
            const x = response.model.data[i];
            const user =
              Boolean(x.first_name) && Boolean(x.last_name)
                ? `${x.first_name} ${x.last_name}`
                : x.username;
            this.mangers.push({ text: user, value: x.id });
          }

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

<template>
  <div>
    <v-dialog
      persistent
      v-model="personnelDialog.show"
      :model-id="personnelDialog.items"
      width="500"
    >
      <v-card class="card-dialog">
        <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
          <v-col cols="12">
            <div class="text-center">
              <v-icon size="75">account_circle</v-icon>
              <h1
                v-if="!loading && get_user_info"
                class="font_11"
                v-text="user"
              />
              <small v-if="!loading"> ( {{ username }} ) </small>
              <div v-else>
                <v-progress-circular
                  :size="15"
                  indeterminate
                  color="grey"
                ></v-progress-circular>
              </div>
            </div>
          </v-col>
          <v-row dense class="d-flex justify-center my-3">
            <v-col cols="12" md="10" class="text-center">
              <amp-select
                text="انتخاب داخلی"
                v-model="form.internal_id"
                rules="require"
                :items="internal_items"
              />
              <amp-input
                text="شمار پورت داخلی"
                v-model="form.internal_port"
                cClass="ltr-item"
                rules="require"
              />
            </v-col>
          </v-row>

          <v-row class="d-flex justify-center">
            <v-col cols="12" md="2">
              <amp-button
                type="submit"
                color="teal"
                :loading="loading"
                :disabled="!valid || loading"
                :text="user_id ? 'ویرایش' : 'ثبت'"
              />
            </v-col>
            <v-col cols="12" md="2">
              <amp-button
                block
                color="error"
                text="انصراف"
                @click="closeDialog()"
              />
              <v-col />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    user_id: { require: false, default: false },
    personnelDialog: { require: false, default: false },
  },
  data: () => ({
    valid: false,
    loading: false,
    get_user_info: false,
    updateUrl: "/user/internal-personnel/update",
    showUrl: "/user/internal-personnel/show",
    internal_items: [],
    selected: {},
    user: "",
    username: "",
    form: {
      id: "",
      internal_id: "",
      internal_port: "",
    },
  }),

  mounted() {
    if (this.user_id) {
      this.loadData();
    }
    this.loadInternals();
  },

  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.updateUrl;
      form["id"] = this.user_id;
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.user_id) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.loading = false;
          this.closeDialog();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.user_id })
        .then(async (response) => {
          this.form.id = response.data.id;
          this.user =
            response.data.first_name && response.data.last_name
              ? response.data.first_name + " " + response.data.last_name
              : " -- ";
          this.username = response.data.username;
          this.form.internal_port = response.data.internal_port;
          this.form.internal_id = response.data.internal_id;
          this.loading = false;
          this.get_user_info = true;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadInternals() {
      this.$reqApi("/internal")
        .then(async (response) => {
          let items = [];
          response.model.data.forEach((x) => {
            items.push({
              text: x.server_name + " | " + x.start_port + " - " + x.end_port,
              value: x.id,
            });
          });
          this.internal_items = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.personnelDialog.show = false;
    },
  },
};
</script>

<style scoped>
.card-dialog {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}
</style>

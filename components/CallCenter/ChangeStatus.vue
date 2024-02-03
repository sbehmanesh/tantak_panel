<template>
  <div>
    <v-dialog
      persistent
      v-model="dialog_change_status.show"
      :model-id="dialog_change_status.items"
      width="500"
    >
      <v-card class="pa-2">
        <v-card-title>
          <span style="font-size: 21px">برسی درخواست</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form
            v-model="valid"
            @submit.prevent="submit()"
            :disabled="loading"
            class="rounded-0 pa-2 d-flex flex-column"
          >
            <v-row class="ma-2">
              <v-col cols="12" md="12">
                <amp-select
                  text="وضعیت"
                  v-model="form.status"
                  :items="$store.state.static.message_status"
                  rules="require"
                />
              </v-col>
            </v-row>
            <v-row class="ma-1 d-flex justify-center">
              <amp-button
                text="تایید"
                type="submit"
                icon="done"
                class="ma-1"
                :disabled="!valid || loading"
                :loading="loading"
              ></amp-button>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <script>
export default {
  props: {
    dialog_change_status: {
      require: false,
      default: false,
    },
    message_id: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    loading: false,
    form: {
      message_id: "",
      status: "",
    },
  }),
  methods: {
    submit() {
      this.loading = true;
      this.form.message_id = this.message_id;
      let form = { ...this.form };
      let url = "/call-center/change-status";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.dialog_change_status.show = false;
      this.dialog_change_status.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>
  
  <style>
</style>
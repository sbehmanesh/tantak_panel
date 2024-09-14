<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card style="overflow: hidden" class="pa-3">
        <v-col cols="12" class="pa-0 ma-0">
          <v-alert dense prominent icon="event_repeat" class="pa-0 ma-0">
            <h1 class="font_18">کنسل کردن سفارش</h1>
          </v-alert>
          <v-divider class="my-3"></v-divider>
        </v-col>
        <v-form v-model="valid">
          <v-col cols="12" class="pa-0 ma-0">
            <AmpUploadFileNew
              text="بارگذاری فایل"
              v-model="form.file"
              class="mb-5"
            />
            <amp-textarea
              text=" توضیحات"
              rules="require"
              v-model="form.message"
              :rows="2"
            />
          </v-col>
        </v-form>

        <v-card-actions>
          <v-row class="d-flex justify-center pa-1">
            <amp-button
              text="انصراف"
              @click="closeDialog"
              color="red"
              class="ma-2"
            />
            <amp-button
              text="تایید"
              @click="submit"
              color="success darken-1"
              class="ma-2"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },

    getApi: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      form: {
        step: "cancel",
        message: "",
        id: "",
      },
    };
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.id = this.getApi;
      this.$reqApi("product-request/referral", form)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.$emit("reload");
          this.closeDialog();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

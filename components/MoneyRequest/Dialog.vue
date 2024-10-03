<template>
  <v-dialog v-model="dialog" persistent max-width="350">
    <v-card>
      <v-card-title> برسی درخواست </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <amp-select
            :items="items"
            text="وضعیت"
            rules="require"
            v-model="form.status"
          />
          <AmpUploadFileNew title="بارگذاری فایل" v-model="form.file" />
          <amp-textarea
            text="پیام"
            v-model="form.message"
            rules="require"
          ></amp-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <amp-button
          text="تایید "
          @click="submit"
          color="green darken-1"
          class="ma-1"
          height="38"
          :disabled="!valid || loading"
          :loading="loading"
        />
        <amp-button
          text="انصراف "
          @click="cloadDialog"
          color="red darken-1"
          class="ma-1"
          height="38"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    requestId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      form: {
        status: "",
        file: "",
        message: "",
        id: "",
      },
      items: [
        { text: "تایید شده", value: "done" },
        { text: "رد شده", value: "reject" },
      ],
    };
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.id = this.requestId;
      this.$reqApi("money-request/fix-status", form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.cloadDialog()
          this.$emit("reload")
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    cloadDialog() {
      this.$emit("cloadDialog");
    },
  },
};
</script>

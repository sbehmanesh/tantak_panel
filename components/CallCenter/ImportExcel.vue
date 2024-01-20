<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex align-center">
        <v-col cols="12" md="6">
          <amp-labale :text="text" />
          <v-file-input dense outlined accept=".xlsx" v-model="form.file" />
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-btn
            @click="reciveCaveNgar()"
            :loading="loading"
            class="success mt-2"
            >دریافت از کاوه نگار
            <v-icon class="mx-2">call_received</v-icon></v-btn
          >
        </v-col>
        <div class="mr-2">
          <v-btn title="مشاهده و بارگیری" icon @click="open">
            <v-icon size="30"> download </v-icon>
          </v-btn>
          <br />
          <span style="font-size: 11px">فایل نمونه</span>
        </div>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button
            large
            text="ثبت"
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      require: true,
    },
    backurl: {
      type: String,
    },
    text: {
      type: String,
      default: "فایل اکسل",
    },
  },
  data: () => ({
    valid: false,
    loading: false,
    form: {
      file: null,
    },
  }),
  methods: {
    submit() {
      if (this.form.file == null) {
        return;
      }
      let form_data = new FormData();
      for (const key in this.form) {
        form_data.append(key, this.form[key]);
      }

      this.loading = true;
      this.$reqApi(this.url, form_data)
        .then((response) => {
          this.$toast.success("اطلاعات ثبت شد");
          this.$toast.success(
            `تعداد ${response.data.new_messages_added} پیام اضافه شد`
          );
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    reciveCaveNgar() {
      this.loading = true;
      this.$reqApi("/recived-message/get-all-message")
        .then((res) => {
          this.loading = true;
          this.$toast.success("عملیات با موفقیت انجام شد");
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    open() {
      window.open(
        "https://test-api.tantak.ir/example/RecivedMessagesFromKavenegar.xlsx"
      );
    },
  },
};
</script>

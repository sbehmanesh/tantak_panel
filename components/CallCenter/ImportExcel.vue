<template>
  <v-tabs>
    <v-row class="d-flex justify-center">
      <v-tab>
        <v-icon left> download </v-icon>
        در یافت از کاوه نگار
      </v-tab>
      <v-tab>
        <v-icon left> attach_file </v-icon>
        بارگذاری اکسل
      </v-tab>
    </v-row>

    <v-tab-item class="my-8">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-btn @click="reciveCaveNgar()" :loading="loading_recive" class="info mt-2"
            >دریافت از کاوه نگار <v-icon class="mx-2">call_received</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item class="my-8">
      <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
        <v-col cols="12" md="12">
          <amp-labale :text="text" />
          <v-file-input dense outlined :accept="accept" v-model="form.file" />
        </v-col>

        <div class="mr-2">
          <v-btn title="مشاهده و بارگیری" icon @click="open">
            <v-icon size="30"> download </v-icon>
          </v-btn>
          <br />
          <span style="font-size: 11px">فایل نمونه</span>
        </div>

        <v-row dense>
          <v-col cols="12" md="12">
            <v-divider />
          </v-col>
          <v-col cols="12" md="12" class="text-center">
            <amp-button
              large
              text="تایید"
              icon="done"
              class="mt-4"
              type="submit"
              color="info"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-tab-item>
  </v-tabs>

  <!-- <div>
    <v-tabs v-model="tab" background-color="transparent" color="basil" >
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>

      </v-tab-item>
      <v-tab-item>
        <v-row class="d-flex justify-center ma-15 border">

        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </div> -->
</template>

<script>
export default {
  props: {

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
    check: false,
    accept: [".xlsx", ".xls"],
    loading: false,
    loading_recive: false,
    form: {
      file: null,
    },
    tab: null,
    items: ["دریافت از کاوه نگار ", "بارگذاری اکسل"],
  }),

  methods: {
    submit() {
      this.loading = true;
      let check = false;
      if (this.form.file == null) {
        this.loading = false;
        this.$toast.error("بارگذاری اکسل اجباری میباشد");
        return;
      }
      let form_data = new FormData();
      for (const key in this.form) {
        form_data.append(key, this.form[key]);
        check = true;
      }
      if (check == false) {

        return;
      } else {
        this.$reqApi("/message/import-excel", form_data)
          .then((response) => {
            this.loading = false;
            this.$toast.success("اطلاعات ثبت شد");
            this.$toast.success(
              `تعداد ${response.data.new_messages_added} پیام اضافه شد`
            );
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    reciveCaveNgar() {
      this.loading_recive = true;
      this.$reqApi("/message/get-all-message")
        .then((res) => {
          if (res.message_count == 0) {
            this.$toast.info(" ! پیامی برای دریافت وجود ندارد ");
          } else {
            this.$toast.success("عملیات با موفقیت انجام شد");
          }
          this.loading_recive = false;
        })
        .catch((err) => {
          this.loading_recive = false;
          return err;
        });
    },
    open() {
      window.open("https://test-api.tantak.ir/example/message.xlsx");
    },
  },
};
</script>
<style scoped>
.border {
  border: 3px dashed #00000049;
}
</style>

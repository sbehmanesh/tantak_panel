<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card style="overflow: hidden">
        <v-alert dense prominent icon="post_add" class="grey lighten-2">
          <h1 class="font_17">ایجاد تراکنش</h1>
        </v-alert>
        <v-card-text class="pa-5">
          <v-col cols="12" class="ma-0 pa-0">
            <amp-select
              v-model="type_payment"
              text=" نوع پرداخت را انتخاب کنید"
              :items="items"
            />
          </v-col>

          <v-row class="justify-center mt-3">
            <amp-button
              text="انصراف"
              class="ma-1"
              height="38"
              color="red"
              @click="closeDialog"
              :disabled="loading"
              :loading="loading"
            />
            <amp-button
              text="تایید"
              height="38"
              color="green darken-1"
              @click="createPayment"
              :disabled="loading || !Boolean(type_payment)"
              :loading="loading"
              class="ma-1"
            />


          </v-row>
        </v-card-text>
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
    requestId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      type_payment: "",
      loading: false,
      items: [
        { text: "  کارت به کارت ", value: "cardToCard" },

        { text: "ارسال لینک پرداخت", value: "send_pay_link" },
      ],
    };
  },

  methods: {
    createPayment(id) {
      this.loading = true;
      let form = {
        id: this.requestId,
        type_payment: this.type_payment,
      };
      this.$reqApi("debt/insert-payment", { ...form })
        .then((res) => {
          this.$toast.success("تراکنش با موفقیت ایجاد شد");
          this.$emit("reload");
this.closeDialog()
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

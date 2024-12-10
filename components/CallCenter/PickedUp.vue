<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450">
      <v-card style="overflow: hidden">
        <v-card-title class="grey lighten-2"> خروج از انبار </v-card-title>

        <v-card-text>
          <v-col cols="12" class="text-center">
            <v-icon> notifications_active </v-icon>
          </v-col>
          <div class="text-center">
            <h1 class="font_12">
              درصورتی موجودی درخواستی در سبد خرید در انبار موجود باشد; موجودی
              سبد خرید از انبار کسر میگردد و در غیر این صورت باید با مدیر
              نمایندگی خود هماهنگ کنید
            </h1>
          </div>
          <amp-textarea
            :rows="3"
            text="دلیل خروج"
            v-model="message"
            class="mt-5"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-row class="ma-3 d-flex justify-center">
          <amp-button
            text="تایید"
            color="green darken-1"
            height="37"
            class="ma-1"
            @click="submit"
            :disabled="!Boolean(message)"
          />
          <amp-button
            @click="closeDialog"
            text="بستن"
            color="red darken-1"
            height="37"
            class="ma-1"
          />
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },
    basketId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    submit() {
      let form = {
        message: this.message,
        basket_id: this.basketId,
      };

      this.$reqApi("sale-agency-stock/sale", form)
        .then((res) => {
          this.$toast.success("خروج انجام شد");
          this.$emit("refresh")
          this.$emit("closeDialog");
        })
        .catch((err) => {
          return err;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

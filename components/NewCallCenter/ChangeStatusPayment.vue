<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="440">
      <v-card
        class="elevation-0 pa-6 text-center"
        style="overflow: hidden !important"
      >
        <v-form v-model="valid">
          <amp-select
            text="تغییر وضعیت"
            v-model="change_staus"
            :items="items_staus"
            rules="require"
          >
          </amp-select>
          <amp-jdate
            text="تاریخ پرداخت"
            v-model="form.paid_date"
            rules="require"
            v-if="change_staus == 'payed'"
          />
          <amp-upload-file
            title="رسید پرداخت"
            v-model="form.receipt_img"
            rules="require"
            class="my-3"
            Cclass="success"
            v-if="change_staus == 'payed'"
          />
          <amp-textarea
            text="توضیحات"
            v-model="form.description"
            rules="require"
        
          />
          <v-card-actions class="center-div">
            <amp-button
              text="تایید"
              color="success"
              @click="changeStatus"
              :disabled="!valid"
              :loading="loading"
            />
            <amp-button text="انصراف" color="error" @click="cloasDialog" />
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },
    paymentId: {
      default: "",
      type: String,
    },
  },

  data() {
    return {
      items_staus: [
        { text: "پرداخت شده", value: "payed" },
        { text: "کنسل شده", value: "cancled" },
      ],
      form: {
        status: "",
        description: "",
        paid_date: "",
        receipt_img: "",
      },
      loading: false,
      valid: true,
      change_staus: "",
    };
  },
  mounted() {
    this.items = this.data;
  },
  methods: {
    changeStatus() {
      if (this.change_staus == "payed" && !Boolean(this.form.receipt_img)) {
        this.$toast.error("بارگذاری رسید اجباری است");
        return;
      }

      if (this.change_staus) {
        this.loading = true;
        let form = {
          status: this.change_staus,
          id: this.paymentId,
          description: this.form.description,
          paid_date: this.form.paid_date,
          receipt_img: this.form.receipt_img,
        };
        this.$reqApi("/payment/confirmation-manual", form)
          .then((res) => {
            this.overlay = false;
            this.relod();
            this.cloasDialog();
            this.$toast.success("عملیات با موفقیت انجام شد");
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;

            return err;
          });
      }
    },
    relod() {
      this.$emit("relod");
    },
    cloasDialog() {
      this.$emit("cloasDialog");
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 18px;
}
h1 {
  font-size: 12px;
}
.border-card {
  border: 1px solid #0000006b;
}
</style>

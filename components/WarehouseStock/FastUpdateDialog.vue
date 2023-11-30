<template>
  <v-dialog v-model="updateeDiaolog.show" width="700">
    <v-card class="pa-5">
      <span class="mb-2 font_xxxl font_bold">افزودن موجودی</span>
      <v-form v-model="valid" @submit.prevent="submit()">
        <v-row class="pa-3">
          <v-col cols="6">
            <amp-input
              is-price
              text="موجودی"
              v-model="form.stock"
              rules="require"
            />
          </v-col>
          <v-col cols="6">
            <amp-input
              is-number
              text="موجودی ذخیره"
              v-model="form.saved_stock"
            />
          </v-col>
          <v-col cols="6">
            <amp-button
              text="منصرف شدم"
              color="accent"
              class="w-max"
              @click="showUpdateDialog(false)"
              :disabled="loading"
            />
          </v-col>
          <v-col cols="6">
            <amp-button
              text="تایید"
              class="w-max"
              color="success"
              type="submit"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    updateeDiaolog: {
      type: Object,
      default: {
        show: false,
        item: null,
      },
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      url: "/warehouse-stock/insert",
      form: {
        branch_id: "",
        varcomb_id: "",
        stock: "",
        saved_stock: "",
      },
    };
  },
  watch: {
    "updateeDiaolog.show"() {
      if (this.updateeDiaolog.show) {
        this.form.stock = this.updateeDiaolog.item.item.stock;
        this.form.saved_stock = this.updateeDiaolog.item.item.saved_stock;
        if (this.updateeDiaolog.update) {
          this.url = "/warehouse-stock/update";
        }
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.updateeDiaolog.update) {
        try {
          this.form.id = this.updateeDiaolog.item.item.id;
          this.form.varcomb_id = this.updateeDiaolog.item.item.product_variation_combination.id;
          this.form.branch_id = this.updateeDiaolog.item.branch_id.branch_id;
        } catch (error) {
          this.$toast.error('در روند ویرایش موجودی مشکلی به وجود آمده است')
          this.showUpdateDialog(false)
          this.loading = false;
          return;
        }
      } else {
        this.form.branch_id = this.updateeDiaolog.item.branch_id.branch_id;
        this.form.varcomb_id = this.updateeDiaolog.item.item.id;
      }
      this.form.stock = +this.form.stock;
      this.form.saved_stock = +this.form.saved_stock;
      this.$reqApi(this.url, this.form)
        .then((res) => {
          this.loading = false;
          this.$emit("reloadVariation");
          this.showUpdateDialog();
        })
        .catch((err) => {
          this.loading = false;
          this.showUpdateDialog();
          return err;
        });
    },
    showUpdateDialog() {
      this.form.stock = "";
      this.form.saved_stock = "";
      this.updateeDiaolog.show = false;
      this.updateeDiaolog.item = null;
      this.$emit('emptyUpdateDoalgo')
    },
  },
};
</script>

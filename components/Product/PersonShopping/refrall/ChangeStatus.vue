<template>
  <v-dialog v-model="dialog" width="380" persistent>
    <v-card class="pa-4 py-5 " >
      <div class="pb-2 pt-4" >
        <v-col cols="12" class="text-center">
        <h1 class="font_17">تعیین وضعیت</h1>
        <h1>
          <small v-if="data.user && Boolean(data.user.first_name)">
            {{ data.user.first_name }} {{ data.user.last_name }}
          </small>
          <br />
          <small class="grey--text" style="border-bottom: 1px solid #8585858a;">
            شماره فاکتور
            {{ data.basket.factor_number }}
          </small>
        </h1>
      </v-col>
      <v-col cols="12">
        <v-form v-model="valid">
          <amp-select
            text="مرحله"
            v-model="form.status"
            :items="$store.state.static.status_return_product"
            rules="require"
          />
        </v-form>
        <v-row class="d-flex justify-center mt-8">
          <v-col cols="12" md="4">
            <amp-button
              text="تایید"
              height="38"
              block
              color="teal darken-2"
              @click="submit"
              class="ma-1"
              :loading="loading"
              :disabled="loading || !valid"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-button
              text="انصراف"
              height="38"
              block
              color="red darken-2"
              @click="closeDialog"
              class="ma-1"
            />
          </v-col>
        </v-row>
      </v-col>
      </div>
    
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    data: {
      default: "",
    },
    dialog: {
      default: false,
    },
  },
  data: () => ({
    valid: true,
    loading: false,
    form: {},
  }),
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form["return_product_id"] = this.data.id;
      this.$reqApi("return-product/change-status", form)
        .then((res) => {
          this.closeDialog();
          this.$emit("reload");
          this.$toast.success("عملیات با موفقیت انجام شد");
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

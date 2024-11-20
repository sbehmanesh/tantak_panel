<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card class="pa-5">
        <v-banner  single-line class="mb-12"> 
        <h1>
        بروزسانی انبار  با اکسل
        </h1>
        
        </v-banner>

        <v-row >
          <v-col cols="6">
            <v-file-input
              dense
              outlined
              placeholder="بارگذاری اکسل"
              accept=".xlsx"
              v-model="form.file"
            />
          </v-col>
          <v-col cols="6">
            <amp-select
              placeholder="نوع"
              :items="type_items"
              v-model="form.type"
            ></amp-select>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-center">
          <v-col cols="12" md="3">
            <amp-button
              text="تایید"
              height="38"
              block
              color="teal darken-2"
              @click="submit"
              class="ma-1"
              :loading="loading"
              :disabled="loading || !Boolean(form.type)"
            />
          </v-col>
          <v-col cols="12" md="3">
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
    saleAgencyId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      type_items: [
        { text: "بروزسانی موجودی", value: "insert" },
        { text: "انبارگردانی", value: "stock_check" },
      ],
      loading: false,
      form: {
        sale_agency_id: "",
        file: "",
        type: "",
      },
    };
  },
  methods: {
    submit() {
      this.loading = true;
      this.form.sale_agency_id = this.saleAgencyId;
      let formData = new FormData();
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
      if (this.form.file == null) {
        this.loading = false;
        return this.$toast.error("بارگذاری اکسل اجباری می باشد");
      }

      this.$reqApi("sale-agency-stock/add-product/import-excel", formData)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد")
          this.closeDialog()
          this.$emit("reload")
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

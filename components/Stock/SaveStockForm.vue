<template>
  <v-dialog persistent v-model="updateeDiaolog.show" width="1500">
    <v-card class="pa-5" v-if="!loading">
      <v-card-title class="center-div">
        <span class="mb-2 font_xxxl font_bold">افزودن موجودی</span>
      </v-card-title>
      <v-form v-model="valid" @submit.prevent="submit()" v-if="form.length > 0">
        <v-row class="pa-3">
          <v-col
            cols="12"
            md="4"
            v-for="(item, index) in form"
            :key="index"
            class="my-3"
          >
            <v-card class="pa-5 primary lighten-3 rounded elevation-5">
              <v-card-title class="center-div">
                <span>{{ item.title }}</span>
              </v-card-title>
              <v-card-text class="d-flex">
                <amp-input
                  is-number
                  text="موجودی"
                  class="my-2"
                  rules="number"
                  v-model="form[index].stock"
                />
                <amp-input
                  is-number
                  text="موجودی ذخیره"
                  class="my-2"
                  rules="number"
                  v-model="form[index].saved_stock"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" class="d-flex justify-center mt-3">
            <v-card class="elevation-0 mx-3" width="300">
              <amp-button
                text="منصرف شدم"
                color="accent"
                class="w-max"
                @click="showUpdateDialog(false)"
                :disabled="loading"
              />
            </v-card>
            <v-card class="elevation-0" width="300">
              <amp-button
                text="به روزرسانی"
                class="w-max"
                color="success"
                type="submit"
                :loading="loading"
                :disabled="!valid || loading"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-card v-else min-height="800" class="center-div">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
    modelId: {
      type: String,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      submit_loading: false,
      form: [],
    };
  },
  watch: {
    "updateeDiaolog.show"() {
      if (this.updateeDiaolog.item) {
        this.loadData(this.updateeDiaolog.item);
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let warehouseStocks = this.form.filter((x) => {
        return x.stock > 0;
      });
      this.$reqApi("/warehouse-stock/save-stocks", {
        warehouseStocks: warehouseStocks,
      })
        .then((res) => {
          this.showUpdateDialog();
          this.$emit("reloadTable");
          this.loading = false;
          return res;
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
      //   this.loading = true;
      //   this.form.branch_id = this.updateeDiaolog.item.branch_id.branch_id;
      //   this.form.varcomb_id = this.updateeDiaolog.item.id;
      //   this.$reqApi("/warehouse-stock/insert", this.form)
      //     .then((res) => {
      //       this.loading = false;
      //       this.showUpdateDialog();
      //     })
      //     .catch((err) => {
      //       this.loading = false;
      //       this.showUpdateDialog();

      //       return err;
      //     });
    },
    showUpdateDialog() {
      this.form = [];
      this.updateeDiaolog.show = false;
      this.updateeDiaolog.item = null;
    },
    loadData(data) {
      let url = "/warehouse-stock/list-stock";
      let form = {
        row_number: 4000,
        branch_id: data.branch_id,
        product_id: data.product_id,
      };
      this.loading = true;
      this.$reqApi(url, form)
        .then((res) => {
          res.model.data.map((x) => {
            this.form.push({
              varcomb_id: x.product_variation_combination.id,
              branch_id: this.updateeDiaolog.item.branch_id,
              stock: x.stock,
              saved_stock: x.saved_stock,
              title:x.product_variation_combination.full_barcode
            });
          });
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
  },
};
</script>

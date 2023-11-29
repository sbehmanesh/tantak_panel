<template>
  <div>
    <v-expansion-panels variant="popout" class="my-4 elevation-5">
      <v-expansion-panel>
        <v-expansion-panel-header
          expand-icon="category"
          class="primary lighten-4"
        >
          ایجادموجودی
        </v-expansion-panel-header>
        <v-expansion-panel-content class="primary lighten-5">
          <v-row>
            <v-col cols="12" md="12">
              <v-form
                v-model="valid"
                @submit.prevent="submit()"
                :disabled="loading"
              >
                <v-container fluid class="px-8">
                  <v-row dense>
                    <v-col cols="12" md="3">
                      <amp-autocomplete
                        text="ترکیب"
                        v-model="form.varcomb_id"
                        :items="items_varc"
                        rules="require"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <amp-input
                        text="موجودی"
                        v-model="form.stock"
                        is-number
                        rules="require"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <amp-input
                        text="موجودی ذخیره "
                        v-model="form.saved_stock"
                        is-number
                        rules="require"
                      />
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col cols="12" md="12">
                      <v-divider />
                    </v-col>
                    <v-col cols="12" md="12" class="text-center">
                      <amp-button
                        large
                        icon="redo"
                        class="my-1"
                        color="error"
                        text="انصراف"
                        @click="clean()"
                      />
                      <amp-button
                        large
                        icon="done"
                        class="my-1"
                        type="submit"
                        color="success"
                        :loading="loading"
                        :disabled="!valid || loading"
                        text="ثبت"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/warehouse-stock/insert",
    items_varc: [],
    form: {
      branch_id: "",
      varcomb_id: "",
      stock: "",
      saved_stock: "",
    },
  }),
  mounted() {
    this.form.branch_id = this.$route.params.stock;
  },
  watch: {
    "form.branch_id"() {
      this.loadVarcom();
    },
  },
  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.createUrl;
      this.$reqApi(url, form)
        .then((response) => {
          this.clean();
          this.$toast.success("اطلاعات ثبت شد");
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadVarcom() {
      this.$reqApi("warehouse-stock/list-product-variation-combination", {
        branch_id: this.form.branch_id,
        row_number: 3000,
      })
        .then((res) => {
          res.model.data.map((x) => {
            this.items_varc.push({
              text: x.sell_type + " | " + x.barcode,
              value: x.id,
            });
          });
        })
        .catch((err) => {
          return err;
        });
    },
    clean() {},
  },
};
</script>

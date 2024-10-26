<template>
  <div>
    <v-dialog persistent v-model="dialog" width="500">
      <v-card class="pa-4" :disabled="loading">
        <v-row class="mx-2 mt-1 align-center">
          <h1 v-text="set_title" class="font_15 mr-2"></h1>
          <v-spacer></v-spacer>
          <v-icon class="mr-3" v-if="!Boolean(modelId)"> add_circle </v-icon>
          <v-icon class="mr-3" v-else> edit </v-icon>
          <v-col cols="12 " class="mt-0">
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="submit()">
            <v-row>
              <v-col cols="12" md="12">
                <amp-autocomplete
                  text="محصول"
                  :diabled="load_item"
                  v-model="form.product_id"
                  :items="products"
                  rules="require"
                />
                <amp-select
                  :items="$store.state.static.status"
                  text="وضعیت"
                  rules="require"
                  v-model="form.status"
                />
                <amp-textarea text="توضیحات" v-model="form.description" />
              </v-col>
            </v-row>

            <v-row class="d-flex justify-center">
              <v-col cols="12" md="4">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="green darken-2"
                  type="submit"
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
          </v-form>
        </v-card-text>
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
    modelId: {
      require: false,
      default: false,
    },

  },

  data: () => ({
    valid: true,
    products: [],
    loading: false,
    load_item: false,
    form: {
      status: "active",
      product_id: "",
      description: "",
    },
  }),
  computed: {
    set_title() {
      let dialog_title = this.modelId ? "ویرایش محصول" : "افزودن محصول ";
      return dialog_title;
    },
  },
  mounted() {
    this.loadProduct();
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {

      this.loading = true;
      let form = { ...this.form };
      let url = Boolean(this.modelId)
        ? "best-buy-product/update"
        : "best-buy-product/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("عملیات با موفقیت انجام شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },

    loadData() {
      this.loading = true;
      this.$reqApi("best-buy-product/show", { id: this.modelId })
        .then((response) => {
          let data = response.data;
          for (let key in data) {
            this.form[key] = data[key];
          }

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

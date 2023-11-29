<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
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
          <amp-input text="موجودی" v-model="form.stock" is-number rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input text="موجودی ذخیره " v-model="form.saved_stock" is-number rules="require" />
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
            @click="redirectPage()"
          />
          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/warehouse-stock/insert",
    updateUrl: "/warehouse-stock/update",
    showUrl: "/warehouse-stock/show",
    settings: [],
    selected: {},
    items_varc: [],
    form: {
      branch_id: "",
      varcomb_id: "",
      stock: "",
      saved_stock: "",
    },
  }),

  beforeMount() {},
  mounted() {
    this.form.branch_id = this.$route.params.stock;
    if (this.modelId) {
      this.loadData();
    }
    this.loadVarcom();
  },

  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          response = response.model;
          this.form.varcomb_id = response.varcomb_id
          this.form.stock = response.stock
          this.form.saved_stock = response.saved_stock
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    loadVarcom() {
      this.$reqApi("warehouse-stock/list-product-variation-combination", {
        branch_id: this.form.branch_id,
        row_number: 30000,
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
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>

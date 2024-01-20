<template>
  <v-card :loading="loading" :disabled="loading" class="elevation-0 transparent">
    <v-row class="pa-3">
      <v-col cols="12" md="4">
        <amp-autocomplete
          text="انتخاب محصول"
          :items="items_product"
          v-model="form.product_id"
        ></amp-autocomplete>
      </v-col>
      <v-col cols="12" md="4" v-if="checkRootAccess">
        <amp-autocomplete
          text="انتخاب شعبه"
          :items="branch_items"
          v-model="form.branch_id"
        ></amp-autocomplete>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      items_product: [],
      branch_items: [],
      loading: true,
      form: {
        product_id: "",
        branch_id: "",
      },
    };
  },
  mounted() {
    this.loadProduct();
  },
  watch: {
    "form.branch_id"() {
      this.$emit("setFilter", this.form);
    },
    "form.product_id"() {
      if (!this.checkRootAccess) {
        this.$emit("setFilter", this.form);
      }
    },
  },
  computed: {
    checkRootAccess() {
      if (this.$checkAccess("warehouse_stock/root")) {
        this.loadBranch();
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    loadProduct() {
      this.$reqApi("/product/low-search", { row_number: 30000 })
        .then((res) => {
          res.model.data.map((x) => {
            this.items_product.push({
              text: x.name,
              value: x.id,
            });
            this.loading = false;
          });
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    loadBranch() {
      this.$reqApi("/branch", { row_number: 50000 })
        .then((res) => {
          res.model.data.map((x) => {
            this.branch_items.push({
              text: x.name,
              value: x.id,
            });
            this.loading = false;
          });
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
  },
};
</script>

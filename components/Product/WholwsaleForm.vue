<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="نام" v-model="form.first_name" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="نام خانوادگی"
            v-model="form.last_name"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="شماره تماس"
            :isNumber="true"
            v-model="form.phone_number"
            rules="require,phone"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input text="مقدار" v-model="form.count" rules="require,number" :isNumber='true' />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            :items="$store.state.static.status_contact_form"
            text="وضعیت"
            v-model="form.status"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            :items="productItem"
            text="محصول"
            v-model="form.product"
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
    modelId: { default: null }
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/shop/wholesale-form/insert",
    updateUrl: "/wholesale-form/update",
    showUrl: "/wholesale-form/show",
    categories: [],
    productItem: [],
    form: {
      first_name: "",
      last_name: "",
      phone_number: "",
      product: "",
      count: "",
      status: "pending"
    }
  }),
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
    this.setProductItems();
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
        .then(response => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async response => {
          let res = response.model;
          this.form.id = res.id;
          this.form.first_name = res.first_name;
          this.form.last_name = res.last_name;
          this.form.status = res.status;
          this.form.phone_number = res.phone_number;
          this.form.product = res.product;
          this.form.count = res.count;
          this.loading = false;
        })
        .catch(error => {
          this.redirectPage();
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
    setProductItems() {
      let product = [];
      this.$reqApi("/product")
        .then(res => {
          res.model.data.map(x => {
            product.push({
              text: x.name,
              value: x.id
            });
          });
        })
        .catch(err => {
          return err;
        });
        this.productItem = product
    }
  }
};
</script>

<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-card :disabled="Boolean(loading)" class="elevation-0">
      <v-row class="ma-2">
        <v-col cols="12" md="3">
          <amp-input
            text="میزان تومانی اعتبار"
            v-model="form.price"
            rules="require"
            is-price
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="بابت"
            :items="reason"
            rules="require"
            v-model="form.reason"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-jdate
            text=" تاریخ شروع "
            rules="require"
            v-model="form.start_at"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            text="محصولات"
            multiple
            v-model="form.product_ids"
            :items="products"
            rules="require"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-jdate
            text="حداکثر مهلت استفاده"
            rules="require"
            :min="now"
            v-model="form.end_at"
          />
        </v-col>
        <v-col cols>
          <amp-textarea :rows="3" text="توضیحات" v-model="form.description" />
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-card>

    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="برگشت"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        text="تایید"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loading"
        :loading="loading"
      ></amp-button>
    </v-row>
  </v-form>
</template>

<script>
let jmoment = require("moment");
export default {
  props: {
    modelId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,

      insurance: [],
      transactions: [],
      send_info_trasnsaction: {},
      products: [],
      reason: [],
      now: "",
      left_over: "",
      total_transaction: "",
      form: {
        price: "",
        reason: "",
        sort: "",
        end_at: "",
        user_id: "",
        start_at: "",
        description: "",
        product_ids: [],
      },
    };
  },

  mounted() {
    this.getReasons();
    this.loadProduct();
    if (Boolean(this.$route.query.id)) {
      this.form.user_id = this.$route.query.id;
    }
    this.now = jmoment().format("YYYY-MM-DD");
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (this.modelId) {
        form["id"] = this.modelId;
      }
      let url = this.modelId
        ? "/special-amount/update"
        : "/special-amount/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/special-amount/show", { id: this.modelId })
        .then((res) => {
          let data = res.data;
          for (let i in data) {
            this.form[i] = data[i];
          }
          this.form.product_ids = data.products.map((x) => x.id);
          this.loading = false;

          response(send_info_trasnsaction);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getReasons() {
      this.$reqApi("/setting", { filters: { key: "for_wallet" } })
        .then(async (response) => {
          let items = [];
          if (response.model.data.length > 0) {
            for (let index = 0; index < response.model.data.length; index++) {
              const element = response.model.data[index];
              items.push({
                text: element.value,
                value: element.value,
              });
            }
            this.reason = items;
          }
        })
        .catch((error) => {});
    },

    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
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

    back() {
      this.$router.back();
    },
  },
};
</script>

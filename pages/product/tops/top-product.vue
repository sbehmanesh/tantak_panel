<template>
  <div>
    <v-row class="justify-center align-center">
      <v-col cols="12" md="2">
        <amp-jdate text="تاریخ شروع " :is-number="true" v-model="start_at" />
      </v-col>
      <v-col cols="12" md="2">
        <amp-jdate text="تاریخ پایان" :is-number="true" v-model="end_at" />
      </v-col>
      <v-col cols="12" md="2" class="mt-7">
        <amp-button
          text="تایید"
          icon="search"
          height="39"
          :disabled="!Boolean(start_at) || !Boolean(end_at)"
          @click="setFilters(start_at, end_at)"
        />
      </v-col>
    </v-row>
    <BaseTable
      v-if="show_tabel"
      localData
      :dataArray="top_products"
      :headers="headers"
    />
  </div>
</template>
<script>

let jmoment = require("moment");
export default {
  data: () => ({
    headers: [],
    top_products: [],
    start_at: "",
    end_at: "",
    now: "",
    show_tabel: false,
    root_body: {},
    title: "محصولات برتر",
  }),
  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
    this.$store.dispatch("setPageTitle", this.title);
    this.$store.dispatch("setting/getRoleServer");
    this.headers = [
      {
        text: " نام محصول ",
        value: "name",
        filtrabel: false,
        disabled: true,
      },
      {
        text: "قیمت پایه (ریال)",
        value: "price",
        type: "price",
        filtrabel: false,
        disabled: true,
      },

      {
        filtrabel: false,
        disabled: true,
        text: "تعداد",
        value: "count",
      },
    ];
  },
  methods: {
    setFilters(start, end) {
      this.$reqApi("/basket-item/show-top-product", {
        start_at: start,
        end_at: end,
      })
        .then((res) => {
          let items = [];
          const data = res.model;

          console.log("sss >> ", data);
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            items.push({
              count: x.count,
              price: x.product.base_price,
              name: x.product.name,
            });
          }
          this.top_products = items
          
        })
        .catch((err) => {});
      this.show_tabel = true;
    },
  },
};
</script>

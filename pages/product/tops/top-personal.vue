<template>
  <div>
    <v-row class="justify-center">
      <v-col cols="12" md="2">
        <amp-select text="نوع نقش" :items="role_item" v-model="role_name" />
      </v-col>
      <v-col cols="12" md="2">
        <amp-jdate text="تاریخ شروع " :is-number="true" v-model="start_at" />
      </v-col>
      <v-col cols="12" md="2">
        <amp-jdate text="تاریخ پایان" :is-number="true" v-model="end_at" />
      </v-col>
      <v-col cols="12" md="2" class="mt-8">
        <amp-button
          text="تایید"
          icon="search"
          height="39"
          :disabled="
            !Boolean(start_at) || !Boolean(end_at) || !Boolean(role_name)
          "
          @click="setFilters(start_at, end_at, role_name)"
        />
      </v-col>
    </v-row>
    <BaseTable
      v-if="show_tabel"
      localData
      :dataArray="top_users"
      :headers="headers"
    />
  </div>
</template>
<script>
let jmoment = require("moment");
export default {
  data: () => ({
    headers: [],
    top_users: [],
    role_item: [],
    start_at: "",
    end_at: "",
    role_name: "",
    now: "",
    show_tabel: false,
    root_body: {},
    title: " کارکنان برتر  ",
  }),
  beforeMount() {
    this.role_item = [
      { text: "فروشنده", value: "operator" },
      { text: "مرکزتماس", value: "supervisor" },
    ];
    this.now = jmoment().format("YYYY-MM-DD");
    this.$store.dispatch("setPageTitle", this.title);
    this.$store.dispatch("setting/getRoleServer");
    this.headers = [
      {
        text: "نام ",
        value: "name",
        filtrabel: false,
        disabled: true,
      },
      {
        text: "مبلغ (ریال)",
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
    setFilters(start, end, role_name) {
      this.$reqApi("message/show-best", {
        start_at: start,
        end_at: end,
        field_name: role_name,
      })
        .then((res) => {
          let items = [];
          const data = res.model;
          for (let i = 0; i < data.length; i++) {
            const x = data[i];

            items.push({
              name: x.pacakge.name,
              price: x.pacakge.price,
              count: x.count,
            });
          }
        })
        .catch((err) => {});
      this.show_tabel = true;
    },
  },
};
</script>

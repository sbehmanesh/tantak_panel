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
          :disabled="!Boolean(start_at) && !Boolean(end_at)"
          @click="setFilters(start_at, end_at)"
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
    start_at: "",
    end_at: "",
    now: "",
    show_tabel: false,
    root_body: {},
    title: "کاربران برتر",
  }),
  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
    this.$store.dispatch("setPageTitle", this.title);
    this.$store.dispatch("setting/getRoleServer");
    this.headers = [
    {
        text: "تصویر",
        value: "img",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      {
        text: "نام نمایندگی",
        value: "name",
        filtrabel: false,
        disabled: true,
      },
      {
        text: " مبلغ (ریال) ",
        value: "total",
        type: "price",
        filtrabel: false,
        disabled: true,
      },

      {
        filtrabel: false,
        disabled: true,
        text: "کد",
        value: "code",
      },
    ];
  },
  methods: {
    setFilters(start, end) {
      this.$reqApi("/product-request/show-top-sale-agency", {
        start_at: start,
        end_at: end,
      })
        .then((res) => {
          let items = [];
          const data = res.model;
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            let sale_agency = "";
            if (
              Boolean(x.sale_agency) &&
              Boolean(x.sale_agency.name) 
    
            ) {
              sale_agency = `${x.sale_agency.name}`;
            } else {
              sale_agency = "--";
            }
            items.push({
              name: sale_agency,
              total: x.total,
              code: x.sale_agency.code,
              img: x.sale_agency.img,
            
            });
          }
          
          this.top_users = items.sort((a, b) => {
            a.total - b.total;
          });
        })
        .catch((err) => {});
      this.show_tabel = true;
    },
  },
};
</script>

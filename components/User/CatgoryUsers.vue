<template>
  <v-row class="d-flex justify-center mt-4">
    <v-col
      cols="12"
      md="4"
      v-for="x in catgory_users"
      :key="x.value"
      v-if="!loading"
    >
      <v-card
        height="260"
        class="text-center main-card align-center justif-center pa-3"
        @click="selectCard(x)"
      >
        <v-row class="d-flex pa-3">
          <v-col cols="12" md="4">
            <v-card
              width="100"
              class="icon-calss pa-4 mb-3"
              :class="selected_card == x.value ? 'select-card' : ''"
            >
              <v-icon size="35" color="white">
                {{ x.icon }}
              </v-icon>
            </v-card>
            <div class="text-end mr-2">
              <span class="font_17">{{ x.text }} </span>
              <br />

              <h1>
                <small class="grey--text">
                  تعداد کل
                  {{ x.text }}
                </small>
                <small class="font_12">
                  {{ x.count }}
                </small>
              </h1>
              <h1>
                <small class="grey--text">
                  تعداد
                  {{ x.text }}
                  ایجاد شده در امروز
                </small>
                <small class="font_12">
                  {{ x.new }}
                </small>
              </h1>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="8" v-if="$vuetify.breakpoint.mdAndUp">
            <v-row class="d-flex justify-center align-center">
              <v-card class="text-center pa-3 elevation-1" outlined width="400">
                <v-row class="align-center pa-3">
                  <h1>
                    <small>
                      نمودار پیشرفت
                      {{ x.text }}
                      جدید در ده روز اخیر
                    </small>
                  </h1>
                  <v-spacer></v-spacer>
                  <h1 class="mb-5">
                    <small v-if="x.new != 0" class="green--text">
                      {{ x.new }} +
                    </small>
                  </h1>
                  <v-icon v-if="x.new != 0"> trending_up </v-icon>
                  <h1 class="font_16 ml-3">
                    {{ x.count }}
                  </h1>
                </v-row>
                <v-row class="align-center">
                  <v-col cols>
                    <v-sparkline
                      :value="x.week"
                      :gradient="gradient"
                      :smooth="radius || false"
                      :padding="padding"
                      :line-width="width"
                      :stroke-linecap="lineCap"
                      :gradient-direction="gradientDirection"
                      :fill="fill"
                      :type="type"
                      :labels="x.labels"
                      :auto-line-width="autoLineWidth"
                      auto-draw
                    ></v-sparkline>
                  </v-col>
                </v-row>
                <v-row class="mb-1 mx-1">
                  <h1>
                    <small class="grey--text">
                      {{ now }}
                    </small>
                  </h1>
                  <v-spacer></v-spacer>
                  <h1>
                    <small class="grey--text">
                      {{ start_date }}
                    </small>
                  </h1>
                </v-row>
                <v-divider class="mt-1"></v-divider>
                <v-row class="pa-3">
                  <v-spacer></v-spacer>
                </v-row>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col v-if="loading" cols="12" md="4" v-for="i in 2" :key="i">
      <v-card >
        <v-skeleton-loader type="card" height="180" ></v-skeleton-loader>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
let jmoment = require("moment");
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];
export default {
  props: {
    userCount: {
      default: "",
    },
  },
  data: () => ({
    start_date: "",
    loading: true,
    headers: [],
    selected_card: "users",
    now: "",
    last_week: [],
    pesonal_list: [],
    customer_list: [],

    catgory_users: [
      {
        text: "مشتریان ",
        value: "users",
        icon: "groups",
        count: "",
        new: "0",
        week: [],
        labels: [],
      },
      {
        text: "پرسنل ",
        value: "personal",
        icon: "engineering",
        count: "",
        new: "0",
        week: [],
        labels: [],
      },
    ],
    width: 2.3,
    radius: 5,
    padding: 8,
    lineCap: "round",
    gradient: gradients[5],
    gradientDirection: "top",
    gradients,
    fill: false,
    type: "trend",
    autoLineWidth: false,
  }),
  beforeMount() {
    this.setDates();
    this.personalList();
  },
  mounted() {
    this.catgory_users[0].count = this.userCount;
    let users = this.customer_list.filter(
      (x) =>
        this.$toJalali(x.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") == this.now
    );
    if (Boolean(users) && users.length > 0) {
      this.catgory_users[0].new = users.length;
    }
  },
  methods: {
    setDates() {
      let now = jmoment().format("YYYY-MM-DD");
      this.now = this.$toJalali(now, "YYYY-MM-DD", "jYYYY/jMM/jDD");
      let last_week = [];
      for (let index = 0; index < 10; index++) {
        let day = jmoment(now).subtract(index, "days").format("YYYY-MM-DD");
        day = this.$toJalali(day, "YYYY-MM-DD", "jYYYY/jMM/jDD");
        last_week.push(day);
      }
      this.start_date = jmoment(now).subtract(9, "days").format("YYYY-MM-DD");
      this.start_date = this.$toJalali(
        this.start_date,
        "YYYY-MM-DD",
        "jYYYY/jMM/jDD"
      );
      this.last_week = last_week;
    },
    personalList() {
      this.$reqApi("/user/searchByRole", {
        role_id: [this.$store.state.auth.role.user_id],
        condition: "not_in",
        row_number: 30000,
      })
        .then((res) => {
          this.pesonal_list = res.model.data;
          this.catgory_users[1].count = res.model.total;
          let new_personal = res.model.data.filter(
            (x) =>
              this.$toJalali(x.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") ==
              this.now
          );
          if (Boolean(new_personal) && new_personal.length > 0) {
            this.catgory_users[1].new = new_personal.length;
          }
          this.customerList();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    customerList() {
      this.$reqApi("/user/searchByRole", {
        role_id: [this.$store.state.auth.role.user_id],
        row_number: 30000,
      })
        .then((res) => {
          this.customer_list = res.model.data;
          this.catgory_users[0].count = res.model.total;
          let new_customer = res.model.data.filter(
            (x) =>
              this.$toJalali(x.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") ==
              this.now
          );

          if (Boolean(new_customer) && new_customer.length > 0) {
            this.catgory_users[0].new = new_customer.length;
          }
          this.createChart(this.last_week);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    selectCard(data) {
      this.selected_card = data.value;
      this.$emit("filterRole", data.value);
    },
    createChart(last_week) {
      for (let i = 0; i < last_week.length; i++) {
        const x = last_week[i];

        this.chartUsers(x);
        this.chartPersonal(x);
      }
    },
    chartUsers(data) {
      let chart = this.customer_list.filter(
        (x) =>
          this.$toJalali(x.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") == data
      );
      this.catgory_users[0].labels.unshift(chart.length);

      this.catgory_users[0].week.unshift(chart.length);
      this.loading = false;
    },
    chartPersonal(data) {
      let chart = this.pesonal_list.filter(
        (x) =>
          this.$toJalali(x.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") == data
      );
      this.catgory_users[1].labels.unshift(chart.length);
      this.catgory_users[1].week.unshift(chart.length);
    },
  },
};
</script>
<style scoped>
.icon-calss {
  border-radius: 10px;
  background: linear-gradient(
    to top,
    #dddcdb6c,
    rgb(187, 187, 187),
    #acabaa
  ) !important;
}
.select-card {
  border-radius: 10px;
  background: linear-gradient(
    to top,
    #ff5f1f6c,
    rgb(255, 102, 0),
    #e04001
  ) !important;
}
.main-card {
  border: 1px solid rgba(0, 0, 0, 0.048);
  background-color: #f7f7f7 !important;
  border-radius: 10px !important;
}
.main-card:hover {
  cursor: pointer !important;
  box-shadow: 2px 5px 9px 9px #0c0c0c69 !important;
  transition: all 0.5s ease !important;
}
</style>

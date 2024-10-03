<template>
  <v-row class="justify-center">
    <v-col cols="12" md="4" class="pa-0 ma-0 ma-5">
      <v-card class="elevation-3 pa-2 card-style ">
        <v-card-text v-if="!loading">
          <v-icon size="60"> account_circle </v-icon>
          <strong class="font_16">
            {{ user }}
          </strong>
          <h1>
            #
            {{ data.text }}
          </h1>
          <h1>
            مبلغ پرداختی :‌
            {{ $price(data.price) }} ریال
          </h1>

          <h1>شماره تراکنش : {{ data.transaction_number }}</h1>
          <h1>
            وضعیت تراکنش :
            {{
              $getItemEnum(
                $store.state.static.status_payment_invitor,
                data.status
              )
            }}
          </h1>
          <v-row class="mt-1 justify-center">
            <amp-button
              text="ادامه پرداخت"
              icon="task_alt"
              @click="paymentPortal"
              color="success"
              class="ma-2"
              :loading="loading"
              :disabled="loading"
            />
          </v-row>
        </v-card-text>
        <div v-else class="text-center my-15">
          <v-progress-circular color="grey" indeterminate></v-progress-circular>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      data: {},
      user: "",
      random_id: "",
      loading: true,
      title:"پرداخت"
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    if (Boolean(this.$route.query.random_id)) {
      this.random_id = this.$route.query.random_id;
      this.showDetails(this.random_id);
    }
  },
  methods: {
    showDetails(id) {
      this.$reqApi("/shop/payment/show", { link_id: id })
        .then((res) => {
          this.data = res.data;
          if (Object.keys(this.data.user).length > 0) {
            if (
              Boolean(this.data.user.first_name && this.data.user.last_name)
            ) {
              this.user =
                this.data.user.first_name + " " + this.data.user.last_name;
            } else {
              this.user = this.data.user.username;
            }
          }

          this.loading = false;
        })

        .catch((err) => {
          this.loading = false;
        });
    },
    paymentPortal() {
      let url = "product-request/pay";
      this.$reqApi(url, { random_id: this.random_id })
        .then((res) => {
            window.open(res.url, "_blank");
        })
        .catch((err) => {});
    },
  },
};
</script>
<style scoped>
h1 {
  margin-top: 8px !important;
  font-size: 13px !important;
}
.card-style {
  border: 1px solid #8080807a !important;
  border-radius: 12px;
}
</style>

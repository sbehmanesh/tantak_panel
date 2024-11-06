<template>
  <v-row class="justify-center mt-15">
    <v-col cols="12" md="5" class="pa-0 ma-0 ma-5">
      <v-card-text v-if="!loading" class="pa-10">
        <v-item-group>
          <v-col cols="12">
            <v-item v-slot="{ active, toggle }">
              <v-card class="align-center pa-11 elevation-3 card-style" @click="toggle">
                <v-col cols="12" class="text-center mb-4">
                  <img
                    :src="$store.state.logo"
                    width="auto"
                    height="65"
                    class="bg_image"
                  />
                </v-col>
                <v-scroll-y-transition>
                  <v-col cols="12" v-if="!active" class="text-center">
                    <h1 class="font-class">
                      {{
                        $getItemEnum(
                          $store.state.static.status_payment_invitor,
                          data.status
                        )
                      }}
                    </h1>
                    <h1>
                      برای مشاهده جزییات کلیک
                      <v-icon small> ads_click </v-icon>
                      کنید
                    </h1>
                  </v-col>
                  <v-col cols="12" v-if="active">
                    <strong class="font_20">
                      <v-icon x-large> account_circle </v-icon>
                      {{ user }}
                    </strong>
                    <h1>
                      <v-icon> arrow_left </v-icon>
                      {{ data.text }}
                    </h1>
                    <h1>
                      <v-icon> arrow_left </v-icon>
                      مبلغ پرداختی :‌
                      {{ $price(data.price) }} ریال
                    </h1>

                    <h1>
                      <v-icon> arrow_left </v-icon>
                      شماره تراکنش : {{ data.transaction_number }}
                    </h1>
                  </v-col>
                  <v-row class="mt-1 justify-center" v-if="status == 'wait'">
                    <amp-button
                      text="ادامه پرداخت"
                      icon="task_alt"
                      @click="paymentPortal"
                      color="success"
                      class="ma-2"
                      :loading="loading_pay"
                      :disabled="loading"
                    />
                  </v-row>
                </v-scroll-y-transition>

                <v-row class="mt-3 mb-2 justify-center" v-if="status == 'wait'" >
                  <amp-button
                    text="ادامه پرداخت"
                   block
                    @click="paymentPortal"
                    color="primary"
                    class="ma-2"
                    :loading="loading_pay"
                    :disabled="loading_pay"
                  />
                </v-row>
              </v-card>
            </v-item>
          </v-col>
        </v-item-group>
        
      </v-card-text>
      <div v-else class="text-center my-15">
        <v-progress-circular color="grey" indeterminate></v-progress-circular>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "empty",
  data() {
    return {
      data: {},
      user: "",
      random_id: "",
      loading: true,
      loading_pay: false,
      title: "پرداخت",
      status: "",
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
            if (Boolean(this.data.user.first_name && this.data.user.last_name)) {
              this.user = this.data.user.first_name + " " + this.data.user.last_name;
            } else {
              this.user = this.data.user.username;
            }
          }
          this.status = this.data.status;
          this.loading = false;
        })

        .catch((err) => {
          this.loading = false;
        });
    },
    paymentPortal() {
      this.loading_pay = true;
      let url = "product-request/pay";
      this.$reqApi(url, { random_id: this.random_id })
        .then((res) => {
          window.open(res.url, "_blank");
          this.loading_pay = false;
        })
        .catch((err) => {
          this.loading_pay = false;
        });
    },
  },
};
</script>
<style scoped>
h1 {
  margin-top: 8px !important;
  font-size: 15px !important;
}
.card-style {
  border: 1px solid #80808060 !important;
  background: linear-gradient(to top, #d1d1d1e0, #f0dddbb6, #ff660085) !important;
  border-radius: 8px;
}
.font-class {
  font-size: 25px !important;
}
</style>

<template>
  <div>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-col cols="12" class="text-center mb-5">
        <h1 style="font-size: 25px">موجودی کیف پول</h1>
        <h1 style="font-size: 16px">
          کیف پول نقدی :
          <small> (ریال)</small>
          {{ $price(user.cash_wallt) }}
        </h1>
        <v-spacer></v-spacer>
        <h1 style="font-size: 16px">
          کیف پول اعتباری:
          <small> (ریال)</small>
          {{ $price(user.credit_wallt) }}
        </h1>
      </v-col>
      <v-card-text class="pa-5 mx-10">
        <v-row>
          <v-col
            cols="12 "
            md="6"
            class="ma-0"
            v-for="(item, index) in walet_items"
            :key="index"
          >
            <v-alert
              icon="history"
              dens
              text
              color="info darken-4"
              class="ma-0"
              prominent
              border="left"
            >
              <strong>
                {{ item.pay_text }} (
                {{ $getItemEnum($store.state.static.wallet_type, item.type) }}

                )
              </strong>
              <v-col cols="12">
                <v-row>
                  <h1>
                    تاریخ ثبت :‌
                    {{
                      $toJalali(item.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD")
                    }}
                  </h1>
                  <v-spacer></v-spacer>
                  <h1>
                    تاریخ پرداخت :
                    {{
                      $toJalali(item.paid_date, "YYYY-MM-DD", "jYYYY/jMM/jDD")
                    }}
                  </h1>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <h1>
                    نوع :
                    {{
                      $getItemEnum($store.state.static.wallet_kind, item.kind)
                    }}
                  </h1>
                  <v-spacer></v-spacer>
                  <h1>
                    مقدار :
                    {{ $price(item.amount) }} (ریال)
                  </h1>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <h1 v-if="item.description">
                    توضیحات :‌
                    {{ item.description }}
                  </h1>
                </v-row>
              </v-col>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    walet_items: [],
    user: {},
  }),
  beforeMount() {
    this.user = this.$store.state.auth.user;

    this.getWallet();
  },
  methods: {
    getWallet() {
      this.$reqApi("shop/wallet")
        .then((res) => {
          let items = [];
          let data = res.model.data;
          //   for (let i = 0; i < data.length; i++) {
          //     const x = data[i];
          //     // let type = this.$getItemEnum(
          //     //   this.$store.state.static.wallet_type,
          //     //   x.type
          //     // );
          //     // let kind = this.$getItemEnum(
          //     //   this.$store.state.static.wallet_kind,
          //     //   x.kind
          //     // );
          //     //   let kind = this.$getItemEnum(
          //     //   this.$store.state.static.wallet_kind,
          //     //   x.kind
          //     // );

          //     // items.push({
          //     //   status: type,
          //     //   type: kind,
          //     //   amount: x.amount,
          //     // });
          //   }
          let sort_items = data.sort((a, b) => {
            a.created_at - b.created_at;
          });
          this.walet_items = sort_items;
        })
        .catch((err) => {});
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 16px;
}
h1 {
  font-size: 13px;
  margin-top: 5px;
}
</style>

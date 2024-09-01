<template>
  <div>
    <v-col cols="12" class="text-center">
      <v-alert class="text-center" color="info darken-4" shaped text>
        <h1 style="font-size: 18px">موجودی کیف پول</h1></v-alert
      >
    </v-col>

    <v-row class="mx-1">
      <v-col cols="12" md="6" v-for="(item, index) in walet_items" :key="index">
        <v-alert
          dens
          color="info darken-4"
          text
          prominent
          icon="credit_card"
          border="left"
        >
          <strong>
            {{ item.pay_text }} (
            {{ $getItemEnum($store.state.static.wallet_kind, item.kind) }}
            )
          </strong>
          <br />

          <h1>
            تاریخ ثبت :‌
            {{ $toJalali(item.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
          </h1>
          <h1>
            تاریخ پرداخت :
            {{ $toJalali(item.paid_date, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
          </h1>

          <h1>
            مقدار :
            {{ $price(item.amount) }} (ریال)
          </h1>
          <small>
            توضیحات :‌
            {{ item.description }}
          </small>
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    walet_items: [],
  }),
  beforeMount() {
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
          console.log(res);
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

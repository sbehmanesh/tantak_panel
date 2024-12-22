<template>
  <v-dialog v-model="dialog" persistent max-width="650">
    <v-card style="overflow: hidden !important" class="pa-2">
      <div class="card-style pa-4 pt-7">
      <v-row class="d-flex align-center px-3">
        <h1 class="font_16"> تکمیل پرداخت سفارش</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
      </v-row>
      <v-col cols="12" class="d-flex align-center justify-center ">
        <v-col cols="6">
          <amp-select :disabled="only_price" text="نوع پرداخت" :items="pay_type" v-model="kind_set" />
        </v-col>
        <amp-button
          text="تایید"
          :disabled="only_price" 
          height="38"
          @click="payFactor(true)"
          color="blue-grey"
          type="submit"
          class="ma-1"
        />
      </v-col>
      <div class="pa-5" v-if="only_price">
        <v-col cols="12">
          <v-card
            class="elevation-0 d-flex justify-space-between align-center pa-2"
            style="border-right: 3px solid teal"
            outlined
          >
            <h1 class="font_11">جمع کل فاکتور</h1>
            <v-chip>
              <h1 class="font_11">ریال{{ $price(wallet.price) }}</h1>
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card
            class="elevation-0 d-flex justify-space-between align-center pa-2"
            style="border-right: 3px solid teal"
            outlined
          >
            <h1 class="font_11">مبلغ قابل پرداخت</h1>
            <v-chip>
              <h1 class="font_11">ریال{{ $price(wallet.buy_online) }}</h1>
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card
            class="elevation-0 d-flex justify-space-between align-center pa-2"
            style="border-right: 3px solid teal"
            outlined
          >
            <h1 class="font_11">مقدار کسر شده از کیف پول نقدی</h1>
            <v-chip>
              <h1 class="font_11">ریال{{ $price(wallet.cash_wallt) }}</h1>
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card
            class="elevation-0 d-flex justify-space-between align-center pa-2"
            style="border-right: 3px solid teal"
            outlined
          >
            <h1 class="font_11">مقدار کسر شده از کیف پول اعتباری</h1>
            <v-chip>
              <h1 class="font_11">ریال{{ $price(wallet.credit_wallt) }}</h1>
            </v-chip>
          </v-card>
        </v-col>
        <div class="d-flex justify-center">
            
            <v-col cols="6">
              <v-card
                class="elevation-0 text-center pa-2"
                style="border-top: 3px solid teal"
                outlined
              >
                <h1 class="font_13"> قیمت اصلی سبد خرید</h1>
                <br>

                <v-chip>
                  <h1 class="font_11">ریال{{ $price(wallet.original_price) }}</h1>
                </v-chip>
              </v-card>
            </v-col> 
            
            <v-col cols="6">
              <v-card
                class="elevation-0 text-center pa-2"
                style="border-top: 3px solid teal"
                outlined
              >
                <h1 class="font_13"> مجموع کل تخفیفات</h1>
                <br>
                <v-chip>
                  <h1 class="font_11">ریال{{ $price(wallet.off_amount) }}</h1>
                </v-chip>
              </v-card>
            </v-col>
          </div>
        <v-row class="d-flex justify-center pa-4">
          <v-col cols="12" md="2" class="ma-2">
            <amp-button
              text="پرداخت سبد"
              height="38"
              @click="payFactor(false)"
              color="teal darken-2"
              type="submit"
            />
          </v-col>

        
        </v-row>
      </div>
    </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    basketId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      only_price:false,
      wallet:{},
      kind_set: "naghd",
      pay_type: [
        { text: "نقد", value: "naghd" },
        { text: "پرداخت با کارتخوان", value: "pos" },
      ],
    };
  },
  mounted() {},
  methods: {
    payFactor(only_price) {
      let only_price_show = only_price;
      if (Boolean(this.basketId)) {
        this.$reqApi("basket/sale-agency/seller/payment", {
          only_price: only_price_show,
          kind_set: this.kind_set,
          basket_id: this.basketId,
        })
          .then((res) => {
            if (Boolean(only_price_show)) {
              this.wallet = res;
              this.only_price = true;
              return;
            }
            this.$toast.success("سفارش با موفقیت پرداخت شد");
            this.closeDialog()
            this.$emit("relaod")
          })
          .catch((err) => {});
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.card-style{
  border: 9px double #919191 !important;
}
</style>

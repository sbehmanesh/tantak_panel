<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card
      style="overflow: hidden !important"
      class="pa-5"
      :disabled="loading"
    >
      <div class="card-style pa-5">
        <v-row class="d-flex align-center pa-5 mb-4">
          <h1 class="font_18">جزییات سبد خرید</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-row>
        <v-row
          class="d-flex justify-center mb-3"
          v-if="
            (Object.keys(transactions).length > 0 &&
              transactions.wallet_transactions.length > 0) ||
            transactions.payments.length > 0
          "
        >
          <v-col cols="12" md="4" v-if="step == 2">
            <amp-button
              text=" مشاهده موجودی سبد"
              height="38"
              block
              icon="local_mall"
              color="blue-grey"
              @click="step--"
              class="ma-1"
            />
          </v-col>

          <v-col cols="12" md="4" v-if="step == 1">
            <amp-button
              icon="document_scanner"
              text=" مشاهده تراکنش ها"
              height="38"
              block
              color="blue-grey"
              @click="step++"
              class="ma-1"
            />
          </v-col>
        </v-row>
        <v-window v-model="step">
          <v-window-item :value="1" class="pa-2">
            <div class="d-flex align-center">
              <h1 class="mx-2">
                <v-icon x-small color="red"> fiber_manual_record </v-icon>
                برای ثبت مرجوعی روی آیتم مورد نظر کلیک کنید
              </h1>
              <v-divider></v-divider>
            </div>

            <v-card
              v-if="Boolean(show_item)"
              v-for="(x, i) in items_basket"
              :key="i"
              class="pa-3 elevation-1 my-4 card-items"
              outlined
              :style="
                Boolean(x.returned)
                  ? 'border-right : 2px solid red !important;'
                  : ''
              "
            >
              <v-card-text class="elevation-0" @click="show_dialog(i)">
                <h1 v-if="Boolean(x.product)">
                  <small> {{ i + 1 }} - </small>
                  {{ x.product.name }}

                  <br />
                  <small>
                    {{ x.information }}
                  </small>
                </h1>
                <h1 v-else>
                  <small> {{ i + 1 }} - </small>
                  {{ x.information }}
                  <small> ( پکیج ) </small>
                </h1>
                <h1>
                  <v-row class="justify-space-between pa-3 py-4">
                    <small>
                      بارکد :‌
                      {{ x.full_barcode }}
                    </small>
                    <small> قیمت :‌ {{ $price(x.price) }} ریال </small>
                    <small>
                      تعداد :‌
                      {{ x.number }}
                    </small>
                    <small>
                      جمع کل :‌
                      {{ $price(x.price * x.number) }} ریال
                    </small>
                  </v-row>
                </h1>
              </v-card-text>
              <v-card v-if="Boolean(x.returned)"  class="red lighten-5 elevation-3" outlined>
                <v-col cols="12"  >
             
             <v-row class="align-center mt-2 ">
               <v-col cols="3">
                 <amp-select
                   text=" نوع مرجوعیت"
                   :items="$store.state.static.reterned_type"
                   v-model="x.returned_type"
                 />
               </v-col>
               <v-col cols="2">
                 <amp-input
                   text="تعداد"
                   v-model="x.new_count"
                   rules="number"
                   cClass="ltr-item"
                 />
               </v-col>
               <v-col cols>
                 <amp-textarea
                   text=" توضیحات"
                   :rows="1"
                   v-model="x.description"
                 />
               </v-col>
               <v-col cols="12">
                 <amp-button
                   text="ثبت  مرجوعی"
                   height="40"
                   block
                   icon="free_cancellation"
                   color="red lighten-1"
                   :disabled="
                     !Boolean(x.new_count) ||
                     !Boolean(x.returned_type) ||
                     !Boolean(x.description)
                   "
                   @click="submitReterned(x)"
                   class="ma-1"
                 />
               </v-col>
             </v-row>
           </v-col>
              </v-card>
            
            </v-card>
          </v-window-item>

          <v-window-item :value="2">
            <div
              class="text-center my-2"
              v-if="Object.keys(transactions).length > 0"
            >
              <v-card
                v-for="(x, i) in transactions.payments"
                :key="x.id"
                class="pa-3 elevation-1 my-4"
                outlined
              >
                <h1>
                  {{ x.text }}
                  <small v-if="Boolean(x.paid_date)">
                    ( پرداخت شده در
                    {{ $toJalali(x.paid_date, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
                    )
                  </small>
                </h1>
                <br />

                <h1>
                  <v-row class="justify-space-between pa-3">
                    <small>
                      شماره تراکنش :‌
                      {{ x.transaction_number }}
                    </small>
                    <small> مبلغ تراکنش :‌ {{ $price(x.price) }} ریال </small>
                  </v-row>
                </h1>
              </v-card>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  v-for="(x, i) in transactions.wallet_transactions"
                  :key="x.id"
                  class="text-center"
                >
                  <v-card
                    style="border-top: 3px solid grey"
                    class="pa-3 elevation-1 my-4"
                    outlined
                  >
                    <h1>
                      {{ x.pay_text }}
                      <small v-if="Boolean(x.paid_date)">
                        ( پرداخت شده در
                        {{
                          $toJalali(x.paid_date, "YYYY-MM-DD", "jYYYY/jMM/jDD")
                        }}
                        )
                      </small>
                    </h1>
                    <br />

                    <h1>
                      <v-icon class="ml-1" small> done_outline </v-icon>
                      <small v-if="x.kind == 'credit'" class="grey--text">
                        تراکنش انجام شده از کیف پول اعتباری
                      </small>
                      <small v-if="x.kind == 'cash'" class="grey--text">
                        تراکنش انجام شده از کیف پول نقدی
                      </small>
                    </h1>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <div
              class="text-center mt-6"
              v-if="
                Object.keys(transactions).length > 0 &&
                transactions.payments.length == 0 &&
                transactions.wallet_transactions.length == 0
              "
            >
              <v-icon size="45"> receipt_long </v-icon>
              <h1 class="font_15 grey--text">تراکنشی ثبت نشده</h1>
            </div>
          </v-window-item>
        </v-window>
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
    data: {
      type: Array,
      default: [],
    },
    transactions: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      items_basket: [],
      check_returned: [],

      valid: true,
      show_item: true,
      loading: false,
      returned_items: false,
      selected_box: {},
      form: {
        status: "",
        file: "",
        message: "",
        id: "",
      },
      items: [],
      step: 1,
    };
  },
  mounted() {
    if (this.data.length > 0) {
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];
        element["returned"] = false;
        element["returned_type"] = "";
        element["new_count"] = "";
        this.items_basket.push(element);
      }
    }
  },

  methods: {
    closeDialog() {
if (this.check_returned.length > 0) {
  this.$emit("reload")
}
      this.$emit("closeDialog");
    },
    show_dialog(index) {
      this.show_item = false;
      this.items_basket[index].returned = !this.items_basket[index].returned;
      this.show_item = true;
      // this.checkReturned();
    },
    // checkReturned() {
    //   this.check_returned = this.items_basket.filter((x) =>
    //     Boolean(x.returned)
    //   );
    // },
    submitReterned(data) {
      this.loading = true;
      if (data.new_count > data.number) {
        this.$toast.info(
          "تعداد وارد شده از تعداد  موجودی محصول در سبد خرید بیشتر است"
          
        );
        this.loading = false;
        return;
      }

      let form = {
        basket_id: data.basket_id,
        section_id: Boolean(data.package_id)
          ? data.package_id
          : data.product_varcomb_id,
        section_name: Boolean(data.package_id)
          ? "Package"
          : "ProductVariationCombination",
        description: data.description,
        sale_agency_id: this.$store.state.auth.user.sale_agency_id,
        type: data.returned_type,
        number: data.new_count,
      };
      this.$reqApi("return-product/insert", form)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.check_returned.push(form.section_id);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.card-style {
  border: 8px double #808080a1 !important;
}
.card-items {
  cursor: pointer !important;
  border-right: 2px solid rgb(141, 141, 141) !important ;
  transition: all 0.4s ease;
}
.card-items:hover {
  transform: scale3d(1.01, 1.01, 1.01);
  opacity: 1;
  box-shadow: 0px 8px 8px 1px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.4s ease;
}
</style>

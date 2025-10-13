<template>
  <div>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-row class="justify-center">
      <v-col cols="12" md="12">
        <div class="pa-5" v-if="!loading">
          <v-card class="elevation-0 card-style">
            <v-card-title class="  d-flex align-center justify-center elevation-0">
     
          
              <v-btn   dark color="primary darken-1" class="ma-3">
                           کیف پول نقدی : <b>
                {{ $price(user.cash_wallt) }} (ریال)
                </b>
              </v-btn>    
                  <v-btn   outlined color="primary darken-1" class="ma-3">
                    کیف پول اعتباری: <b>
                 {{ $price(user.credit_wallt) }} (ریال)
                </b>
              </v-btn>   
          
              <v-btn v-if="user.reagent_code"  dark color="primary darken-1" class="ma-3">
                کد معرف : <b>
                  {{ user.reagent_code }}
                </b>
              </v-btn>    
                 <v-btn v-if="user.personnel_code" outlined class="ma-3" color="primary darken-1">
                کد پرسنلی : <b>
                  {{ user.personnel_code }}
                </b>
              </v-btn>
            </v-card-title>
            <v-col cols="12" v-if="wallet_items.length > 0">
              <v-divider v-for="i in 5" :key="i"></v-divider>
            </v-col>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  v-for="(item, index) in wallet_items"
                  :key="index"
                >
                  <v-card class="pa-5 ma-1 card-style2 elevation-2"  >
                    <div class="d-flex align-center py-1">
                      <h1 class="font_14">
                        {{ index + 1 }} - {{ item.pay_text }} (
                        {{
                          $getItemEnum(
                            $store.state.static.wallet_type,
                            item.type
                          )
                        }}

                        )
                      </h1>
                      <v-divider class="mx-3" style="border: 1px dashed #bdbdbd;"></v-divider>
                    </div>
        
                    <v-card-text class="d-flex align-center">
                      <v-row class="align-center justify-space-between pa-3 ">
                        <h1 class="font_12">
                          تاریخ ثبت :‌
                          {{
                            $toJalali(
                              item.created_at,
                              "YYYY-MM-DD",
                              "jYYYY/jMM/jDD"
                            )
                          }}
                        </h1>
                        <h1 class="font_12">
                          تاریخ پرداخت :
                          {{
                            $toJalali(
                              item.paid_date,
                              "YYYY-MM-DD",
                              "jYYYY/jMM/jDD"
                            )
                          }}
                        </h1>
                        <h1 class="font_12">
                          نوع :
                          {{
                            $getItemEnum(
                              $store.state.static.wallet_kind,
                              item.kind
                            )
                          }}
                        </h1>
                        <h1 class="font_12">
                          مقدار :
                          {{ $price(item.amount) }} (ریال)
                        </h1>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-col cols="12" v-if="total_items.length > 0">
                <v-card
                  @click="actionData"
                  class="align-center pa-3 see-all d-flex"
                >
                  <v-spacer></v-spacer>
                  <h1 v-if="show_all">مشاهده همه</h1>
                  <h1 v-else>بستن</h1>
                  <v-spacer></v-spacer>
                  <v-icon v-if="show_all"> keyboard_arrow_down </v-icon>
                  <v-icon v-else> keyboard_arrow_up </v-icon>
                </v-card>
              </v-col>
            </v-card-text>
          </v-card>
        </div>
        <div v-if="loading" class="text-center my-10">
          <v-progress-circular
            size="40"
            width="5"
            indeterminate
            color="grey darken-2 "
          >
          </v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    wallet_items: [],
    user: {},
    total_items: [],
    show_all: true,
    loading: true,
  }),
  beforeMount() {
    this.user = this.$store.state.auth.user;
    this.getWallet();
  },
  methods: {
    actionData() {
      this.show_all = !this.show_all;
      if (!Boolean(this.show_all)) {
        let items = this.wallet_items;
        for (let index = 0; index < this.total_items.length; index++) {
          const element = this.total_items[index];
          items.push(element);
        }
        let sort_items = items.sort((a, b) => {
          a.created_at - b.created_at;
        });
        this.wallet_items = sort_items;
      } else {
        this.wallet_items = this.wallet_items.filter((f, i) => i < 3);
      }
    },
    getWallet() {
      this.$reqApi("shop/wallet")
        .then((res) => {
          let data = res.model.data;
          let sort_items = data.sort((a, b) => {
            a.created_at - b.created_at;
          });
          if (sort_items.length > 0) {
            this.wallet_items = sort_items.filter((f, i) => i < 3);
            this.total_items = sort_items.filter((f, i) => i >= 3);
          } else {
            this.wallet_items = sort_items;
          }

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
strong {
  font-size: 16px;
}

.card-style2 {
  border: 1px solid #0000002f;
}
.see-all {
  border: 1px solid #bdbdbd;
  background-color: #8080803a;
  border-radius: 8px;
}
.see-all:hover {
  border: 1px solid #bdbdbd;
  background-color: #63626267;
  border-radius: 8px;
  cursor: pointer;
}
.card-style {
  border: 6px double #201f1f44;
  border-radius: 8px;
}
</style>

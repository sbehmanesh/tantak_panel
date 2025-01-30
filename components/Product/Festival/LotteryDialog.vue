<template>
  <v-dialog v-model="dialog" persistent max-width="980">
    <v-card style="overflow: hidden !important" class="pa-5 pt-8">
      <v-row class="d-flex align-center px-8">
        <h1 class="font_16">ثبت قرعه کشی</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-stepper v-model="e6" vertical elevation="0">
        <v-stepper-step :complete="e6 > 1" step="1">
          <span >اطلاعات پایه قرعه کشی</span>
          <small class="mt-1" >موارد اجباری با * علامت گذاری شده</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <amp-input
                  text="تعداد افراد "
                  v-model="form.people_number_use"
                  rules="require,number"
                  cClass="ltr-item"
                />
              </v-col>
              <v-col cols="12" md="6">
                <amp-jdate
                  text="زمان قرعه کشی"
                  rules="require"
                  :is-number="true"
                  v-model="form.time"
                />
              </v-col>
              <v-col cols="12" md="6">
                <amp-select
                  text="وضعیت"
                  v-model="form.status"
                  :items="$store.state.static.status"
                  rules="require"
                />
              </v-col>
              <v-col cols="12" md="6">
                <amp-input
                  text="ترتیب"
                  v-model="form.sort"
                  rules="number"
                  cClass="ltr-item"
                />
              </v-col>
              <v-col cols>
                <amp-textarea
                  text="توضیحات"
                  :rows="1"
                  v-model="form.description"
                />
              </v-col>
            </v-row>
            <v-row class="pa-2 justify-center">
              <v-col cols="12" md="3">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  @click="e6++"
                  class="ma-1"
                  :loading="loading"
                  :disabled="loading || !valid"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 2" step="2">
          Configure analytics for this app
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-col cols="12">
              <WinningUsers
                :load-data="load_data"
                ref="WinningUsersFestival"
                @winingUsers="winingUsers($event)"
                v-if="valid"
                :users-count="form.people_number_use"
              />
            </v-col>
        </v-stepper-content>
      </v-stepper>


 
    </v-card>
  </v-dialog>
</template>
<script>
import FestivalAwards from "@/components/Product/Festival/FestivalAwards.vue";
import WinningUsers from "@/components/Product/Festival/WinningUsers.vue";
export default {
  components: { FestivalAwards, WinningUsers },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    festivalId: {
      type: String,
      default: "",
    },
    itemId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valid: true,
      e6: 1,

      loading: false,
      createUrl: "/lottery/insert",
      updateUrl: "/lottery/update",
      showUrl: "/lottery/show",
      only_price: false,
      products: [],
      peoples: [],
      load_data: [],
      package: [],
      load_items: {},
      form: {
        people_number_use: "",
        time: "",
        status: "",
        sort: "",
        description: "",
      },
      types: [
        { text: "محصول ", value: "product_var_com_items" },
        { text: "پکیج ", value: "package_items" },
        { text: "کد تخفیف", value: "coupon_items" },
        { text: "اعتباری", value: "wallets" },
        { text: "محصولات غیر سیستمی", value: "not_system_product_ids" },
      ],
      type_data: {},
    };
  },
  mounted() {
    this.loadPackages();
    this.loadProduct();
    if (this.itemId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      this.$refs.WinningUsersFestival.callSubmit();
    },
    winingUsers(event) {
      for (let i in this.types) {
        this.type_data[this.types[i].value] = [];
      }
      for (let i in event) {
        if (event[i].gift_items.length == 0) {
          this.$toast.error(
            ` برای برنده شماره ${event[i].number} هدیه ای ثبت نشده`
          );
          return;
        }
      }
      for (let i = 0; i < event.length; i++) {
        const x = event[i];
        for (let index = 0; index < x.gift_items.length; index++) {
          const element = x.gift_items[index];
          this.sortData(element);
        }
      }
      let form = { ...this.form, ...this.type_data };
      form["festival_id"] = this.festivalId;
      let url = Boolean(this.itemId) ? this.updateUrl : this.createUrl;
      if (Boolean(this.itemId)) {
        form["id"] = this.itemId;
      }
      this.$reqApi(url, form)
        .then((res) => {
          this.$toast.success("قرعه کشی با موفقیت ثبت شد");
          this.closeDialog();
        })
        .catch((err) => {});
    },
    sortData(item) {
      if (item.type == "product_var_com_items") {
        item.items.map((x) => {
          this.type_data.product_var_com_items.push({
            id: x.id,
            number: x.number,
            person_win: item.user_number,
          });
        });
      } else if (item.type == "package_items") {
        item.items.map((x) => {
          let id = "";
          if (typeof x.value != "undefined") {
            id = x.value;
          } else if (x.id != "undefined") {
            id = x.id;
          }

          this.type_data.package_items.push({
            id: id,
            number: x.number,
            person_win: item.user_number,
          });
        });
      } else if (item.type == "cash") {
        this.type_data.wallets.push({
          person_win: item.user_number,
          amount: item.value,
          type: "cash",
        });
      } else if (item.type == "coupon_items") {
        item.items.map((x) => {
          this.type_data.coupon_items.push({
            person_win: item.user_number,
            id: x.value,
          });
        });
      } else if (item.type == "credit") {
        this.type_data.wallets.push({
          person_win: item.user_number,
          amount: item.value,
          type: "credit",
        });
      } else if (item.type == "not_system_product_ids") {
        item.items.map((x) => {
          this.type_data.not_system_product_ids.push({
            id: x.value,
            number: x.number,
            person_win: item.user_number,
          });
        });
      }
    },

    //   this.form.package_items = event.packages;
    //   this.form.product_items = event.products;
    //   let form = { ...this.form };
    //   form["festival_id"] = this.festivalId;
    //   this.loading = true;
    //   let url = this.createUrl;
    //   if (this.itemId) {
    //     url = this.updateUrl;

    //   }
    //   this.$reqApi(url, form)
    //     .then((response) => {
    //       if (!this.itemId) {
    //         this.$toast.success("اطلاعات ثبت شد");
    //       } else {
    //         this.$toast.success("اطلاعات ویرایش شد");
    //       }
    //       this.closeDialog();
    //     })
    //     .catch((error) => {
    //       this.loading = false;
    //     });
    // },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.itemId })
        .then(async (response) => {
          let data = response.data;
          this.form.people_number_use = data.people_number_use.toString();
          this.form.time = data.time;
          this.form.status = data.status;
          this.form.sort = data.sort;
          this.form.description = data.description;
          this.form.festival_id = data.festival_id;
          let mian_array = [
            ...data.wallets,
            ...data.product_var_coms,
            ...data.coupons,
            ...data.packages,
          ].reduce((pre, cur) => {
            if (typeof pre[cur.person_win] == "undefined") {
              pre[cur.person_win] = {
                number: cur.person_win,
                gift_items: [],
              };
            }
            if (typeof cur.coupon != "undefined") {
              let items = [];
              let check = pre[cur.person_win].gift_items.find(
                (x) => x.type == "coupon_items"
              );
              let discount_value =
                cur.type == "amount"
                  ? `${this.$price(cur.value)} ریال`
                  : `${cur.value} درصد`;
              let start = this.$toJalali(
                cur.start_date,
                "YYYY-MM-DD",
                "jYYYY/jMM/jDD"
              );
              let end = this.$toJalali(
                cur.end_date,
                "YYYY-MM-DD",
                "jYYYY/jMM/jDD"
              );
              let date = `قابل استفاده از تاریخ ${start} تا ${end}`;
              items.push({
                text: cur.for_title,
                date: date,
                coupon: cur.coupon,
                value: cur.id,
                discount_value: discount_value,
              });

              pre[cur.person_win].gift_items.push({
                type: "coupon_items",
                user_number: cur.person_win,
                type_name: `کد تحفیف ( نفر ${cur.person_win} )`,
                items: items,
              });
            }

            if (typeof cur.package_number != "undefined") {
              let check = pre[cur.person_win].gift_items.find(
                (x) => x.type == "package_items"
              );
              if (Boolean(check)) {
                check.items.push(cur);
              } else {
                pre[cur.person_win].gift_items.push({
                  type: "package_items",
                  user_number: cur.person_win,
                  type_name: `پکیج ( نفر ${cur.person_win} )`,
                  items: [cur],
                });
              }
            }

            if (typeof cur.lotterygable_id != "undefined") {
              let text =
                cur.lotterygable_id == "cash"
                  ? "کیف پول نقدی"
                  : "کیف پول اعتباری";
              pre[cur.person_win].gift_items.push({
                type: cur.lotterygable_id == "cash" ? "cash" : "credit",
                user_number: cur.person_win,
                type_name: `${text} ( نفر ${cur.person_win} )`,
                value: cur.number,
              });
            }

            if (cur.type == "Product") {
              let check = pre[cur.person_win].gift_items.find(
                (x) => x.type == "product_var_com_items"
              );
              if (Boolean(check)) {
                check.items.push(cur);
              } else {
                pre[cur.person_win].gift_items.push({
                  type: "product_var_com_items",
                  user_number: cur.person_win,
                  type_name: `محصول ( نفر ${cur.person_win} )`,
                  items: [cur],
                });
              }
            }
            return pre;
          }, {});
          for (let key in mian_array) {
            this.load_data.push(mian_array[key]);
          }
          if (
            Boolean(data.not_system_products) &&
            data.not_system_products &&
            data.not_system_products.length > 0
          ) {
            let items_not_system_products = [];
            for (let i = 0; i < this.load_data.length; i++) {
              const x = this.load_data[i];
              data.not_system_products.map((y) => {
                if (y.person_win == x.number) {
                  items_not_system_products.push({
                    text: y.value,
                    type: "not_system_product_ids",
                    type_name: `محصولات سیستمی  نفر ( ${y.person_win} )`,
                    value: y.id,
                    number: y.number,
                    user_number: y.person_win,
                  });
                }
              });
            }

            const uniq_items = items_not_system_products.reduce((acc, item) => {
              const key = item.type;
              if (!acc[key]) {
                acc[key] = {
                  type: item.type,
                  type_name: `محصولات سیستمی  نفر ( ${item.user_number} )`,
                  number: item.user_number,
                  items: [
                    {
                      text: item.text,
                      number: item.number,
                      value: item.value,
                    },
                  ],
                };
              } else {
                acc[key].items.push({
                  text: item.text,
                  number: item.number,
                  value: item.value,
                });
              }
              return acc;
            }, {});

            for (let key in uniq_items) {
              this.load_data.map((x) => {
                if (x.number == uniq_items[key].number) {
                  uniq_items[key]["user_number"] = uniq_items[key].number;
                  x.gift_items.push(uniq_items[key]);
                }
              });
            }
          }

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadPackages() {
      let filter = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      this.$reqApi("/package", { filters: filter, row_number: 2000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.package = items;
        })
        .catch((error) => {});
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

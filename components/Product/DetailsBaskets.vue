<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card
        v-if="!loading"
        class="elevation-0 pa-8"
        style="overflow: hidden !important"
      >
        <v-row cols="12" class="justify-end mb-4">
          <v-btn icon @click="closeDialog">
            <v-icon> cancel </v-icon>
          </v-btn>
        </v-row>

        <v-row>
          <v-col
            class="pa-0"
            cols="12"
            md="4"
            v-for="(status, index) in items.informations_status"
            :key="index"
          >
            <v-card outlined class="pa-3 text-center rounded-0">
              <v-icon color="success"> task_alt </v-icon>
              <h1>
                {{ status.text }}
              </h1>
              <h1 class="grey--text">
                {{ status.value }}
              </h1>
            </v-card>
          </v-col>
        </v-row>
        <v-row
          v-if="Boolean(items.main_details) && items.main_details.length > 0"
        >
          <v-col cols="12">
            <v-banner single-line>
              <h1>
                {{ items.main_details[0].text }}
                {{ items.main_details[0].value }}
              </h1>
              <h1 class="grey--text">
            
                  <v-row class="align-center pa-3">
                    <v-avatar size="25" class="mx-2">
                    <img :src="$getImage(items.main_details[1].value.avatar)" />
                  </v-avatar>
                    <small>
                      {{ items.main_details[1].text }}
                      {{ items.main_details[1].value }}
                    </small>
               
                  <v-spacer></v-spacer>
                  <small>
                    {{ items.main_details[2].text }}
                    {{ items.main_details[2].value }}
                  </small>
           
                  </v-row>
               
              </h1>
            </v-banner>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, y) in basket_items" :key="y" cols="12">
            <v-card
              outlined
              class="d-flex elevation-1 align-center pa-4"
              :style="
                Boolean(item.color)
                  ? `border-right:3px solid ${item.color}`
                  : ''
              "
            >
              <v-avatar size="55" class="mx-2">
                <img
                  width="48"
                  height="48"
                  contain
                  :src="$getImage(item.img)"
                />
              </v-avatar>
              <div>
                <h1>
                  {{ item.name }}
                  <br />
                  <small> بارکد {{ item.full_barcode }} </small>
                  <br />

                  <small> تعداد {{ item.number }} </small>
                  <br />

                  <small> قیمت {{ $price(item.price) }} ریال </small>
                </h1>
              </div>
              <v-spacer></v-spacer>
              <div class="align-top">
                <v-row class="justify-end mb-2">
                  <v-chip>
                    <h1>
                      <small v-if="item.info_type == 'string'"> محصول </small>
                      <small
                        v-if="
                          item.info_type != 'string' && item.type == 'Package'
                        "
                      >
                        پکیج
                      </small>
                      <small v-else-if="item.info_type != 'string'">
                        جعبه
                      </small>
                    </h1>
                  </v-chip>
                </v-row>

                <h1 v-if="item.info_type == 'string'">
                  <small>
                    {{ item.info }}
                  </small>
                </h1>
                <h1
                  v-else
                  v-for="(q, z) in item.info"
                  :key="z"
                  class="grey--text"
                >
                  <small>
                    {{ z + 1 }} - {{ q.var }} - تعداد {{ q.count }} - قیمت محصول
                    {{ $price(q.price) }} ریال
                  </small>
                </h1>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card
              class="pa-4 d-flex justify-space-between align-center rounded-0 primary lighten-4"
              outlined
            >
              <h1
                v-if="Boolean(h.value)"
                class="font_11"
                v-for="(h, i) in items.hed"
                :key="i"
              >
                {{ h.text }} {{ h.value }}
              </h1>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },

    data: {
      default: {},
      type: Object,
    },
  },
  data() {
    return {
      now: "",
      items: [],
      basket_items: [],
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 800);
    let set_items = [];
    let x = this.data;
    let user =
      Boolean(x.user.first_name) && Boolean(x.user.last_name)
        ? `${x.user.first_name} ${x.user.last_name} -`
        : "";
    set_items = {
      hed: [
        { text: "مبلغ کل (ریال)", value: this.$price(x.base_price) },
        { text: "وزن (گرم)", value: x.total_weight },
        { text: "مبلغ قابل پرداخت (ریال)", value: this.$price(x.price) },
        {
          text: "  تخفیف هماهنگ کننده (ریال)",
          value: this.$price(x.discount_coordinat),
        },
      ],
      informations_status: [
        {
          text: "وضعیت  سبد",
          value: this.$getItemEnum(
            this.$store.state.static.status_basket_refral,
            x.status
          ),
        },
        {
          text: "روند ارجاع",
          value: this.$getItemEnum(
            this.$store.state.static.step_basket_refral,
            x.step
          ),
        },
        {
          text: "وضعیت  انبار",
          value: this.$getItemEnum(
            this.$store.state.static.status_stock,
            x.status_stock
          ),
        },
      ],
      main_details: [
        { text: "شماره فاکتور", value: x.factor_number },
        {
          text: "اطلاعات کاربر",
          value: `${user}  ${this.$showUsername(x.user.username)}`,
          avatar: x.avatar,
        },
        { text: " زمان تخصیص", value: Boolean(x.allocation_at) ?  this.$toJalali(x.allocation_at) : 'ثبت نشده' },
      ],
    };
    this.setItemsBasket(x.items);

    this.items = set_items;
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    setItemsBasket(data) {
      let items = [];
      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        if (Boolean(x.product_id)) {
          items.push({
            color: "orange",
            name: x.product.name,
            number: x.number,
            full_barcode: x.full_barcode,
            info: x.information,
            img: x.product.main_image,
            price: x.price,
            info_type: "string",
          });
        } else if (Boolean(x.package_id)) {
          let variations = [];
          for (
            let index = 0;
            index < x.package.product_varcoms.length;
            index++
          ) {
            const element = x.package.product_varcoms[index];
            let var1 = Boolean(element.variation1.codes)
              ? element.variation1.variation_type.value +
                " " +
                element.variation1.colors
              : element.variation1.variation_type.value +
                " " +
                element.variation1.value;
            let var2 =
              element.variation2.variation_type.value +
              " " +
              element.variation2.value;
            let var3 =
              element.variation3.variation_type.value +
              " " +
              element.variation3.value;
            variations.push({
              var:
                element.variation1.product.name +
                " " +
                var1 +
                " / " +
                var2 +
                " / " +
                var3,
              count: element.count_product,
              price: element.price,
              full_barcode: element.full_barcode,
            });
          }
          items.push({
            color: x.type == "Package" ? "orange" : "orange",
            name: x.package.name + " - " + `${x.package.package_number} `,
            number: x.number,
            full_barcode: x.full_barcode,
            info: variations,
            info_type: "array",
            img: x.package.logo,
            price: x.price,
            type: x.type,
          });
        }
      }
      this.basket_items = items;
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 18px;
}
h1 {
  font-size: 12px;
}
</style>

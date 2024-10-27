<template>
  <div>
    <AddProduct
      @add="addBasket($event)"
      @createList="createListPakage($event)"
      v-if="dialog_add_product.show"
      :DialogAdd="dialog_add_product"
    />
    <v-col class="text-center mb-5" cols="12">
      <v-icon
        @click="dialog_add_product.show = true"
        class="justify-center"
        size="150"
        color="orange darken-1"
      >
        shopping_basket
      </v-icon>

      <v-row class="d-flex justify-center">
        <small class="orange--text"> برای افزودن محصول کلیک کنید </small>
      </v-row>
      <br />
      <br />

      <v-row class="d-flex justify-center">
        <v-btn plain color="red darken-3" text @click="backStep()">
          برگشت
          <v-icon size="18" class="mr-1"> arrow_circle_right </v-icon>
        </v-btn>
      </v-row>
    </v-col>

    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-card>
          <div >
            <v-col cols="12">
              <v-row class="py-3 orange">
                <v-divider class="mt-3 orange"></v-divider>
                <h1 class="mx-4 white--text">محصولات ثبت شده</h1>
                <v-divider class="mt-3 orange"></v-divider>
              </v-row>
            </v-col>
            <v-row class="py-4"               v-if="
                list_basket &&
                list_basket.items &&
                list_basket.items.length > 0 &&
                !loading
              ">
              <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                <small> نام محصول</small>
              </v-col>
              <v-spacer />

              <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                <small> ویژگی های انتخابی محصول </small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> تعداد</small>
              </v-col>
              <v-spacer />

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> قیمت </small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> مجموع قیمت</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small>تصویر</small>
              </v-col>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> حذف </small>
              </v-col>
            </v-row>
            <div class="mb-3">
              <v-divider class="orange"></v-divider>
              <v-divider class="orange"></v-divider>
            </div>
            <!-- ----------------------------------------------------------------------------------------------------- -->


            <div
              v-if="
                list_basket &&
                list_basket.items &&
                list_basket.items.length > 0 &&
                !loading
              "
            >
              <v-col
                cols="12"
                md="12"
                v-for="(item, index) in list_basket.items"
                :key="index"
              >
                <v-row class="py-2">
                  <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                    <small>
                      {{ index + 1 }} -
                      {{ item.name }}
                    </small>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                    <small> {{ item.information }}</small>
                  </v-col>

                  <v-spacer> </v-spacer>
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <v-row class="d-flex justify-center mt-1">
                      <v-btn @click="addNumber(item, true, 'product')" x-small text>
                        <v-icon small> add </v-icon>
                      </v-btn>
                      <small> {{ item.number }}</small>
                      <v-btn
                        :disabled="item.number == 1"
                        @click="addNumber(item, false, 'product')"
                        x-small
                        text
                      >
                        <v-icon small> remove </v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <small> {{ $price(item.price) }}</small>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <small> {{ $price(item.price * item.number) }}</small>
                  </v-col>

                  <v-spacer />

                  <v-card
                    elevation="0"
                    max-width="50"
                    class="mb-3 justify-center"
                    max-height="50"
                  >
                    <v-img
                      class="size-img justify-center"
                      :src="$getImage(item.main_image)"
                      height="auto"
                    />
                  </v-card>

                  <v-col class="ma-0 pa-0 text-center pr-3" md="1" cols="4">
                    <v-btn
                      @click="deleFromCard(index, item, 'product')"
                      x-small
                      text
                      class="justify-center"
                    >
                      <v-icon small> delete </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </div>
          </div>
          <v-col
            cols="12"
            class="text-center"
            v-if="!list_basket || !list_basket.items || !list_basket.items.length"
          >
          <v-icon  class="mb-1">
            production_quantity_limits
          </v-icon>
             <h1 >

            محصولی ثبت نشده
          </h1>

          </v-col>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-col cols="12">
            <v-row class="orange py-3 d-flex justify-center">
              <h1 class="mx-4 white--text">پکیج های ثبت شده</h1>
            </v-row>
          </v-col>

          <div>
            <v-row
              class="py-4 d-flex justify-center"
              v-if="pckage_list_item && pckage_list_item.length != 0"
            >
              <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                <small> نام پکیج</small>
              </v-col>
              <v-spacer />

              <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                <small> قیمت پکیج (ریال)</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> تعداد</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> تخفیف</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> پیش پرداخت </small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> مجموع قیمت</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small>تصویر</small>
              </v-col>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> حذف </small>
              </v-col>
            </v-row>
            <div class="mb-3">
              <v-divider class="orange"></v-divider>
              <v-divider class="orange"></v-divider>
            </div>
            <!-- ----------------------------------------------------------------------------------------------------- -->

            <v-col
              v-if="loading && load_list"
              v-for="i in 5"
              :key="i"
              class="ma-0 pa-0 text-center"
              md="12"
              cols="12"
            >
              <v-skeleton-loader v-bind="attrs" type="text"></v-skeleton-loader>
            </v-col>

            <div v-if="pckage_list_item && pckage_list_item.length != 0">
              <v-col
                cols="12"
                md="12"
                v-for="(item, index) in pckage_list_item"
                :key="index"
              >
                <v-row class="py-2">
                  <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                    <small>
                      {{ index + 1 }} -
                      {{ item.name }}
                    </small>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                    <small> {{ $price(item.price) }}</small>
                  </v-col>

                  <v-spacer> </v-spacer>
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <v-row class="d-flex justify-center mt-1">
                      <v-btn @click="addNumber(item, true, 'package')" x-small text>
                        <v-icon small> add </v-icon>
                      </v-btn>
                      <small> {{ item.count }}</small>
                      <v-btn
                        :disabled="item.count == 1"
                        @click="addNumber(item, false, 'package')"
                        x-small
                        text
                      >
                        <v-icon small> remove </v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <small> {{ $price(item.discount_amount) }} </small>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <small> {{ $price(item.prepay_amount) }}</small>
                  </v-col>

                  <v-spacer />
                  <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                    <small> {{ $price(item.price * item.count) }}</small>
                  </v-col>

                  <v-spacer />
                  <v-card
                    elevation="0"
                    max-width="50"
                    class="mb-3 justify-center"
                    max-height="50"
                  >
                    <v-img
                      class="size-img justify-center"
                      :src="$getImage(item.logo)"
                      height="auto"
                    />
                  </v-card>

                  <v-col class="ma-0 pa-0 text-center pr-3" md="1" cols="4">
                    <v-btn
                      @click="deleFromCard(index, item, 'package')"
                      x-small
                      text
                      class="justify-center"
                    >
                      <v-icon small> delete </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </div>
          </div>
          <v-col
            cols="12"
            class="text-center"
            v-if="!pckage_list_item || pckage_list_item.length == 0"
          >
          <v-icon  class="mb-1">
              view_list
          </v-icon>
          <h1 >

            پکیجی ثبت نشده
          </h1>
   
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import AddProduct from "@/components/Product/AddProduct.vue";
export default {
  props: {
    UserId: {
      require: true,
    },
    Save: {
      require: true,
    },
  },
  components: { AddProduct },
  data: () => ({
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    number: 1,
    valid_add_user: true,
    load_list: true,
    loading: false,
    next_btn: false,
    tab: null,
    user: [],
    pckage_list_item: [],
    products: [],
    list_basket: { items: [] },
    factor_list: {},
    main_image: "",
    first_name: "",
    last_name: "",
    username: "",
    receipt_img: "",
    product_varcomb_id: "",
    length_item: "",
    dialog_add_product: { show: false, items: null },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },

  watch: {
    "list_basket.items"() {
      let check = false;
      if (this.list_basket.items.length > 0) {
        check = true;
      } else {
        check = false;
      }
      this.$emit("list", check);
    },
    tab() {
      (this.user = []),
        (this.first_name = ""),
        (this.last_name = ""),
        (this.username = "");
    },

    // "list_basket.items"() {
    //   if (this.e1 == 3 ) {
    //     this.loadFactor()
    //   }
    // },
  },
  methods: {
    addBasket(event) {
      
      this.loading = true;
      let repetitious_item = false;

      for (let index = 0; index < this.list_basket.items.length; index++) {
        const element = this.list_basket.items[index];
        if (element.id == event.product.id) {
          element.number = element.number + event.number;
          repetitious_item = true;
          this.$toast.success(`${event.name} بروزرسانی شد `);
        }
      }
      let set_var_1 = Boolean(event.product.variation1.colors)
          ? event.product.variation1.colors
          : event.product.variation1.colors.value;
      if (!Boolean(repetitious_item)) {
        this.list_basket.items.unshift({
          information:
            event.product.variation1.variation_type.value +
            " " +
            set_var_1 +
            " - " +
            event.product.variation2.variation_type.value +
            " " +
            event.product.variation2.value +
            " - " +
            event.product.variation3.variation_type.value +
            " " +
            event.product.variation3.value,
          number: event.number,
          price: event.product.price
            ? event.product.price
            : event.product.variation1.product.base_price,

          full_barcode: event.product.full_barcode,
          discount: event.product.discount,
          id: event.product.id,
          name: event.name,
          main_image: event.product.variation1.product.main_image,
        });
        this.$toast.success("محصول به سبد خرید اضافه شد");
      }
      this.$emit("list", this.list_basket);
      this.loading = false;
    },

    deleFromCard(key, item, key_name) {
      this.loading = true;
      let items = [];
      if (key_name == "product") {
        items = this.list_basket.items;
      } else {
        items = this.pckage_list_item;
      }
      items.splice(key, 1);
      this.$toast.success(`${item.name} از لیست خرید  حذف شد`);
      this.loading = false;
    },
    addNumber(item, add, key_name) {
      this.loading = true;
      if (key_name == "product") {
        if (Boolean(add)) {
          item.number++;
        } else {
          item.number--;
        }
      } else {
        if (Boolean(add)) {
          item.count += 1;
        } else {
          item.count -= 1;
        }
      }

      this.$emit("chek_save");
      this.loading = false;
    },
    saveBasket() {
      return new Promise((res, rej) => {
        this.loading = true;
        let form = {};
        let items = [];
        form["user_id"] = this.UserId;
        for (let index = 0; index < this.list_basket.items.length; index++) {
          const x = this.list_basket.items[index];
          items.push({
            number: x.number,
            product_varcomb_id: x.id,
          });
        }
        let package_ids = [];
        for (let index = 0; index < this.pckage_list_item.length; index++) {
          const y = this.pckage_list_item[index];
          package_ids.push({
            id: y.id,
            count: y.count,
          });
        }
        form["array_items"] = items;
        form["package_ids"] = package_ids;
        this.$reqApi("basketitem/insert", form)
          .then((response) => {
            this.$toast.success("سبد خرید با موفقیت ثبت سبد");
            this.$emit("basket_costumer_id", response);
            res(true);
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
          });
      }).then((res) => {});
    },
    addPackageToBasket(event) {
      this.load_item = true;
      let form = {};
      form["user_id"] = this.UserId;
      form["package_ids"] = [];
      form.package_ids.push(event);
      this.$reqApi("package/add-basket", form)
        .then((response) => {
          this.$toast.success("پکیج  به سبد خرید اضافه شد");
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    cleareBasket() {
      this.list_basket.items = [];
    },
    backStep() {
      this.$emit("backStep");
    },
    createListPakage(event) {
      this.pckage_list_item.push(event);
    },
  },
};
</script>

<template>
  <div>
    <AddProduct
      @add="addBasket($event)"
      @addPackage="addPackageToBasket($event)"
      v-if="dialog_add_product.show"
      :DialogAdd="dialog_add_product"
    />

    <v-row
      v-if="list_basket && list_basket.items && list_basket.items.length > 0 && !loading"
    >
      <v-col cols="12">
        <amp-section text=" موجودی سبد خرید" />

        <v-col cols="12" class="text-start">
          <amp-button
            icon="add_circle"
            height="40"
            @click="dialog_add_product.show = true"
            color="orange darken-3"
            text="افزودن محصول"
          />
        </v-col>
        <div>



            <v-row class="amber py-2 my-2">
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
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
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> بارکد</small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> قیمت محصول</small>
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
          <div v-if="list_basket && list_basket.items">
            <v-col
              cols="12"
              md="12"
              v-for="(item, index) in list_basket.items"
              :key="index"
            >
              <v-row>
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <small> {{ item.name }}</small>
                </v-col>

                <v-spacer />
                <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                  <small> {{ item.information }}</small>
                </v-col>

                <v-spacer> </v-spacer>
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <v-row class="d-flex justify-center mt-1">
                    <v-btn @click="addNumber(item, true)" x-small text>
                      <v-icon small> add </v-icon>
                    </v-btn>
                    <small> {{ item.number }}</small>
                    <v-btn
                      :disabled="item.number == 1"
                      @click="addNumber(item, false)"
                      x-small
                      text
                    >
                      <v-icon small> remove </v-icon>
                    </v-btn>
                  </v-row>
                </v-col>

                <v-spacer />
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <small> {{ item.full_barcode }}</small>
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
                <v-col class="ma-0 pa-0 text-center pr-13" md="1" cols="4">
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
                </v-col>

                <v-col class="ma-0 pa-0 text-center pr-3" md="1" cols="4">
                  <v-btn
                    @click="deleFromCard(index, item)"
                    x-small
                    text
                    class="justify-center"
                  >
                    <v-icon small> delete </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-col>
          </div>
        </div>
      </v-col>
    </v-row>


<!-- ============================================= -->
<v-col cols="12" class="mt-8">
<v-row>
  <v-divider class="mt-3"></v-divider>
  <h1 class="mx-4">
  پکیج های ثبت شده
  </h1>
  <v-divider class="mt-3"></v-divider>
</v-row>

</v-col>
          <v-row class="orange lighten-3 py-2 my-2">
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
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
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> بارکد</small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> قیمت محصول</small>
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

    <v-col
      class="text-center"
      cols="12"
      v-if="
        list_basket && (!list_basket.items || list_basket.items.length < 1) && !loading
      "
    >
      <v-icon
        @click="dialog_add_product.show = true"
        class="justify-center"
        size="180"
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
      
      if (!Boolean(repetitious_item)) {
        this.list_basket.items.unshift({
          information:
            event.product.variation1.variation_type.value +
            " " +
            event.product.variation1.value +
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
          name: event.product.variation1.product.name,
          main_image: event.product.variation1.product.main_image,
        });
        this.$toast.success("محصول به سبد خرید اضافه شد");
      }
      this.$emit("list", this.list_basket);
      this.loading = false;
    },
    addPackageToBasket(event) {
      this.load_item = true;
      let form ={}
      form["user_id"]=this.UserId
      form["package_ids"]= []
      form.package_ids.push(event)

      this.$reqApi("package/add-basket", form)
        .then((response) => {
          this.$toast.success("پکیج  به سبد خرید اضافه شد");
        })
        .catch((error) => {
          this.load_item = false;
        });
    },   
    deleFromCard(key, item) {
      this.loading = true;
      let product = this.list_basket.items;
      product.splice(key, 1);
      this.$toast.success(`${item.name} از لیست خرید  حذف شد`);
      this.loading = false;
    },
    addNumber(item, add) {
      this.loading = true;
      if (Boolean(add)) {
        item.number++;
      } else {
        item.number--;
      }
      this.$emit("chek_save");
      this.loading = false;
    },
    saveBasket() {
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
      form["array_items"] = items;
      this.$reqApi("basketitem/insert", form)
        .then((response) => {
          this.$toast.success("سبد خرید با موفقیت ثبت سبد");
         this.$emit("basket_costumer_id" , response)
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    cleareBasket() {
      this.list_basket.items = [];
    },
    backStep() {
      this.$emit("backStep");
    },
  },
};
</script>

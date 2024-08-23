<template>
  <div>
    <AddProduct
      @add="addBasket($event)"
      @createList="createListPakage($event)"
      v-if="dialog_add_product.show"
      :DialogAdd="dialog_add_product"
    />
    <BrackDialog
      :brackDialog="brack_dialog"
      v-if="brack_dialog.show"
      @continueBreack="brackPackage($event)"
      :productPackage="show_product_package"
    />
    <PriceDialog
      :priceDialog="price_dialog"
      :basketPrice="basket_price"
      @updateBasket="saveBasket"
      v-if="price_dialog.show"
    />
    <GetLicenseDialog
      :reqToLicense="dialog_req_to_license"
      :basketPrice="basket_price"
      :packageId="package_id"
      @updateBasket="saveBasket($event)"
      v-if="dialog_req_to_license.show"
    />
    <v-row class="d-flex justify-center mt-4">
      <v-col calss="" cols="12" md="4">
        <DeliveryInfo :data="user_informations" v-if="!loading_factor " />
      </v-col>
    </v-row>

    <v-col cols="12" class="mt-5">
      <v-col cols="12" class="text-start" v-if="Boolean(is_coordinator)">
        <amp-button
          icon="add_circle"
          height="40"
          @click="dialog_add_product.show = true"
          color="orange darken-3"
          text="افزودن محصول"
        />
      </v-col>
      <v-card class="mt-3">
        <v-col cols="12">
          <v-row class="orange lighten-3 py-2 mb-2">
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
        </v-col>
        <v-col
          v-if="load_list"
          v-for="i in 5"
          :key="i"
          class="ma-0 pa-0 text-center"
          md="12"
          cols="12"
        >
          <v-skeleton-loader v-bind="attrs" type="text"></v-skeleton-loader>
        </v-col>
        <div v-if="list_basket && list_basket.items && !load_list">
          <v-col
            cols="12"
            md="12"
            v-for="(item, index) in list_basket.items"
            :key="index"
          >
            <v-row>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> {{ index + 1 }} - {{ item.name }}</small>
                <small
                  v-if="item.add_from_package && Boolean(item.add_from_package)"
                  class="orange--text"
                >
                  ( پکیج )
                </small>
              </v-col>

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                <small> {{ item.information }}</small>
              </v-col>

              <v-spacer> </v-spacer>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <v-row class="d-flex justify-center mt-1">
                  <v-btn
                    v-if="Boolean(is_coordinator)"
                    @click="addNumber(item, true, 'product')"
                    x-small
                    text
                  >
                    <v-icon small> add </v-icon>
                  </v-btn>
                  <small> {{ item.number }}</small>
                  <v-btn
                    v-if="Boolean(is_coordinator)"
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
                  v-if="Boolean(is_coordinator)"
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
        <div v-if="list_basket.items == 0 && !load_list">
          <v-col cols="12" class="text-center">
            <v-icon large> production_quantity_limits </v-icon>
          </v-col>
        </div>
      </v-card>
      <v-col cols="12" class="mt-4">
        <amp-section text="پکیج های ثبت شده" />
      </v-col>
      <v-card class="mt-5">
        <div>
          <v-col cols="12">
            <v-row class="py-2 mb-2 d-flex justify-center orange lighten-3">
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> نام پکیج</small>
              </v-col>
              <v-spacer />

              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
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
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4"> </v-col>
            </v-row>
          </v-col>
          <v-col
            v-if="
              pckage_list_item && pckage_list_item.length != 0 && !load_list
            "
            v-for="(item, index) in pckage_list_item"
            :key="index"
            cols="12"
          >
            <v-row class="d-flex justify-center">
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small>
                  {{ index + 1 }} -
                  {{ item.name }}
                </small>
              </v-col>
              <v-spacer />

              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> {{ $price(item.price) }}</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <v-row class="d-flex justify-center mt-1">
                  <v-btn
                    v-if="Boolean(is_coordinator)"
                    @click="addNumber(item, true, 'package')"
                    x-small
                    text
                  >
                    <v-icon small> add </v-icon>
                  </v-btn>
                  <small> {{ item.count }}</small>
                  <v-btn
                    v-if="Boolean(is_coordinator)"
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
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <v-card
                  elevation="0"
                  max-width="50"
                  class="mb-3 justify-center mr-14"
                  max-height="50"
                >
                  <v-img
                    class="size-img justify-center"
                    :src="$getImage(item.logo)"
                    height="auto"
                  />
                </v-card>
              </v-col>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <v-btn
                  v-if="Boolean(is_coordinator)"
                  @click="deleFromCard(index, item, 'package')"
                  x-small
                  text
                  class="justify-center"
                >
                  <v-icon small> delete </v-icon>
                </v-btn>
              </v-col>
              <v-col
                class="ma-0 pa-0 text-center"
                md="1"
                cols="4"
                v-if="Boolean(item.licence_break)"
              >
                <v-btn
                  color="teal"
                  small
                  outlined
                  @click="showDialog(index, item)"
                >
                  <small>
                    ویرایش پکیج
                    <v-icon small> auto_awesome_motion </v-icon>
                  </small>
                </v-btn>
              </v-col>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4" v-else>
                <v-btn
                  color="red darken-3"
                  small
                  outlined
                  @click="reqToLicense(item)"
                >
                  <small>
                    درخواست مجوز
                    <v-icon small> emoji_people </v-icon>
                  </small>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <!-- ----------------------------------------------------------------------------------------------------- -->

          <v-col
            v-if="load_list"
            v-for="i in 5"
            :key="i"
            class="ma-0 pa-0 text-center"
            md="12"
            cols="12"
          >
            <v-skeleton-loader v-bind="attrs" type="text"></v-skeleton-loader>
          </v-col>

          <div v-if="pckage_list_item.length == 0 && !load_list">
            <v-col cols="12" class="text-center">
              <v-icon large> production_quantity_limits </v-icon>
            </v-col>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-row class="d-flex justify-center mt-8">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="1">
        <amp-button
          block
          height="40"
          @click="backStep()"
          color="red darken-1 "
          class="ma-1"
          text=" برگشت"
        />
      </v-col>
      <v-col cols="1" v-if="Boolean(is_coordinator)">
        <amp-button
          block
          :disabled="loading"
          :loading="loading"
          height="40"
          @click="priceDialog"
          color="info darken-1 "
          class="ma-1"
          text="ادامه"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddProduct from "@/components/Product/AddProduct.vue";
import Payment from "@/components/User/Payment.vue";
import CoordinatorDialog from "@/components/CallCenter/CoordinatorDialog.vue";
import BrackDialog from "@/components/Product/Coordiantor/BrackDialog.vue";
import PriceDialog from "@/components/Product/Coordiantor/PriceDialog.vue";
import DeliveryInfo from "@/components/Product/DeliveryInfo.vue";
import GetLicenseDialog from "@/components/Product/Coordiantor/GetLicenseDialog.vue";

export default {
  components: {
    AddProduct,
    Payment,
    CoordinatorDialog,
    BrackDialog,
    PriceDialog,
    GetLicenseDialog,
    DeliveryInfo,
  },
  props: {
    itemsBasket: {
      type: Array,
      default: [],
    },
    basketPrice: {
      require: false,
      default: false,
    },
    deliveryInfo: {
      require: false,
      default: false,
    },
    basketId: {
      require: false,
      default: false,
    },
  },
  data: () => ({
    loading_factor:true,
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    valid: true,
    headers: [],
    loading_for_chagne_status: false,
    is_coordinator: false,
    form_change_step: {
      id: "",
      step: "",
      message: "",
      fiscal_manager_id: "",
    },
    headers_basket: [],
    item_basket: [],
    change_step: false,
    wallet_transactoin: {
      show: false,
      item: null,
    },
    btn_actions: [],
    pckage_list_item: [],
    question_form: [],
    baskets: [],
    root_body: "",
    list_basket: { items: [] },
    comment: "",
    username: "",
    payment_list: {
      show: false,
      item: null,
    },
    basket_price: {
      basket: 0,
      new_price: 0,
    },
    user_informations: {},
    product_id: "",
    dialog_add_product: { show: false, items: null },
    dialog_req_to_license: { show: false, items: null },
    basket_id: "",
    overlay: false,
    load_list: true,
    filters: {},
    steps: 1,
    e1: 1,
    package_id: "",
    step_index: 1,
    step: 1,
    step_basket: 1,
    loading: false,
    fical_messanger: [],
    show_product_package: [],
    show_history: false,
    header_history: [],
    root_body_history: {},
    coordinator_dialog: {
      itesm: null,
      show: false,
    },
    price_dialog: {
      itesm: null,
      show: false,
    },
    brack_dialog: {
      itesm: null,
      show: false,
    },
    history_basket_id: "",

    step_items: [],
    admin: [
      {
        text: "ارجاع به واحد مالی",
        value: "refer_fiscal_manager",
      },
    ],
    oper: [
      {
        text: "ارجاع به واحد مالی",
        value: "refer_fiscal_manager",
      },
    ],
    firac: [
      {
        text: "تایید واحد مالی",
        value: "accept_fiscal_manager",
      },
      {
        text: "عدم تایید واحد مالی",
        value: "reject_fiscal_manager",
      },
    ],
    form: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
    },
    cahgned_step: "",
    firacl_memebers: [],
  }),
  beforeMount() {
    if (this.$checkRole(this.$store.state.auth.role.coordinator_id)) {
      this.is_coordinator = true;
    }
    let admin = this.$store.state.auth.role.admin_id;
    let opr = this.$store.state.auth.role.oprator_id;
    let fac = this.$store.state.auth.role.fac_call_id;
    let roles = this.$store.state.auth.user.roles;
    roles.forEach((element) => {
      if (element.id == admin) {
        this.step_items = this.admin;
      }
      if (element.id == opr) {
        this.step_items = this.oper;
      }
      if (element.id == fac) {
        this.step_items = this.firac;
      }
    });
  },
  watch: {
    "payment_list.show"() {
      if (this.payment_list.show == false) {
        this.payment_list.item = null;
      }
    },
    change_step() {
      if (this.change_step == false) {
        this.cahgned_step = "";
        this.form_change_step = {
          id: "",
          step: "",
          message: "",
        };
      }
    },
  },
  mounted() {
    if (this.deliveryInfo) {
      let user_informations = JSON.parse(this.deliveryInfo);
      this.user_informations = user_informations;
    }

    this.createListBasket(this.itemsBasket);
    setTimeout(() => {
      this.loading_factor = false
    }, 500);
  },
  methods: {
    deleFromCard(key, item, key_name, brack) {
      this.load_list = true;
      let items = [];
      if (key_name == "product") {
        items = this.list_basket.items;
      } else {
        items = this.pckage_list_item;
      }
      items.splice(key, 1);
      if ((brack, Boolean(brack))) {
        this.$toast.success(`${item.name} با موفقیت شکسته شد `);
      } else {
      }

      this.load_list = false;
    },
    addNumber(item, add, key_name) {
      this.load_list = true;
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
      this.load_list = false;
    },

    saveBasket(discount) {
      this.loading = true;
      let form = {};
      let items = [];
      form["id"] = this.basketId;
      form["discount"] = discount;
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
      this.$reqApi("/basket/special-update", form)
        .then((response) => {
          this.$toast.success("سبد خرید با موفقیت به روز رسانی شد ");
          this.loading = false;
          this.$emit("refresh");
        })
        .catch((error) => {
          this.loading = false;
        });
    },
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
            : event.product.product.base_price,

          full_barcode: event.product.full_barcode,
          discount: event.product.discount,
          id: event.product.id,
          name: event.product.product.name,
          main_image: event.product.product.main_image,
        });
        this.$toast.success("محصول به سبد خرید اضافه شد");
      }
      this.loading = false;
    },
    backStep() {
      this.$emit("backStep");
    },
    createListPakage(event) {
      let access_roles = [];
      let access_users = [];
      let user_id = this.$store.state.auth.user.id;
      let access_barck = false;
      if (!Boolean(event.licence)) {
        access_roles =
          event.roles.length != 0 ? event.roles.map((x) => x.id) : [];
        access_users =
          event.users.length != 0 ? event.users.map((x) => x.id) : [];
        let login_user_role = this.$store.state.auth.user.roles;
        access_roles.forEach((id) => {
          login_user_role.forEach((element) => {
            if (id == element.id) {
              access_barck = true;
            }

            let have_access = access_users.find((f) => f == user_id);
            if (Boolean(have_access)) {
              access_barck = true;
            }
          });
        });
      } else {
        access_barck = true;
      }

      event["licence_break"] = access_barck;
      event["calculated"] = false;
      let ckek_dublicate = this.pckage_list_item.find((f) => event.id == f.id);
      if (Boolean(ckek_dublicate)) {
        this.$toast.error("پکیج قبلا اضافه شده");
      } else {
        this.pckage_list_item.push(event);
        this.$toast.success("پکیج به سبد اضافه شد");
      }
    },
    createListBasket(basket) {
      return new Promise((res, rej) => {
        for (let index = 0; index < basket.length; index++) {
          const x = basket[index];
          if (x.product_id && Boolean(x.product_id)) {
            this.list_basket.items.push({
              information: x.information,
              number: x.number,
              price: x.price,
              full_barcode: x.full_barcode,
              discount: x.discount,
              id: x.product_varcomb_id,
              name: x.product.name,
              main_image: x.product.main_image,
            });
          } else if (x.package_id && Boolean(x.package_id)) {
            let access_roles = [];
            let access_users = [];
            let user_id = this.$store.state.auth.user.id;
            let access_barck = false;
            if (!Boolean(x.package.licence_break)) {
              access_roles = x.package.roles
                ? x.package.roles.map((x) => x.id)
                : [];
              let login_user_role = this.$store.state.auth.user.roles;
              access_roles.forEach((id) => {
                login_user_role.forEach((element) => {
                  if (id == element.id) {
                    access_barck = true;
                  }
                });
              });
              access_users =
                x.package.users.length != 0
                  ? x.package.users.map((x) => x.id)
                  : [];
              let have_access = access_users.find((f) => f == user_id);
              if (Boolean(have_access)) {
                access_barck = true;
              }
            } else {
              access_barck = true;
            }
            this.pckage_list_item.push({
              count: x.number,
              calculated: true,
              discount_amount: x.package.discount_amount,
              id: x.package.id,
              logo: x.package.logo,
              name: x.information,
              licence_break: access_barck,
              prepay_amount: x.package.prepay_amount,
              price: x.price,
              weight: x.weight,
              discount_type: x.package.discount_type,
              product_varcoms: x.package.product_varcoms,
            });
          }
        }
        res(true);
      })
        .then((res) => {
          setTimeout(() => {
            this.load_list = false;
          }, 300);
        })
        .catch((rej) => {
          this.load_list = false;
        });
    },
    brackPackage(event) {
      this.load_list = true;
      event.forEach((element) => {
        element["add_from_package"] = true;
        this.checkDublicate(element);
      });
      this.deleFromCard(
        this.target_package.key,
        this.target_package.item,
        "package",
        true
      );
    },
    showDialog(key, item) {
      let info_target_package = {};
      info_target_package["key"] = key;
      info_target_package["item"] = item;
      this.brack_dialog.show = true;
      let products = [];
      item.product_varcoms.forEach((x) => {
        let var_1 = x.variation1
          ? x.variation1.variation_type.value + " " + x.variation1.value
          : "";
        let var_2 = x.variation2
          ? x.variation2.variation_type.value + " " + x.variation2.value
          : "";
        let var_3 = x.variation3
          ? x.variation3.variation_type.value + " " + x.variation3.value
          : "";
        products.push({
          information: var_1 + " , " + var_2 + " , " + var_3,
          number: x.count_product,
          price: x.price ? x.price : x.product.base_price,
          full_barcode: x.full_barcode,
          id: x.id,
          name: x.product.name,
          main_image: x.product.main_image,
        });
      });
      this.show_product_package = products;
      this.target_package = info_target_package;
    },
    priceDialog() {
      this.price_dialog.show = true;
      let new_price = 0;
      let product_price = 0;
      let package_price = 0;
      this.basket_price.basket = 0;
      this.basket_price.new_price = 0;
      if (this.list_basket.items.length > 0) {
        this.list_basket.items.forEach((x) => {
          product_price += x.price * x.number;
        });
      }

      if (this.pckage_list_item.length > 0) {
        this.pckage_list_item.forEach((x) => {
          let price = 0;
          if (!Boolean(x.calculated)) {
            if (x.discount_type == "amount") {
              price = (x.price - x.discount_amount) * x.count;
              package_price += price;
            } else if (x.discount_type == "percent") {
              price = (x.discount_amount / 100) * x.price * x.count;
              package_price += price;
            } else {
              price = x.price;
              package_price += price;
            }
          } else {
            price = x.price;
            package_price += price;
          }
        });
      }
      new_price = product_price + package_price;
      this.basket_price.basket = this.basketPrice;
      this.basket_price.new_price = new_price;
    },
    checkDublicate(data) {
      let check_dublicate_id = false;
      for (let i = 0; i < this.list_basket.items.length; i++) {
        if (this.list_basket.items[i].id == data.id) {
          check_dublicate_id = true;
          this.list_basket.items[i].number =
            parseInt(data.number) + parseInt(this.list_basket.items[i].number);
        }
      }
      if (!check_dublicate_id) {
        this.list_basket.items.unshift(data);
      }
    },
    reqToLicense(pack) {
      this.package_id = pack.id;
      this.dialog_req_to_license.show = true;
    },
  },
};
</script>

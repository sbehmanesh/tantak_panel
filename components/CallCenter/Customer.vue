<template>
  <div>
    <v-dialog
      persistent
      v-model="DialogCustomer.show"
      :model-id="DialogCustomer.items"
      fullscreen
    >
      <v-card>
        <v-card color="primary">
          <v-card-title>
            <span style="font-size: 21px" class="white--text">
              اطلاعات مشتری</span
            >
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog">
              <v-icon color="white" size="26"> cancel </v-icon>
            </v-btn>
          </v-card-title>

          <v-stepper v-model="step_index">
            <v-row class="justify-center mt-4">
              <v-stepper-step
                complete
                editable
                edit-icon="content_paste_search"
                step="1"
              >
                <span class="font_16"> سوابق خرید </span>
                <small class="pt-2">
                  خریدهای ثبت شده برای
                  {{ username }}
                </small>
              </v-stepper-step>
              <v-stepper-step complete editable edit-icon="comment" step="2">
                <span class="font_16">نظرات </span>
                <small class="pt-2">نظرات ثبت شده برای مشتری</small>
              </v-stepper-step>

              <v-stepper-step
                complete
                editable
                edit-icon="account_circle"
                step="3"
              >
                <span class="font_16"> تکمیل پروفایل </span>
                <small class="pt-2">
                  در صورت مغایرت اطلاعات ,اطلاعات را تکمیل کنید
                </small></v-stepper-step
              >
              <v-stepper-step
                complete
                editable
                edit-icon="account_circle"
                step="4"
              >
                <span class="font_16"> سفارشات </span>
                <small class="pt-2">
                  لیست سفارشات باز مشتری
                </small></v-stepper-step
              >
            </v-row>

            <v-row class="justify-center">
              <v-col cols="9">
                <v-divider />
                <v-divider />
              </v-col>
            </v-row>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-window v-model="step_basket">
                  <v-row class="d-flex justify-center">
                    <v-col cols="4" class="center-div">
                      <v-row
                        class="d-flex justify-center mt-3 py-3 grey lighten-3"
                      >
                        <span class="font_13">
                          شما فقط سبد خرید های با
                          <span class="font_14 primary--text"> وضعیت باز </span>

                          را میتوانید بروزرسانی کنید
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-window-item :value="1">
                    <v-col cols="12">
                      <BaseTable
                        url="basket/list-personnel"
                        :rootBody="root_body"
                        :headers="headers"
                        ref="itemsBasketList"
                        :BTNactions="item_basket"
                        :rowColor="rowColor"
                      />
                      <CoordinatorDialog
                        v-if="coordinator_dialog.show"
                        :coordinatorDialog="coordinator_dialog"
                        :bsaketId="basket_id"
                        @relod="refresh"
                      />
                    </v-col>
                  </v-window-item>

                  <v-window-item :value="2">
                    <v-row class="d-flex justify-center mt-5">
                      <v-col cols="12" md="4">
                        <DeliveryInfo :data="user_informations" />
                      </v-col>
                    </v-row>

                    <AddProduct
                      @add="addBasket($event)"
                      @createList="createListPakage($event)"
                      v-if="dialog_add_product.show"
                      :DialogAdd="dialog_add_product"
                    />

                    <v-col cols="12" class="mt-5">
                      <v-col
                        cols="12"
                        class="text-start"
                        v-if="show_update_btn"
                      >
                        <amp-button
                          icon="add_circle"
                          height="40"
                          @click="dialog_add_product.show = true"
                          color="orange darken-3"
                          text="افزودن محصول"
                        />
                      </v-col>
                      <v-row class="orange lighten-3 py-2 my-2 mt-5">
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
                        <v-col
                          v-if="show_update_btn"
                          class="ma-0 pa-0 text-center"
                          md="1"
                          cols="4"
                        >
                          <small> حذف </small>
                        </v-col>
                      </v-row>

                      <div
                        v-if="list_basket && list_basket.items && !load_list"
                      >
                        <v-col
                          cols="12"
                          md="12"
                          v-for="(item, index) in list_basket.items"
                          :key="index"
                        >
                          <v-row>
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> {{ item.name }}</small>
                            </v-col>

                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="3"
                              cols="4"
                            >
                              <small> {{ item.information }}</small>
                            </v-col>

                            <v-spacer> </v-spacer>
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <v-row class="d-flex justify-center mt-1">
                                <v-btn
                                  v-if="show_update_btn"
                                  @click="addNumber(item, true, 'product')"
                                  x-small
                                  text
                                >
                                  <v-icon small> add </v-icon>
                                </v-btn>
                                <small> {{ item.number }}</small>
                                <v-btn
                                  v-if="show_update_btn"
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
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> {{ item.full_barcode }}</small>
                            </v-col>

                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> {{ $price(item.price) }}</small>
                            </v-col>

                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small>
                                {{ $price(item.price * item.number) }}</small
                              >
                            </v-col>

                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center pr-13"
                              md="1"
                              cols="4"
                            >
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

                            <v-col
                              v-if="show_update_btn"
                              class="ma-0 pa-0 text-center pr-3"
                              md="1"
                              cols="4"
                            >
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
                          <v-divider></v-divider>
                        </v-col>
                      </div>
                      <v-col
                        v-if="load_list"
                        v-for="i in 5"
                        :key="i"
                        class="ma-0 pa-0 text-center"
                        md="12"
                        cols="12"
                      >
                        <v-skeleton-loader
                          v-bind="attrs"
                          type="text"
                        ></v-skeleton-loader>
                      </v-col>

                      <div class="mt-6">
                        <v-col cols="12">
                          <amp-section text="پکیج های ثبت شده" />
                        </v-col>
                        <v-col cols="12">
                          <v-row
                            class="py-2 mb-2 d-flex justify-center orange lighten-3"
                          >
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> نام پکیج</small>
                            </v-col>
                            <v-spacer />

                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> قیمت پکیج (ریال)</small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> تعداد</small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> تخفیف</small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> پیش پرداخت </small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> مجموع قیمت</small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small>تصویر</small>
                            </v-col>
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> حذف </small>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col
                          v-if="
                            pckage_list_item &&
                            pckage_list_item.length != 0 &&
                            !load_list
                          "
                          v-for="(item, index) in pckage_list_item"
                          :key="index"
                          cols="12"
                        >
                          <v-row class="d-flex justify-center">
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small>
                                {{ index + 1 }} -
                                {{ item.name }}
                              </small>
                            </v-col>
                            <v-spacer />

                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> {{ $price(item.price) }}</small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <v-row class="d-flex justify-center mt-1">
                                <v-btn
                                  v-if="show_update_btn"
                                  @click="addNumber(item, true, 'package')"
                                  x-small
                                  text
                                >
                                  <v-icon small> add </v-icon>
                                </v-btn>
                                <small> {{ item.count }}</small>
                                <v-btn
                                  v-if="show_update_btn"
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
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small>
                                {{ $price(item.discount_amount) }}
                              </small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small> {{ $price(item.prepay_amount) }}</small>
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
                              <small>
                                {{ $price(item.price * item.count) }}</small
                              >
                            </v-col>
                            <v-spacer />
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
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
                            <v-col
                              class="ma-0 pa-0 text-center"
                              md="1"
                              cols="4"
                            >
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

                        <!-- ----------------------------------------------------------------------------------------------------- -->

                        <div v-if="pckage_list_item.length == 0 && !load_list">
                          <v-col cols="12" class="text-center">
                            <v-icon large> production_quantity_limits </v-icon>
                          </v-col>
                        </div>
                      </div>
                    </v-col>
                    <v-row class="d-flex justify-center mt-5">
                      <v-col cols="2">
                        <amp-button
                          block
                          height="40"
                          @click="step_basket--"
                          color="red darken-1 "
                          class="ma-1"
                          :text="disabl_update ? 'برگشت' : 'انصراف'"
                        />
                      </v-col>
                      <v-col cols="2" v-if="show_update_btn">
                        <amp-button
                          block
                          :disabled="loading || disabl_update"
                          :loading="loading"
                          height="40"
                          @click="updateBasket"
                          color="info darken-1 "
                          class="ma-1"
                          text="بروزرسانی"
                        />
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <v-col cols="12">
                      <BaseTable
                        url="user-comment"
                        :rootBody="root_body"
                        :headers="header_comments"
                        :BTNactions="btn_actions"
                      />
                    </v-col>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-col
                      cols="12"
                      v-for="(item, index) in question_form"
                      :key="index"
                    >
                      <v-row>
                        <v-col cols="6" class="mr-2">
                          <h1 class="black--text font_13">
                            {{ index + 1 }} -
                            {{ item.question }}
                          </h1>

                          <small class="black--text mr-5">
                            {{ item.answer }}
                          </small>
                        </v-col>
                      </v-row>
                      <v-divider class="grey mt-2 lighten-3"></v-divider>
                    </v-col>
                    <v-row class="d-flex justify-center mt-4">
                      <v-col cols="3">
                        <amp-button
                          block
                          height="40"
                          @click="step--"
                          color="red darken-1 "
                          class="ma-1"
                          text="برگشت"
                        />
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-row class="d-flex justify-center">
                  <v-col md="9" cols="12" clss="center-div">
                    <v-row class="d-flex justify-center">
                      <v-col md="4" cols="12">
                        <amp-input text="نام مشتری" v-model="form.first_name" />
                      </v-col>
                      <v-col md="4" cols="12">
                        <amp-input
                          v-model="form.last_name"
                          text=" نام خانوادگی"
                        />
                      </v-col>
                      <v-col md="4" cols="12">
                        <amp-input
                          v-model="form.email"
                          text="آدرس الکترونیکی"
                          rules="email"
                        />
                      </v-col>
                      <v-col md="12" cols="12">
                        <amp-textarea
                          text="آدرس"
                          v-model="form.address"
                        ></amp-textarea>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="d-flex justify-center mb-4">
                  <amp-button
                    text="تایید"
                    @click="profileCustomer()"
                    icon="done"
                    class="ma-1"
                    :disabled="loading"
                    :loading="loading"
                  ></amp-button>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="4">
                <BaseTable
                  url="basket/list-personnel"
                  :rootBody="root_body"
                  :headers="headers_basket"
                  :filters="filters"
                  ref="listPersonal"
                />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-card>
      <v-dialog v-model="payment_list.show">
        <v-card class="primary lighten-3">
          <v-card-title>
            <v-btn icon color="error" @click="payment_list.show = false"
              ><v-icon>close</v-icon></v-btn
            >
          </v-card-title>
          <Payment
            v-if="payment_list.show"
            :model-id="payment_list.item"
            :userChangeStatus="true"
          />
        </v-card>
      </v-dialog>
    </v-dialog>
    <v-dialog v-model="show_history">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span> تاریخچه ارجاعات </span>
          <v-btn icon color="error" @click="show_history = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <BaseTable
            url="basket/referral-history"
            :rootBody="root_body_history"
            :headers="header_history"
            :BTNactions="log_btns"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="wallet_transactoin.show">
      <v-card class="white pa-3">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>تاریخچه کیف پول</span>
          <v-btn icon color="error" @click="wallet_transactoin.show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text clsas="pa-5">
          <v-row>
            <v-col cols="12" md="12"> </v-col>
            <v-col cols="12" md="12" class="pa-8">
              <template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">تاریخ پرداخت</th>
                        <th class="text-center">مبلغ</th>
                        <th class="text-center">نوع پرداخت</th>
                        <th class="text-center">توضیحات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in wallet_transactoin.item"
                        :key="index"
                      >
                        <td dir="ltr">{{ $toJalali(item.created_at) }}</td>
                        <td><small>ریال</small>{{ $price(item.amount) }}</td>
                        <td>{{ item.type == "remove" ? "کاهش" : "افزایش" }}</td>
                        <td>{{ item.description }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <RefralDialog
      :refralDialog="refral_basket"
      v-if="refral_basket.show"
      :basketId="ref_basket_id"
      :stepOrder="step_order"
      @relod="refresh"
    />
  </div>
</template>

<script>
import AddProduct from "@/components/Product/AddProduct.vue";
import Payment from "@/components/User/Payment.vue";
import CoordinatorDialog from "@/components/CallCenter/CoordinatorDialog.vue";
import RefralDialog from "@/components/CallCenter/RefralDialog.vue";
import DeliveryInfo from "@/components/Product/DeliveryInfo.vue";

export default {
  components: {
    AddProduct,
    Payment,
    CoordinatorDialog,
    RefralDialog,
    DeliveryInfo,
  },
  props: {
    DialogCustomer: {
      require: false,
      default: false,
    },
    customer: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    valid: true,
    headers: [],
    log_btns: [],
    loading_for_chagne_status: false,

    headers_basket: [],
    item_basket: [],
    wallet_transactoin: {
      show: false,
      item: null,
    },
    btn_actions: [],
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

    product_id: "",
    pckage_list_item: [],
    dialog_add_product: { show: false, items: null },
    refral_basket: { show: false, items: null },
    basket_id: "",
    ref_basket_id: "",
    step_order: "",
    overlay: false,
    disabl_update: true,
    filters: {},
    steps: 1,
    e1: 1,
    user_informations: {},
    step_index: 1,
    step: 1,
    step_basket: 1,
    loading: false,
    fical_messanger: [],
    show_update_btn: false,
    show_history: false,
    load_list: false,
    header_history: [],
    root_body_history: {},
    coordinator_dialog: {
      itesm: null,
      show: false,
    },
    history_basket_id: "",
    step_status: [
      { text: "ثبت اولیه", value: "init" },
      { text: "بسته شده", value: "reject" },
      { text: "ارجاع به مدیر واحد مالی", value: "refer_fiscal_manager" },
      { text: "یرگشت از مدیر واحد مالی", value: "reject_fiscal_manager" },
      {
        text: "ارجاع از مدیر واحد مالی به سرپرست",
        value: "manager_supervisor_fiscal",
      },
      {
        text: "برگشت از سرپرست به مدیر واحد مالی",
        value: "supervisor_manager_fiscal",
      },
      { text: "ارجاع از سرپرست به واحد مالی", value: "supervisor_to_fiscal" },
      { text: "برگشت از واحد مالی به سرپرست", value: "fiscal_to_supervisor" },
      { text: "تایید واحد مالی", value: "accept_fiscal" },
      {
        text: "ارجاع به مدیر هماهنگ کننده",
        value: "admin_manager_coordinator",
      },
      {
        text: "برگشت از مدیر هماهنگ کننده به ادمین",
        value: "manager_admin_coordinator",
      },
      {
        text: "ارجاع مدیر به سرپرست هماهنگ کننده",
        value: "manager_supervisor_coordinator",
      },
      {
        text: "برگشت سرپرست به مدیر هماهنگ کننده",
        value: "supervisor_manager_coordinator",
      },
      {
        text: "ارجاع سرپرست هماهنگ کننده به هماهنگ کننده",
        value: "supervisor_to_coordinator",
      },
      {
        text: "برگشت از هماهنگ کننده به سرپرست",
        value: "coordinator_to_supervisor",
      },

      {
        text: "تایید واحد هماهنگی",
        value: "accept_coordinator",
      },
      {
        text: "ادمین به مدیر هماهنگی ارسال ",
        value: "admin_manager_send",
      },
      {
        text: "مدیر هماهنگی به ادمین",
        value: "manager_admin_send",
      },
      {
        text: "مدیر به سرپرست هماهنگی ارسال",
        value: "manager_supervisor_send",
      },
      {
        text: "سرپست به مدیر هماهنگی ارسال ",
        value: "supervisor_manager_send",
      },
      {
        text: "سرپرست به هماهنگی ارسال",
        value: "supervisor_to_send",
      },
      {
        text: " هماهنگی ارسال به سرپرست",
        value: "send_to_supervisor",
      },
      {
        text: "ارجاع به نمایندگی",
        value: "send_to_agency",
      },
      {
        text: "برگشت به هماهنگ کننده ارسال",
        value: "agency_to_send",
      },
      {
        text: "agency_to_stockclerk",
        value: "ارجاع از نمایندگی به انبار دار",
      },
      {
        text: "برگشت از انبار دار به نمایندگی",
        value: "stockclerk_to_agency",
      },
      {
        text: "کارمند به انبار دار",
        value: "employee_to_stockclerk",
      },
      {
        text: "stockclerk_to_employee",
        value: "ارجاع انبار دار به کارمند نمایندگی",
      },
      {
        text: "ارجاع کارمند به پیک",
        value: "employee_to_courier",
      },
      {
        text: "ارجاع از پیک به کارمند",
        value: "courier_to_employee",
      },
      {
        text: "تحویل داده شده",
        value: "done",
      },
    ],
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
    this.root_body = { user_id: this.customer.id };
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
    this.log_btns = [
      {
        text: "مشاهده فایل",
        icon: "attach_file",
        color: "info darken-2",
        fun: (body) => {
          window.open(this.$getImage(body.file));
        },
        show_fun: (body) => {
          if (body.file) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "پاسخ های داده شده",
        icon: "chat",
        color: "info darken-2",
        fun: (body) => {
          this.step++;
          this.loadQusestions(body.answers);
        },
      },
    ];
    this.item_basket = [
      {
        color: "success",
        icon: "list",
        text: "لیست پرداختی ها",
        fun: (body) => {
          if (body.id) {
            this.payment_list.show = true;
            this.payment_list.item = body.id;
          }
        },
      },
      {
        text: "تاریخچه کیف پول",
        icon: "account_balance_wallet",
        color: "success darken-2",
        fun: (body) => {
          if (body.wallet_transactions.length > 0) {
            this.wallet_transactoin.show = true;
            this.wallet_transactoin.item = body.wallet_transactions;
          }
        },
        show_fun: (body) => {
          if (body.wallet_transactions.length > 0) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        color: "primary",
        icon: "list",
        text: "تاریخچه ارجاعات",
        fun: (body) => {
          if (body.id) {
            this.history_basket_id = body.id;
            this.show_history = true;
            this.root_body_history = { basket_id: body.id };
          }
        },
      },
      {
        color: "orange",
        icon: "change_circle",
        text: "برسی سفارش",
        fun: (body) => {
          if (body.id) {
            this.refral_basket.show = true;
            this.ref_basket_id = body.id;
            this.step_order = body.step;
          }
        },
        show_fun: (body) => {
          if (body.step) {
            if (body.status == "waiting" || body.status == "payed") {
              if (
                body.step == "init" ||
                body.step == "reject_fiscal_manager" ||
                body.step == "manager_admin_coordinator" ||
                body.step == "accept_coordinator"||
                body.step == "manager_admin_send"
              ) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }else{
            return false
          }
        },
      },
      {
        color: "orange",
        icon: "change_circle",
        text: "برسی سفارش",
        fun: (body) => {
          this.coordinator_dialog.show = true;
          this.basket_id = body.id;
        },
        show_fun: (body) => {
          if (body.step == "accept_fiscal") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "موجودی سبد خرید",
        icon: "shopping_basket",
        color: "info darken-2",
        fun: (body) => {
          this.step_basket++;
          this.product_id = body.id;
          if (Boolean(body.delivery_info)) {
            let info = JSON.parse(body.delivery_info);
            this.user_informations = info;
          }

          this.loadListBAskets(body.id);
          if (body.status == "open") {
            this.show_update_btn = true;
          } else {
            this.show_update_btn = false;
          }
        },
      },
    ];
    this.filters = {
      status: {
        op: "=",
        value: "open",
      },
    };
    this.baskets = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      {
        text: "نام محصول",
        value: (body) => {
          if (body.product) {
            if (body.product.name) {
              return body.product.name;
            }
          }
        },
      },
      {
        text: "مشخصات محصول  ",

        value: "information",
      },
      {
        text: "قیمت محصول (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "تعداد محصول",
        value: "number",
      },
      {
        text: "جمع کل (ریال)",
        type: "price",
        value: (body) => {
          return body.price * body.number;
        },
      },

      {
        text: "بارکد",

        value: "full_barcode",
      },
    ];
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "وضعیت  سبد خرید",
        value: "status",
        filterType: "select",
        items: [
          {
            text: "پرداخت شده",
            value: "payed",
          },
          {
            text: "باز ",
            value: "open",
          },
          {
            text: "در انتظار",
            value: "waiting",
          },

          {
            text: "تکمیل شده ",
            value: "completed",
          },
          {
            text: "کنسل شده",
            value: "canceled",
          },
          {
            text: "ترکیبی ",
            value: "mixture",
          },
          {
            text: "منتظر تایید تخفیف ",
            value: "wait_discount",
          },
        ],
      },
      {
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.step_status,
      },

      {
        text: "قیمت (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "تخفیف (ریال)",
        type: "price",
        value: "products_discount",
      },
      {
        text: "وضعیت  انبار",
        filterType: "select",
        value: "status_stock",
        items: [
          { text: "منتظر برداشت", value: "wait" },
          { text: "برداشت انجام شده", value: "done" },
          { text: "کنسل شده", value: "reject" },
        ],
      },
      {
        text: "شماره فاکتور",

        value: "factor_number",
      },
    ];
    this.header_history = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "پیام",
        value: "message",
      },
      {
        text: "نوع ارجاع",
        value: "text",
      },
      {
        text: "ارجاع دهنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.sender) {
            return `<span class='success--text mx-2'>${body.sender.first_name} ${body.sender.last_name} | ${body.sender.username}</span>`;
          }
        },
      },
      {
        text: "گیرنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.geter) {
            return `<span class='info--text mx-2'>${body.geter.first_name} ${body.geter.last_name} | ${body.geter.username}</span>`;
          } else {
            return "ندارد";
          }
        },
      },
    ];
    this.header_comments = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "ثبت کننده",
        value: (body) => {
          if (body.personnel) {
            if (body.personnel.first_name && body.personnel.last_name) {
              return body.personnel.first_name + " " + body.personnel.last_name;
            } else {
              return body.personnel.username;
            }
          }
        },
      },
      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "توضیحات",
        filterCol: "comment",
        type: "tooltip",
        function: (body) => {
          if (body.comment) {
            return body.comment;
          }
        },
        value: (body) => {
          if (typeof body.comment == "string") {
            if (body.comment.length < 25) {
              return body.comment;
            }
            return body.comment.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.headers_basket = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "قیمت (ریال)",
        type: "price",
        value: "price",
      },
      {
        text: "تخفیف (ریال)",
        type: "price",
        value: "products_discount",
      },
      {
        text: "شماره فاکتور",

        value: "factor_number",
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      // {
      //   text: "شماره همراه مشتری",
      //   value: (body) => {
      //     if (body.user) {
      //       if (body.user.username) {
      //         let start = body.user.username.slice(0, 3);
      //         let end = body.user.username.slice(-4);
      //         let phone_number = end + "****" + start;
      //         return phone_number;
      //       }
      //     }
      //   },
      // },
      // {
      //   text: "توضیحات",
      //   filterCol: "comment",
      //   type: "tooltip",
      //   function: (body) => {
      //     if (body.comment) {
      //       return body.comment;
      //     }
      //   },
      //   value: (body) => {
      //     if (typeof body.comment == "string") {
      //       if (body.comment.length < 25) {
      //         return body.comment;
      //       }
      //       return body.comment.slice(0, 25) + "...";
      //     } else {
      //       return "-";
      //     }
      //   },
      // },
    ];

    if (this.customer.username) {
      this.phoneNumber(this.customer.username);
    }
  },
  watch: {
    step_basket() {
      this.disabl_update = true;
    },
    "payment_list.show"() {
      if (this.payment_list.show == false) {
        this.payment_list.item = null;
      }
    },
  },
  mounted() {
    this.loadProfile();
    this.loadFiscal();
  },
  methods: {
    refresh() {
      this.$refs.itemsBasketList.getDataFromApi();
    },
    rowColor(body) {
      if (body.item.step == "accept_fiscal_manager") {
        return "teal lighten-4";
      }
    },
    profileCustomer() {
      this.loading = true;
      let form = { ...this.form };
      form["id"] = this.customer.id;
      let url = "/user/profile";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("اطلاعات مشتری با موفقیت ویرایش شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadProfile() {
      this.loading = true;
      let url = "/user/profile";
      this.$reqApi(url, { id: this.customer.id })
        .then((res) => {
          this.loading = false;
          for (let key in res.user) {
            this.form[key] = res.user[key];
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.DialogCustomer.show = false;
      this.DialogCustomer.items = null;
    },
    createListPakage(event) {
      let ckek_dublicate = this.pckage_list_item.find((f) => event.id == f.id);
      if (Boolean(ckek_dublicate)) {
        this.$toast.error("پکیج قبلا اضافه شده");
      } else {
        this.pckage_list_item.push(event);
        this.disabl_update = false;
      }
    },
    relod() {
      this.$emit("relod");
    },
    loadFiscal() {
      this.$reqApi("/user/fiscal-manager", { row_number: 300 })
        .then((res) => {
          let user = [];
          let data = res.model.data;
          data.map((x) => {
            user.push({
              text: `${x.first_name} ${x.last_name} | ${x.username}`,
              value: x.id,
            });
          });
          this.firacl_memebers = user;
        })
        .catch((err) => {
          return err;
        });
    },
    phoneNumber(username) {
      let start = username.slice(0, 3);
      let end = username.slice(-4);

      let phone_number = end + "****" + start;
      let name = this.customer.first_name
        ? this.customer.first_name + " " + this.customer.last_name
        : phone_number;
      this.username = name;
    },

    loadQusestions(answers) {
      // --------------------------
      this.loading = true;
      let ids = [];
      ids = JSON.parse(answers);
      this.$reqApi(`comment-question`)
        .then((res) => {
          let questions = [];
          for (let index = 0; index < res.model.data.length; index++) {
            const x = res.model.data[index];

            x.answers.map((y) => {
              questions.push({
                title: x.question,
                answer: y.answer,
                id: y.id,
              });
            });
          }
          this.loading = false;
          this.ctrateFormQuestions(ids, questions);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    ctrateFormQuestions(ids, questions) {
      let items = [];
      for (let index = 0; index < questions.length; index++) {
        const element = questions[index];
        ids.map((x) => {
          if (x == element.id) {
            items.push({
              question: element.title,
              answer: element.answer,
            });
          }
        });
      }
      this.question_form = items;
    },
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
      this.disabl_update = false;
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
      this.disabl_update = false;
    },
    loadListBAskets(id) {
      this.load_list = true;
      this.list_basket.items = [];
      this.$reqApi("basket-item", { basket_id: id })
        .then((response) => {
          let products = response.model.data.filter(
            (x) => x.product_id && Boolean(x.product_id)
          );
          let packages = response.model.data.filter(
            (x) => x.package_id && Boolean(x.package_id)
          );
          if (Boolean(products) && products.length > 0) {
            for (let index = 0; index < products.length; index++) {
              const x = products[index];
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
            }
          }
          if (Boolean(packages) && packages.length > 0) {
            for (let index = 0; index < packages.length; index++) {
              const x = packages[index];
              this.pckage_list_item.push({
                count: x.number,
                discount_amount: x.package.discount_amount,
                id: x.package_id,
                logo: x.package.logo,
                name: x.information,
                prepay_amount: x.package.prepay_amount,
                price: x.package.price,
                weight: x.package.weight,
                product_varcoms: x.package.product_varcoms,
              });
            }
          }

          this.load_list = false;
        })
        .catch((error) => {
          this.load_list = false;
        });
      // this.list_basket.items.unshift({
      //     information:
      //       event.product.variation1.variation_type.value +
      //       " " +
      //       event.product.variation1.value +
      //       " - " +
      //       event.product.variation2.variation_type.value +
      //       " " +
      //       event.product.variation2.value +
      //       " - " +
      //       event.product.variation3.variation_type.value +
      //       " " +
      //       event.product.variation3.value,
      //     number: event.number,
      //     price: event.product.price
      //       ? event.product.price
      //       : event.product.variation1.product.base_price,

      //     full_barcode: event.product.full_barcode,
      //     discount: event.product.discount,
      //     id: event.product.id,
      //     name: event.product.variation1.product.name,
      //     main_image: event.product.variation1.product.main_image,
      //   });
    },
    updateBasket() {
      this.loading = true;
      let form = {};
      let items = [];
      let package_ids = [];

      form["id"] = this.product_id;
      if (this.list_basket.items.length > 0) {
        for (let index = 0; index < this.list_basket.items.length; index++) {
          const x = this.list_basket.items[index];
          items.push({
            number: x.number,
            product_varcomb_id: x.id,
          });
        }
      }
      if (this.pckage_list_item.length > 0) {
        for (let index = 0; index < this.pckage_list_item.length; index++) {
          const y = this.pckage_list_item[index];
          package_ids.push({
            id: y.id,
            count: y.count,
          });
        }
      }

      form["package_ids"] = package_ids;
      form["array_items"] = items;
      this.$reqApi("basket/update", form)
        .then((response) => {
          this.$toast.success("سبد خرید با موفقیت ویراش سبد");
          this.$emit("basket_costumer_id", response);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
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
            : event.product.variation1.product.base_price,

          full_barcode: event.product.full_barcode,
          discount: event.product.discount,
          id: event.product.id,
          name: event.product.variation1.product.name,
          main_image: event.product.variation1.product.main_image,
        });
        this.$toast.success("محصول به سبد خرید اضافه شد");
      }
      this.disabl_update = false;
      this.loading = false;
    },
  },
};
</script>

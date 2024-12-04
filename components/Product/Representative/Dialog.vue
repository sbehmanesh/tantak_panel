<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title class="primary mb-10">
          <span class="font_20 white--text">موجودی انبار</span>
          <v-spacer></v-spacer>
          <v-icon color="white" @click="closeDialog"> close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row class="d-flex justify-center">
                <v-col cols="12" md="6">
                  <v-expansion-panels
                    v-model="panel"
                    class="card-style elevation-0"
                    focusable
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header expand-icon="add_circle">
                        <span class="font_18">
                          تعریف موجودی
                          <small v-if="update">
                            *** ( {{ set_title_card }} )
                          </small>
                        </span>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content>
                        <!-- <v-col cols="12">
                          <v-row cols="12" class="mt-3 justify-center">
                            <v-chip
                              :disabled="update"
                              dark
                              label
                              class="ma-2"
                              color="grey darken-1"
                              v-for="item in items"
                              :key="item.key"
                              @click="tab = item.key"
                              :outlined="tab != item.key"
                            >
                              <span class="font_16">
                                {{ item.text }}
                              </span>
                              <v-icon class="mr-1">
                                {{ item.icon }}
                              </v-icon>
                            </v-chip>
                          </v-row>
                        </v-col> -->
                        <v-form
                          v-model="valid"
                          @submit.prevent="submit()"
                          class="mt-4 pa-5"
                          v-if="!loading"
                        >
                          <Products
                            @validVariations="continue_form = $event"
                            v-if="!update && tab == 'products'"
                            @section="setSections($event)"
                            :productInfo="product"
                            :response="response"
                            :clear_vaue="continue_form"
                          />
                          <!-- <Packages
                            @validVariations="continue_form = $event"
                            v-if="!update && tab == 'packages'"
                            @section="setSections($event)"
                            :productInfo="product"
                            :response="response"
                            :clear_vaue="continue_form"
                          /> -->
                          <v-row v-if="check_continue">
                            <v-col cols="12" md="4">
                              <amp-input
                                text="موجودی"
                                Cclass="ltr-item"
                                rules="require,number"
                                v-model="skock"
                              />
                            </v-col>
                            <v-col cols="6" md="2">
                              <amp-button
                                block
                                height="40"
                                text="افزودن"
                                color="green darken-1"
                                @click="addToList()"
                                :loading="loading"
                                :disabled="
                                  !Boolean(check_continue) || !valid || loading
                                "
                              />
                            </v-col>
                          </v-row>
                        </v-form>
                        <div class="text-center my-10" v-else>
                          <v-progress-circular
                            :size="30"
                            :width="4"
                            indeterminate
                            color="grey"
                          />
                        </div>
                        <v-col
                          cols="12"
                          v-for="(x, i) in products_list"
                          :key="i"
                        >
                          <v-card
                            class="elevation-1 pa-3 d-flex align-center"
                            outlined
                          >
                            <v-avatar size="45" class="mx-2">
                              <img
                                :src="
                                  $getImage(
                                    x.product.variation1.product.main_image
                                  )
                                "
                              />
                            </v-avatar>
                            <h1>
                              {{ x.product.variation1.product.name }}
                              <br />
                              <small
                                class="grey--text"
                                v-if="Boolean(x.product.variation1.colors)"
                              >
                                {{ x.product.variation1.variation_type.value }}
                                {{ x.product.variation1.colors }}
                              </small>
                              <small class="grey--text" v-else>
                                {{ x.product.variation1.variation_type.value }}
                                {{ x.product.variation1.value }}
                              </small>
                              <small class="mx-1 grey--text">
                                {{ x.product.variation2.variation_type.value }}
                                {{ x.product.variation2.value }}
                              </small>
                              <small class="mx-1 grey--text">
                                {{ x.product.variation3.variation_type.value }}
                                {{ x.product.variation3.value }}
                              </small>
                            </h1>
                            <v-spacer></v-spacer>
                            <amp-input
                              class="mt-6"
                              v-model="x.skock"
                              cClass="ltr-item"
                              rules="require,number"
                            />
                            <v-spacer></v-spacer>
                            <v-btn text icon @click="deletFromCard(x)">
                              <v-icon> delete </v-icon>
                            </v-btn>
                          </v-card>
                        </v-col>
                        <v-row class="d-flex justify-center mt-5">
                          <v-col cols="6" md="2">
                            <amp-button
                              block
                              height="40"
                              text="تایید"
                              color="green darken-1"
                              @click="submit"
                              :loading="loading"
                              :disabled="products_list.length == 0"
                            />
                          </v-col>
                          <v-col cols="6" md="2">
                            <amp-button
                              block
                              height="40"
                              text="انصراف"
                              color="red darken-1"
                              @click="canceld"
                            />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>

              <BaseTable
                ref="Refresh"
                url="/sale-agency-stock"
                :headers="headers"
                :root-body="root_body"
                :extraBtn="extra_btn"
                autoDelete="sale-agency-stock/delete"
                :actionsList="actions_list"
                :BTNactions="btn_actions"
              />
              <RotationValue
                :dialog="rotation"
                @reload="refresh"
                v-if="rotation"
                :sale-agency-id="$store.state.auth.user.sale_agenciy_id"
                @closeDialog="rotation = false"
              />
            </v-window-item>

            <v-window-item :value="2">
              <History
                :branchId="$store.state.auth.user.sale_agenciy_id"
                v-if="show_history && step == 2"
                :productVarId="product_var_id"
                :productVarInfo="send_prop"
                :sectionId="section_id"
                @backStep="step--"
              />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import Packages from "@/components/Product/Representative/AddToBasket/Packages.vue";
import Products from "@/components/Product/Representative/AddToBasket/Products.vue";
import History from "@/components/Product/Representative/History.vue";
import RotationValue from "@/components/Product/Representative/RotationValue.vue";

export default {
  components: {
    Products,
    Packages,
    History,
    RotationValue,
  },
  props: {
    branchId: {
      require: false,
      default: false,
    },
    dialog: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      tab: "products",
      items: [
        { text: "محصول", key: "products", icon: "local_mall" },
        { text: "پکیج ", key: "packages", icon: "bento" },
      ],
      panel: 1,
      step: 1,
      continue_form: false,
      show_history: false,
      rotation: false,
      loading: false,
      actions_list: [],
      response: [],
      extra_btn: [],
      headers: [],
      btn_actions: [],
      product: { product_id: "" },
      root_body: "",
      send_prop: "",
      url: "",
      product_var_id: "",
      set_title_card: "",
      section_id: "",
      valid: true,
      update: false,
      form: {
        skock: "",
        description: "",
        save_skock: "",
        sale_agency_id: "",
        section_id: "",
        section_name: "",
      },
    };
  },
  computed: {
    check_continue() {
      let check = false;
      if (Boolean(this.update)) {
        check = true;
      } else if (Boolean(!this.update) && Boolean(this.continue_form)) {
        check = true;
      }
      return check;
    },
  },
  watch: {
    tab() {
      this.continue_form = false;
    },
  },
  mounted() {
    this.root_body = { sale_agency_id: this.branchId };
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
        text: "نوع ",
        value: (body) => {
          if (body.section_name == "ProductVariationCombination") {
            return "محصول";
          } else {
            return "پکیج";
          }
        },
      },
      {
        text: "اطلاعات",
        filtrabel: false,
        value: (body) => {
          let text = "";
          let product_name = "";
          let var_1 = "";
          let var_2 = "";
          let var_3 = "";

          if (body.section_name == "ProductVariationCombination") {
            if (body.product_var && body.product_var.product) {
              product_name = body.product_var.product.name;
            }
            if (body.product_var.variation1) {
              var_1 = Boolean(body.product_var.variation1.colors)
                ? body.product_var.variation1.colors
                : body.product_var.variation1.value;
            }
            if (body.product_var.variation2) {
              var_2 = body.product_var.variation2.value;
            }
            if (body.product_var.variation3) {
              var_3 = body.product_var.variation3.value;
            }
            text = `${product_name}  ( ${var_1} - ${var_2} - ${var_3} )`;
            return text;
          } else if (body.section_name == "Package") {
            return body.package.name;
          }
          {
          }
        },
      },
      {
        text: "موجودی",
        filterable: false,
        value: (body) => {
          let items = [];
          items.push(
            `<span class="teal--text font_11"> موجودی  : ${body.skock.toLocaleString()} </span>`
          );

          items.push(
            `<span class="primary--text font_11">موجودی  انبار   : ${body.save_skock.toLocaleString()} </span>`
          );
          return items.join("<br>");
        },
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
    ];
    this.actions_list = [
      {
        text: "بروزرسانی",
        fun: (body) => {
          if (body.section_name == "ProductVariationCombination") {
            this.tab = "products";
          } else if (body.section_name == "Package") {
            this.tab = "packages";
          }
          this.loadData(body.id);
        },
      },
    ];
    this.btn_actions = [
      {
        text: "تاریخچه انبار",
        icon: "history",
        color: "red",
        fun: (body) => {
          this.step++;
          this.show_history = true;
          this.product_var_id = body.product_var_id;
          let text = "";
          let product_name = "";
          let var_1 = "";
          let var_2 = "";
          let var_3 = "";
          if (body.section_name == "ProductVariationCombination") {
            if (body.product_var && body.product_var.product) {
              product_name = body.product_var.product.name;
            }
            if (body.product_var.variation1) {
              var_1 = body.product_var.variation1.codes
                ? body.product_var.variation1.colors
                : body.product_var.variation1.value;
            }
            if (body.product_var.variation2) {
              var_2 = body.product_var.variation2.value;
            }
            if (body.product_var.variation3) {
              var_3 = body.product_var.variation3.value;
            }
            text = `${product_name}  ( ${var_1} - ${var_2} - ${var_3} )`;
            this.send_prop = text;
          } else if (body.section_name == "Package") {
            this.send_prop = body.package.name;
          }
          this.section_id = body.section_id;
        },
      },
    ];
    this.extra_btn = [
      {
        text: "بروزرسانی با اکسل",
        icon: "sync",
        color: "teal darken-2",
        fun: () => {
          this.rotation = true;
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.sale_agency_id = this.$store.state.auth.user.sale_agenciy_id;
      let url = this.update ? "sale-agency-stock/update" : "sale-agency-stock/insert";
      this.$reqApi(url, form)
        .then((response) => {
          this.step == 1;
          this.$toast.success("عملیات با موفقیت انجام شده و درخواست شما با موفقیت ثبت شد");
          this.loading = false;
          this.update = false;
          this.$refs.Refresh.getDataFromApi();
          this.canceld();
        })
        .catch((err) => {
          this.loading = false;
          this.update = false;
          this.canceld();
          this.continue_form = false;
        });
    },
    canceld() {
      this.url = "sale-agency-stock/insert";
      this.form.description = "";
      this.form.product_var_id = "";
      this.form.save_skock = "";
      this.form.skock = "";
      this.panel = 1;
      this.update = false;
      this.continue_form = false;
    },
    loadData(id) {
      this.loading = true;
      this.update = true;
      this.$reqApi("sale-agency-stock/show", { id: id })
        .then((response) => {
          let data = response.data;
          let text = "";
          let product_name = "";
          let var_1 = "";
          let var_2 = "";
          let var_3 = "";
          this.response = data;
          for (let key in data) {
            this.form[key] = data[key];
          }
          if (data.section_name == "ProductVariationCombination") {
            this.product.product_id = data.product_var.product_id;
            if (data.product_var) {
              product_name = data.product_var.product.name;
            }
            if (data.product_var.variation1) {
              var_1 = data.product_var.variation1.colors
                ? data.product_var.variation1.colors
                : data.product_var.variation1.value;
            }
            if (data.product_var.variation2) {
              var_2 = data.product_var.variation2.value;
            }
            if (data.product_var.variation3) {
              var_3 = data.product_var.variation3.value;
            }
            text = `${product_name}  ( ${var_1} - ${var_2} - ${var_3} )`;
          } else {
            text = data.package.name;
          }
          this.set_title_card = text;
          this.panel = 0;
          this.loading = false;
        })
        .catch((err) => {
          this.update = false;
          this.loading = false;
        });
    },
    setSections(data) {
      this.form.section_id = data.id;
      this.form.section_name = data.section_name;
    },
    refresh(){
      this.$refs.Refresh.getDataFromApi();
    }
  },
};
</script>
<style>
.card-style {
  border: 2px solid #00000031;
  border-radius: 7px;
}
</style>

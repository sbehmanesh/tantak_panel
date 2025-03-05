<template>
  <v-col cols="12" class="mt-5">
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="7">
        <SearchByCatgory
          @productId="setFilter($event, 'id')"
          @type="setFilter($event, 'type')"
          @seeAll="seeAll"
        />
      </v-col>
      <v-col cols="7" class="d-flex justify-center">
        <v-expansion-panels>
          <v-expansion-panel class="elevation-2">
            <v-expansion-panel-header expand-icon="qr_code">
              <h1>جستجو با استفاده از بارکد</h1>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="align-center justify-center">
                <v-col cols="6">
                  <amp-input
                    text="بارکد مورد نظر را وارد کنید"
                    v-model="barcode"
                    cClass="ltr-item"
                  />
                </v-col>
                <v-col cols="6" class="d-flex align-center">
                  <amp-button
                  text="جستجو در محصولات "
                  @click="searchByBarcode('full_barcode')"
                  color="blue-grey"
                  class="mx-4"
                  height="38"
                ></amp-button>

                <amp-button
                  text="جستجو در پکیج ها "
                  @click="searchByBarcode('package_number')"
                  color="blue-grey"
                  height="38"
                ></amp-button>
                </v-col>

     
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-0 text-center">
        <v-col cols="12" md="4">
          <v-banner single-line>
            <v-row class="align-center pa-4">
              <h1>مورد انتخاب شده {{ selected_item.length }}</h1>
              <v-spacer></v-spacer>
              <v-col cols="3" md="2" class="ma-2">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  @click="sendEmit"
                  :disabled="selected_item.length == 0"
                />
              </v-col>
            </v-row>
          </v-banner>
        </v-col>

        <BaseTable
          :rowColor="rowClick"
          ref="ReloadList"
          v-model="selected_item"
          url="/sale-agency-stock/manager-list"
          :headers="headers"
          @getData="totalData($event)"
          :filters="filters"
          :root-body="root_body"
          :BTNactions="btn_actions"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import SearchByCatgory from "@/components/Product/Representative/SearchByCatgory.vue";
export default {
  components: {
    SearchByCatgory,
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
      skock: "",
      varcome_excel: false,
      rotation: false,
      loading: false,
      total_data: [],
      extra_btn: [],
      headers: [],
      slected_product: {},
      products_list: [],
      selected_list: [],
      selected_item: [],
      btn_actions: [],
      overlay: false,
      product: { product_id: "" },
      root_body: "",
      barcode: "",
      product_var_id: "",
      valid: true,
      form: {
        sale_agency_id: "",
        array_section: [],
      },
      filters: {},
      selected_var: {},
    };
  },
  computed: {},
  watch: {
    selected_item: {
      deep: true,
      handler() {
        let selected = this.total_data.find(
          (x) => x.id == this.selected_item[this.selected_item.length - 1]
        );
        if (Boolean(selected)) {
          selected["count"] = "1";
          this.selected_var = selected;
        }
      },
    },

    tab() {
      this.continue_form = false;
    },
  },
  beforeMount() {
    this.root_body = {
      sale_agency_id: this.$store.state.auth.user.sale_agency_id,
    };
    this.url_list = "/sale-agency-stock/manager-list";
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        text: "",
        width: "10px",
        type: "checkbox",
        disableSort: true,
        filterable: false,
        fun: (body) => {},
        show_box: (body) => {
          if (body.skock != "0") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "نوع ",
        disableSort: true,
        filterable: false,
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
        disableSort: true,
        filterable: false,
        value: (body) => {
          let text = "";
          let product_name = "";
          let var_1 = "";
          let var_2 = "";
          let var_3 = "";

          if (body.section_name == "ProductVariationCombination") {
            if (body.only_product_var && body.only_product_var.product) {
              product_name = body.only_product_var.product.name;
            }
            if (body.only_product_var.variation1) {
              var_1 = Boolean(body.only_product_var.variation1.colors)
                ? body.only_product_var.variation1.colors
                : body.only_product_var.variation1.value;
            }
            if (body.only_product_var.variation2) {
              var_2 = body.only_product_var.variation2.value;
            }
            if (body.only_product_var.variation3) {
              var_3 = body.only_product_var.variation3.value;
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
        text: "قیمت    ",
        value: (body) => {
          let price = "";
          let discount_price = "";
          if (
            body.only_product_var &&
            Boolean(body.only_product_var) &&
            Boolean(body.only_product_var.product.special_discounts) &&
            body.only_product_var.product.special_discounts.length > 0
          ) {
            price = Boolean(body.only_product_var.price)
              ? body.only_product_var.price
              : body.only_product_var.product.base_price;
            discount_price =
              body.only_product_var.product.special_discounts[0]
                .type_discount == "amount"
                ? +Number(price) -
                  +Number(
                    body.only_product_var.product.special_discounts[0].price_off
                  )
                : price -
                  (body.only_product_var.product.special_discounts[0]
                    .price_off /
                    100) *
                    price;
            return `
            <h1 class='mt-2'>
            <small>
                ریال  ${this.$price(discount_price)}
              </small>
             <br/>
              <span class="copun-class grey--text">
              ریال  ${this.$price(price)}
                </span>
              </h1>
            `;
          } else {
            let price = "";
            if (Boolean(body.only_product_var)) {
              price = Boolean(body.only_product_var.price)
                ? body.only_product_var.price
                : body.only_product_var.product.base_price;
            } else {
              price = body.package.price;
            }
            return ` <h1 class='mt-2'>
              <small  >
              ریال  ${this.$price(price)}
                </small>
              </h1>`;
          }
        },
        disableSort: true,
        filterable: false,
      },

      {
        text: "موجودی",
        value: (body) => {
          if (body.skock != "0") {
            return body.skock;
          } else {
            return `<h1 class='red--text'>
    اتمام موجودی
    </h1>`;
          }
        },
        disableSort: true,
        filterable: false,
      },
    ];
  },
  methods: {
    sendEmit() {
      this.$emit("selected_data", {
        list: this.total_data,
        selected_item: this.selected_item,
      });
    },
    totalData(event) {
      if (event && event.model.data.length > 0) {
        this.total_data = [...this.total_data, ...event.model.data];
      }
    },

    refresh() {
      this.$refs.ReloadList.getDataFromApi();
    },
    setFilter(event, key) {
      if (key == "id") {
        this.root_body["parent_id"] = event;
        this.refresh();
      } else if (key == "type") {
        if (event == "all") {
          this.filters = {};
        } else {
          this.filters = {
            section_name: { op: "=", value: event },
          };
        }
      }
    },
    searchByBarcode(key) {
      switch (key) {
        case "full_barcode":
          this.filters = {
            full_barcode: {
              op: "=",
              value: this.barcode,
            },
          };
          break;
        case "package_number":
          this.filters = {
            package_number: {
              op: "=",
              value: this.barcode,
            },
          };
          break;
      }
    },
    setlist() {
      this.selected_list.push(this.selected_var);
      this.overlay = false;
    },
    rowClick(body) {
      if (body.item.skock == "0") {
        return "red lighten-5";
      }
    },
    seeAll() {
      this.filters = {};
    },
  },
};
</script>
<style>
.card-style {
  border: 2px solid #00000031;
  border-radius: 7px;
}
</style>

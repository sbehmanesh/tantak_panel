<template>
  <div>
    <v-expansion-panels class="px-4" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="category">
          انتخاب دسته بندی
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12" md="12">
              <v-card class="mt-5 mx-2 pa-3">
                <v-card-title
                  v-if="selected_category.length == 0"
                  class="d-flex flex-column"
                >
                  <v-icon class="mx-3 warning--text">info</v-icon>
                  <span> دسته بندی باید حداقل دو روت عمق داشته باشد </span>
                  <span class="grey--text font_13">
                    <v-icon class="mx-3 warning--text">ads_click</v-icon>

                    برای انتخاب و مشاهده ویژگی ها بر روی ایتم مورد نظر کلیک
                    کنید</span
                  >
                </v-card-title>
                <v-card-text v-else>
                  <v-row>
                    <v-col cols="12" md="11">
                      <span
                        v-for="(i, index) in selected_category"
                        :key="index"
                      >
                        {{ i.text }} <v-icon>chevron_left</v-icon>
                      </span>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            @click="restoreCategory"
                          >
                            <v-icon> autorenew </v-icon>
                          </v-btn>
                        </template>
                        <span>بازگشت به دسته بندی های اصلی</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="12">
              <BaseTable
                ref="variations"
                :url="url"
                :headers="headers"
                v-model="selected_item"
                :filters="filters"
                :row-click="rowClick"
              >
              </BaseTable>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  props: {
    productId: { default: null }
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    selected_item: [],
    removeDialog: false,
    remove_role_affter_acitons: true,
    loading: false,
    time: 3,
    timeInterval: null,
    product_id: "",
    extraBtn: [],
    url: "/category",
    selected_category: [],
    id_selected_category: [],
    filters: {},
    valid: false,
    loading: false,
    createUrl: "/product-variation/insert",
    updateUrl: "/product-variation/update",
    showUrl: "/product-variation/show",
    form: {
      id: "",
      sort: 1,
      value: "",
      variation_type_id: "",
      product_id: "",
      product_category_id: ""
    },

    allVariations: [],
    category_id: ""
  }),
  beforeMount() {
    this.product_id = this.$route.params.id;
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: body => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        }
      },
      { text: "نام", value: "name", filterable: false },
      {
        text: "لینگ",
        value: "slug",
        disableSort: "true",
        filterable: false
      },
      {
        text: "تعداد محصول",
        value: "products_count"
      },
      {
        text: "تعداد ویژگی",
        value: "product_variations_count"
      },
      {
        text: "بارکد",
        value: "barcode"
      },
      {
        text: "سطح",
        value: "level"
      },
      {
        text: "ترتیب نمایش",
        value: "sort",
        disableSort: "true",
        filterable: false
      }
    ];
  },
  mounted() {
    // if (this.modelId) {
    //   this.loadData();
    // }
    this.form.product_id = this.$route.params.id;
    // this.category_id = this.$route.params.variation_category_id;
    this.getAllVariations();
  },
  watch: {
    productId() {
      if (this.productId) {
        this.product_id = this.productId;
      }
    },
    id_selected_category() {
      if (this.id_selected_category.length > 0) {
        console.log("if is working ..");
        this.url = "/product-variation";
        this.filters = {
          product_category_id: {
            op: "=",
            value:
              this.id_selected_category[this.id_selected_category.length - 1]
          }
        };
        this.headers = [];
        this.headers = [
          { text: "مقدار", value: "variation_type", filterable: false },
          {
            text: "مقدار",
            value: "value",
            disableSort: "true",
            filterable: false
          },
          { text: "code", value: "کد", disableSort: "true", filterable: false },
          {
            text: "sort",
            value: "ترتیب نمایش",
            disableSort: "true",
            filterable: false
          }
        ];
      } else {
        console.log("else is working ..");
        this.url = "/category";
        this.headers = [];
        this.headers = [
          {
            text: "زمان ثبت",
            filterType: "date",
            filterCol: "created_at",
            value: body => {
              if (body.created_at) {
                return this.$toJalali(body.created_at);
              }
              return "";
            }
          },
          { text: "نام", value: "name", filterable: false },
          {
            text: "لینگ",
            value: "slug",
            disableSort: "true",
            filterable: false
          },
          {
            text: "تعداد محصول",
            value: "products_count"
          },
          {
            text: "تعداد ویژگی",
            value: "product_variations_count"
          },
          {
            text: "بارکد",
            value: "barcode"
          },
          {
            text: "سطح",
            value: "level"
          },
          {
            text: "ترتیب نمایش",
            value: "sort",
            disableSort: "true",
            filterable: false
          }
        ];
        this.filters = {};
      }
    }
  },
  methods: {
    submit() {
      this.loading = true;
      //   this.form["product_category_id"] = this.category_id;
      let form = this.$copyForm(this.form);
      if (!form.value || !form.variation_type_id) {
        this.$toast.error("Please check the input values.");
        this.loading = false;
        return;
      }
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.modelId = "";
      this.$reqApi(url, form)
        .then(response => {
          if (!this.modelId) {
            this.$toast.success(
              "The desired feature has been successfully added."
            );
          } else {
            this.$toast.success(
              "The property in question has been edited successfully."
            );
          }
          this.$refs.variations.getDataFromApi();
          this.ClearData();
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(response => {
          response = response.model;
          console.log(response);
        })
        .catch(error => {
          this.ClearData();
          this.loading = false;
        });
    },
    rowClick(event) {
      this.selected_category.push({
        text: event.name ? event.name : event.variation_type.value,
        value: event.id
      });
      this.id_selected_category.push(event.id);
    },
    restoreCategory() {
      this.selected_category = [];
      this.id_selected_category = [];
    },
    ClearData() {},
    getAllVariations() {}
  }
};
</script>

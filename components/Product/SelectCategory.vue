<template>
  <div>
    <v-expansion-panels variant="popout" class="my-4 elevation-5">
      <v-expansion-panel>
        <v-expansion-panel-header
          expand-icon="category"
          class="primary lighten-4"
        >
          انتخاب دسته بندی
        </v-expansion-panel-header>
        <v-expansion-panel-content class="primary lighten-5">
          <v-row>
            <v-col cols="12" md="12">
              <v-card class="mt-5 mx-2 pa-3">
                <v-card-title
                  v-if="selected_category.length == 0"
                  class="d-flex flex-column"
                >
                  <span class="grey--text font_13">
                    <v-icon class="mx-3 warning--text">ads_click</v-icon>
                    برای مشاهده زیر مجموعه هر دسته بندی روی آن کلیک کنید
                  </span>
                </v-card-title>
                <v-card-text v-if="selected_category.length > 0">
                  <v-row>
                    <v-col cols="12" md="10">
                      <span
                        v-for="(i, index) in selected_category"
                        :key="index"
                      >
                        {{ i.text }} <v-icon>chevron_left</v-icon>
                      </span>
                    </v-col>
                    <v-col cols="12" md="2" class="d-flex justify-end">
                      <v-btn
                        small
                        color="error"
                        class="mx-3"
                        @click="popIdSelected_category()"
                      >
                        <v-icon> undo </v-icon>
                      </v-btn>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            small
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
                :BTNactions="btn_actions"
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
    productId: { default: null },
    loadCategory: { default: null },
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
    filters: {
      parent_id: {
        op: "=",
        value: null,
      },
    },
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
      product_category_id: "",
    },

    allVariations: [],
    category_id: "",
  }),
  beforeMount() {
    this.product_id = this.$route.params.id;
    this.btn_actions = [
      {
        color: "success",
        text: "",
        fun: (body) => {
          return body;
        },
        show_fun: (body) => {
          if (body) {
            return false;
          }
        },
      },
    ];
    this.headers = [
      { text: "نام", value: "name", filterable: false },
      {
        text: "لینک",
        value: "slug",
        disableSort: "true",
        filterable: false,
      },
      {
        text: "تعداد محصول",
        value: "products_count",
      },
      {
        text: "تعداد ویژگی",
        value: "product_variations_count",
      },
      {
        text: "بارکد",
        value: "barcode",
      },
      {
        text: "سطح",
        value: "level",
      },
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
    loadCategory() {
      this.selected_category = [];
      if (this.loadCategory) {
        this.loadCategory.map((x) => {
          this.selected_category.push({
            text: x.name,
            value: x.id,
          });
          this.id_selected_category.push(x.id);
 
        });
      }
    },
    id_selected_category() {
      this.$emit("input", this.id_selected_category);
      if (this.id_selected_category.length > 0) {
        this.filters = {
          parent_id: {
            op: "=",
            value:
              this.id_selected_category[this.id_selected_category.length - 1],
          },
        };
      } else {
        this.filters = {
          parent_id: {
            op: "=",
            value: null,
          },
        };
      }
    },
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
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("ویژگی مورد نظر با موفقیت اضافه شد.");
          } else {
            this.$toast.success("ویژگی مورد نظر با موفقیت ویرایش شد.");
          }
          this.$refs.variations.getDataFromApi();
          this.ClearData();
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then((response) => {
          response = response.model;
        })
        .catch((error) => {
          this.ClearData();
          this.loading = false;
        });
    },
    rowClick(event) {
      this.selected_category.push({
        text: event.name ? event.name : event.variation_type.value,
        value: event.id,
      });
      this.id_selected_category.push(event.id);
    },
    restoreCategory() {
      this.selected_category = [];
      this.id_selected_category = [];
    },
    popIdSelected_category() {
      this.id_selected_category.pop();
      this.selected_category.pop();
    },
    ClearData() {},
    getAllVariations() {},
  },
};
</script>

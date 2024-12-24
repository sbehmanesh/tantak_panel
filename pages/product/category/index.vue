<template>
  <div>
    <v-row class="d-flex justify-center mt-3">
      <v-col cols="12" md="6" v-if="this.show_catgory_list" class="mx-3">
        <v-alert prominent icon="space_dashboard">
          <h1 class="font_15 mb-1">دسته بندی های مرتبط</h1>
          <v-row class="align-center">
            <h1
              v-for="(text, index) in catgory_name"
              :key="index"
              @click="SelectCategory(text, index)"
              class="ma-1 hover-class mt-2 font_12"
            >
              <v-icon> {{ text.icon }} </v-icon>
              {{ text.text }}
            </h1>
            <v-spacer></v-spacer>
            <v-btn text @click="clearAll" class="mr-10" color="grey darken-2">
              <h1 class="font_12">
                بازگشت به صفحه اصلی
                <v-icon size="19"> refresh </v-icon>
              </h1>
            </v-btn>
          </v-row>
        </v-alert>
        <v-divider></v-divider>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <CategoryCatalogDialog
      :dialog="show_catalog"
      :createdAt="created_at"
      v-if="show_catalog"
      :catgoryId="catgory_id"
      :catgorysName="catgory_catalog"
      @cloasDialog="closeDialog()"
    />
    <BaseTable
      :filters="filters"
      ref="baseTable"
      url="/category"
      :headers="headers"
      v-model="selected_item"
      :extraBtn="extraBtn"
      :BTNactions="btn_actions"
      autoDelete="/category/delete"
      autoUpdate="/product/category"
      :createUrl="`/product/category/insert?catgory_id=${final_catgory}`"
    >
    </BaseTable>

    <v-dialog persistent v-model="removeDialog" width="400">
      <v-card class="pa-4" v-if="removeDialog">
        <v-card-text>
          <div class="font_18 error--text">
            آیا از حذف {{ selected_item.length }} مورد اطمینان دارید ؟
          </div>
          <div class="center-div py-2" v-if="time != 0">
            فعال سازی بعد از {{ time }} ثانیه
          </div>
        </v-card-text>
        <v-card-actions class="d-block">
          <amp-button
            block
            class="mb-2"
            color="error"
            :loading="loading"
            text="بله، حذف شود"
            @click="removeRecords()"
            :disabled="time != 0 || loading"
          />
          <amp-button block class="ma-0" text="بستن" @click="closeDeleteAllDialog()" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import CategoryCatalogDialog from "~/components/Product/Catalog/CategoryCatalogDialog.vue";
export default {
  components: { BaseTable, CategoryCatalogDialog },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "دسته بندی محصولات",
    selected_item: [],
    removeDialog: false,
    show_catgory_list: false,
    loading: false,
    show_catalog: false,
    time: 3,
    timeInterval: null,
    extraBtn: [],
    main_catgory: [],
    all_data: [],
    catgory_id: "",
    created_at: "",
    catgory_name: [],
    catgory_catalog: [],
    final_catgory: "",
    filters: {},
  }),
  beforeMount() {
    this.subCategory();
    this.filters = {
      level: {
        op: "=",
        value: 1,
      },
    };
    this.$store.dispatch("setPageTitle", this.title);
    this.headers = [
      {
        text: "",
        width: "30px",
        type: "checkbox",
        disableSort: true,
        filterable: false,
      },
      {
        text: "تاریخ ایجاد",
        filterType: "date",
        filterCol: "created_at",
        parentClass: "ltr-item text-center",
        value: (body) => this.$toJalali(body.created_at),
      },
      {
        text: "نام دسته بندی",
        value: "name",
        disableSort: "true",
        filterable: false,
      },
      {
        text: "سطح",
        value: "level",
      },
      {
        text: "بارکد",
        value: "barcode",
      },
      // {
      //   text: "والد",
      //   value: "sort",
      //   disableSort: "true",
      //   filterable: false,
      //   value: body => {
      //     if (body.parent_cateogry) {
      //       return body.parent_cateogry.title;
      //     }
      //     return "-";
      //   }
      // },
      {
        text: "تعداد محصولات",
        value: "products_count",
        disableSort: "true",
        filterable: false,
      },
      {
        text: "ترتیب نمایش",
        value: "sort",
        disableSort: "true",
        filterable: false,
      },
    ];

    this.btn_actions = [
      {
        color: "primary",
        text: "مشاهده محصولات",
        fun: (body) => {
          this.$router.push(
            "/product/category/products/" + body.id + "?name=" + body.name
          );
        },
      },
      {
        color: "success",
        text: "ویژگی ها",
        fun: (body) => {
          this.$router.push("/product/category/variation/" + body.id);
        },
      },
      {
        color: "teal",
        text: "مشاهده زیر دسته",
        fun: (body) => {
          this.findSubCatgoryes(body.id);
        },
      },
      {
        color: "orange",
        text: "کاتالوگ",
        fun: (body) => {
          this.show_catalog = true;
          this.created_at = body.created_at;
          this.catgory_id = body.id;
          this.catgory_catalog = JSON.parse(JSON.stringify(this.catgory_name));
          this.catgory_catalog.push({
            text: body.name,
            value: body.id,
            icon: "arrow_left",
          });
        },
        show_fun: () => {
          if (this.$store.state.auth.action.indexOf("product/catalog_categories") > -1) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];

    this.extraBtn = [
      {
        id: 1,
        text: "حذف موارد",
        color: "error",
        icon: "delete",
        fun: (body) => {
          if (this.selected_item.length == 0) {
            this.$toast.error("موردی انتخاب نشده");
            return;
          }

          this.time = 3;
          this.removeDialog = true;
          this.timeInterval = setInterval(() => {
            if (this.time > 0) {
              this.time -= 1;
            } else {
              clearInterval(this.timeInterval);
            }
          }, 1000);
        },
      },
    ];
  },

  methods: {
    removeRecords() {
      this.loading = true;
      for (let i = 0; i < this.selected_item.length; i++) {
        this.$reqApi("/category/delete", { id: this.selected_item[i] })
          .then(async (response) => {
            if (i == this.selected_item.length - 1) {
              this.loading = false;
              this.$refs.baseTable.getDataFromApi();
              this.selected_item = [];
              this.closeDeleteAllDialog();
              this.$toast.success("حذف موارد انجام شد");
            }
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    subCategory() {
      this.loading = true;

      this.$reqApi("/category", { row_number: 30000 })
        .then(async (response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push(element);
          }

          this.all_data = items;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    closeDeleteAllDialog() {
      this.removeDialog = false;
    },
    findSubCatgoryes(id) {
      if (!this.show_catgory_list) {
        this.show_catgory_list = true;
      }
      let category = {};
      let data = JSON.parse(JSON.stringify(this.all_data));
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.id == id) {
          category = element;
        }
      }

      if (Boolean(category)) {
        this.catgory_name.push({
          text: category.name,
          value: category.id,
          icon: "arrow_left",
        });
      }
      this.final_catgory = id;
      this.filters = {
        parent_id: {
          op: "=",
          value: id,
        },
      };
    },
    SelectCategory(item, index) {
      this.catgory_name.splice(index);
      this.findSubCatgoryes(item.value);
    },
    clearAll() {
      this.show_catgory_list = false;
      this.catgory_name = [];
      this.filters = {
        level: {
          op: "=",
          value: 1,
        },
      };
    },
    closeDialog() {
      this.show_catalog = false;
      this.catgory_catalog = [];
    },
  },
};
</script>
<style scoped>
.hover-class:hover {
  color: rgb(253, 81, 2);
  cursor: pointer;
}
.card-class {
  border: 1px solid #00000038 !important;
  border-radius: 7px !important;
}
</style>

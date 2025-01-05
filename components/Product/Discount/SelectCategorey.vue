<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card>
        <div class="primary white--text pa-4 d-flex align-center">
          <h1>
          {{ titleCard }}
           </h1>
          <v-spacer></v-spacer>
          <v-btn text color="white" @click="closeList">
            <v-icon> close </v-icon>
          </v-btn>
        </div>
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
                  <v-btn
                    text
                    @click="clearAll"
                    class="mr-10"
                    color="grey darken-2"
                  >
                    <h1 class="font_12">
                      بازگشت به صفحه اصلی
                      <v-icon size="19"> refresh </v-icon>
                    </h1>
                  </v-btn>
                </v-row>
              </v-alert>
              <v-divider></v-divider>
              <v-divider></v-divider>
              <v-btn @click="saveCategory" block color="btn_color" class="mt-4">
                <span class="white--text"> اعمال تخفیف برای </span>
                <span class="mx-2">
                  <span
                    v-for="(x, i) in catgory_catalog"
                    :key="i"
                    class="ml-1 white--text"
                  >
                    {{ x.text }}
                  </span>
                </span>

                <v-icon color="white"> task_alt </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mx-4">
            <v-col cols="12" md="3" v-for="(c, i) in selected_list" :key="i">
              <v-card
                :class="Boolean(c.deleted) ? 'red lighten-4' : ''"
                outlined
                class="pa-2 elevation-2"
                style="border-right: 3px solid orange"
              >
                <v-row class="align-center">
                  <v-col cols="10">
                    <h1>
                      <v-icon
                        small
                        color="green"
                        class="ml-1"
                        v-if="!Boolean(c.deleted)"
                        >task_alt</v-icon
                      >
                      <v-icon
                        small
                        color="red"
                        class="ml-1"
                        v-if="Boolean(c.deleted)"
                        >cancel</v-icon
                      >
                      {{ c.title }}
                      <br />
                      <small class="grey--text">
                        {{ c.text }}
                      </small>
                    </h1>
                  </v-col>
                  <v-col cols="2">
                    <v-btn @click="c.deleted = !c.deleted" icon>
                      <v-icon v-if="!Boolean(c.deleted)" color="grey">
                        delete</v-icon
                      >
                      <v-icon v-else color="grey">replay</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              class="text-center"
              v-if="selected_list.length > 0 && !this.show_catgory_list"
            >
              <v-divider class="my-2"></v-divider>

              <amp-button
                text="ثبت"
                icon="task_alt"
                color="btn_color"
                @click="submit"
              />
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
            :BTNactions="btn_actions"
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
                <amp-button
                  block
                  class="ma-0"
                  text="بستن"
                  @click="closeDeleteAllDialog()"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import CategoryCatalogDialog from "~/components/Product/Catalog/CategoryCatalogDialog.vue";
export default {
  components: { CategoryCatalogDialog },
  props: {
    titleCard: {
      default: "",
      type: String,
    },   dialog: {
      default: false,
      type: Boolean,
    },
    data: {
      type: Array,
      default: [],
    },
    categoreyItems: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    headers: [],
    btn_actions: [],

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
    selected_list: [],
    total_data: [],
    final_catgory: "",
    filters: {},
    adavnce: [],
    adavnce_obj: {},
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
        text: "نام دسته بندی",
        value: "name",
        disableSort: "true",
        filterable: false,
      },

      {
        text: "تعداد محصولات",
        value: "products_count",
        disableSort: "true",
        filterable: false,
      },
    ];

    this.btn_actions = [
      {
        color: "teal",
        text: "مشاهده زیر دسته",
        fun: (body) => {
          this.findSubCatgoryes(body.id);
          this.catgory_catalog.push({
            text: body.name,
            value: body.id,
            icon: "arrow_left",
          });
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
        },
        show_fun: () => {
          if (
            this.$store.state.auth.action.indexOf(
              "product/catalog_categories"
            ) > -1
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  mounted() {
    if (this.data.length > 0) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let ids = [];
      this.selected_list.map((x) => {
        if (!Boolean(x.deleted)) {
          ids.push(x.value);
        }
      });
if (ids.length > 0) {
  this.$emit("catgoryIds", ids);
  this.closeList();
}else{
  this.$toast.error("دسته بندی انتخاب نشده")
}
    
    },

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
      this.catgory_catalog = [];
      this.filters = {
        level: {
          op: "=",
          value: 1,
        },
      };
    },
    saveCategory() {
      let category = { text: "", value: "" };

      let text = this.catgory_catalog.map((x) => x.text).join(` - `);
      category.text = text;
      category.title =
        this.catgory_catalog[this.catgory_catalog.length - 1].text;
      category.value =
        this.catgory_catalog[this.catgory_catalog.length - 1].value;
      category.deleted = false;
      this.selected_list.push(category);
      this.clearAll();
    },
    closeDialog() {
      this.show_catalog = false;
      this.catgory_catalog = [];
    },
    closeList() {
      this.$emit("closeDialog");
      this.$emit("closeDialog");
      this.$emit("closeDialog");
      this.$emit("closeDialog");
      this.$emit("closeDialog");
    },
    loadData() {
      for (let i = 0; i < this.data.length; i++) {
        const x = this.data[i];

        let item = Boolean(x)
          ? this.categoreyItems.find((f) => f.value == x)
          : "";
        if (Boolean(item)) {
          this.findParents(item.parent);
        }
      }
    },
    findParents(id) {
      let items = [];
      // let find  =  ? this.findParents()
      for (let i = 0; i < this.data.length; i++) {
        let find = {};
        const x = this.data[i];

        find = this.categoreyItems.find((f) => f.value == x);
        if (Boolean(find)) {
          items.push(find);
        }
      }
      for (let i = 0; i < items.length; i++) {
        const element = items[i];
        this.adavnce_obj[element.value] = [];

        this.setParenst(items[i], element.value);
      }
      this.setListCtegoury();
    },
    setParenst(item, parent_id) {
      let find = this.categoreyItems.find((f) => item.parent == f.value);

      this.adavnce_obj[parent_id].push(item.text);
      if (Boolean(find)) {
        return this.setParenst(find, parent_id);
      }
      return "";
    },
    setListCtegoury() {
      let items = [];

      for (let i in this.adavnce_obj) {
        let title = this.adavnce_obj[i].reverse();
        items.push({
          title: title[title.length - 1],
          text: title.map((x) => x).join(" - "),
          value: i,
          deleted: false,
        });
        this.selected_list = items;
      }
    },
  },
};
</script>
<style>
.hover-class:hover {
  color: rgb(253, 81, 2);
  cursor: pointer;
}
.card-class {
  border: 1px solid #00000038 !important;
  border-radius: 7px !important;
}
</style>

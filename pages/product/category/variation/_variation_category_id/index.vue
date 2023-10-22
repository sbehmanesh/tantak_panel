<template>
  <div>
    <BaseTable
      ref="baseTable"
      url="/product-variation"
      :headers="headers"
      v-model="selected_item"
      :filters="filters"
      :extraBtn="extraBtn"
      :BTNactions="btn_actions"
      autoDelete="/product-variation/delete"
      :autoUpdate="`/product/category/variation/${filters.product_category_id}`"
      :createUrl="`/product/category/variation/${filters.product_category_id}/insert`"
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
            text="بله ، حذف شود"
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
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "ویژگی های دسته بندی محصولات",
    selected_item: [],
    removeDialog: false,
    loading: false,
    time: 3,
    timeInterval: null,
    extraBtn: [],
    filters: {}
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.filters = {
      product_category_id: this.$route.params.variation_category_id,
      price_dependant: {
        op: "=",
        value: true
      }
    };
    this.headers = [
      {
        text: "",
        width: "30px",
        type: "checkbox",
        disableSort: true,
        filterable: false
      },
      { text: "مقدار", value: "variation_type", filterable: false },
      {
        text: "مقدار",
        value: "value",
        disableSort: "true",
        filterable: false
      },
      { text: "code", value: "کد", disableSort: "true", filterable: false },
      { text: "sort", value: "ترتیب نمایش", disableSort: "true", filterable: false }
    ];
    this.extraBtn = [
      {
        id: 1,
        text: "حذف گروهی",
        color: "error",
        icon: "delete",
        fun: body => {
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
        }
      }
    ];
  },

  methods: {
    removeRecords() {
      this.loading = true;
      for (let i = 0; i < this.selected_item.length; i++) {
        this.$reqApi("/product-variation/delete", { id: this.selected_item[i] })
          .then(async response => {
            if (i == this.selected_item.length - 1) {
              this.loading = false;
              this.$refs.baseTable.getDataFromApi();
              this.selected_item = [];
              this.closeDeleteAllDialog();
              this.$toast.success("Items have been deleted");
            }
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    closeDeleteAllDialog() {
      this.removeDialog = false;
    }
  }
};
</script>

<template>
  <v-row>
    <v-col cols="12" md="8">
      <StockForm @setFilter="setTable($event)" />
    </v-col>
    <v-col cols="12" md="12" v-if="show_comb">
      <v-expand-transition>
        <v-card v-show="expand" class="elevation-0">
          <v-tabs v-model="tab" class="center-div">
            <v-tab v-for="item in items" :key="item.key">
              {{ item.text }}
              <v-icon class="mx-2">{{ item.icon }}</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-col cols="12">
                <FastUpdateDialog
                  :updateeDiaolog="dialog_items"
                  @reloadVariation="reloadListVariation()"
                />
              </v-col>
              <v-col cols="12" md="12">
                <BaseTable
                  url="/warehouse-stock/list-product-variation-combination"
                  :headers="headers"
                  :BTNactions="actions"
                  ref="ListVariation"
                  :rootBody="rootBody"
                />
              </v-col>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                  class="center-div my-3"
                  v-if="show_comb"
                >
                  <v-card>
                    <SaveStockForm
                      :updateeDiaolog="save_dialog"
                      :model_id="model_id"
                      @reloadTable="reloadListVariation()"
                      @emptyUpdateDoalgo="emptyDialog()"
                    />
                    <v-btn class="primary" @click="setDialogStock()">
                      به روز رسانی تمام ترکیب ها
                      <v-icon class="mx-3"> add_circle </v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
                <v-col cols="12" md="12">
                  <BaseTable
                    url="/warehouse-stock/list-stock"
                    :headers="header_lis_stock"
                    ref="ListStock"
                    @emitDataTable="emitDataTable"
                    autoDelete="/warehouse-stock/delete"
                    :BTNactions="stock_actoins"
                    :rootBody="rootBody"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>
<script>
import StockForm from "~/components/Stock/StockForm.vue";
import FastUpdateDialog from "@/components/WarehouseStock/FastUpdateDialog.vue";
import BaseTable from "@/components/DataTable/BaseTable.vue";
import SaveStockForm from "~/components/Stock/SaveStockForm.vue";
export default {
  components: { StockForm, BaseTable, FastUpdateDialog, SaveStockForm },
  data() {
    return {
      expand: false,
      show_comb: false,
      tab: 0,
      headers: [],
      rootBody: {},
      actions: [],
      stock_actoins: [],
      model_id: null,
      branch_id: "",
      dialog_items: {
        show: false,
        item: null,
      },
      items: [
        { text: "لیست ترکیب های محصول", key: "variation", icon: "list_alt" },
        { text: "موجودی های ثبت شده", key: "stock", icon: "fact_check" },
      ],
      save_dialog: {
        show: false,
        item: null,
      },
      dataEmit: {},
      title: "موجودی انبار",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.dataEmit = "به روز رسانی تمامی ترکیب ها";

    this.headers = [
      {
        text: "نام",
        disableSort: false,
        filterable: false,
        value: (body) => {
          return `${body.variation1.value} | ${body.variation2.value} | ${body.variation3.value}`;
        },
      },
      { text: "بار کد", value: "barcode" },
      { text: "بارکد کامل", value: "full_barcode" },
      { text: "موجودی آنلاین", value: "stock" },
      {
        text: "نوع فروش",
        filterType: "select",
        items: [
          { text: "تکی", value: "single" },
          { text: "عمده", value: "whole" },
        ],
        value: "sell_type",
      },
      // {
      //   text_item: [
      //     {
      //       title: "موجودی",
      //       rules: "require,number",
      //       key: "stock",
      //       index: 0,
      //       value: "",
      //     },
      //     {
      //       title: "موجودی ذخیره",
      //       rules: "number",
      //       key: "saved_stock",
      //       index: 0,
      //       value: "",
      //     },
      //   ],
      //   btn_info: {
      //     color: "success",
      //     title: "ثبت",
      //     url: "/warehouse-stock/insert",
      //     root_body: this.branch_id
      //   },
      //   type: "input",
      // },
    ];
    this.header_lis_stock = [
      {
        text: "نام شعبه",
        filterable: false,
        disableSort: false,
        value: (body) => {
          if (body.branch && body.branch.name) {
            return body.branch.name;
          } else {
            return "-";
          }
        },
      },
      {
        text: "نام شعبه",
        filterable: false,
        disableSort: false,
        value: (body) => {
          return body.branch.name;
        },
      },
      {
        text: "آدرس شعبه",
        filterable: false,
        disableSort: false,
        value: (body) => {
          if (body.branch && body.branch.address) {
            return body.branch.address;
          } else {
            return "-";
          }
        },
      },
      {
        text: "کد شعبه",
        filterable: false,
        disableSort: false,
        value: (body) => {
          return body.branch.branch_code;
        },
      },
      {
        text: "موجودی",
        value: "stock",
      },
      {
        text: "موجودی ذخیره",
        value: "saved_stock",
      },
      {
        disableSort: true,
        filterable: false,
        text: "",
        text_item: [
          {
            title: "موجودی",
            rules: "require,number",
            key: "stock",
            index: 0,
            value: "",
          },
          {
            title: "موجودی ذخیره",
            rules: "number",
            key: "saved_stock",
            index: 0,
            value: "",
          },
        ],
        btn_info: {
          color: "success mt-2",
          title: "به روز رسانی",
          url: "/warehouse-stock/update",
          root_body: this.rootBody,
        },
        type: "input",
      },
    ];
    this.actions = [
      {
        color: "success",
        icon: "add_box",
        text: "ثبت موجودی",
        fun: (body) => {
          if (body.id) {
            this.dialog_items.show = true;
            this.dialog_items.item = {
              item: body,
              branch_id: this.rootBody,
            };
            this.dialog_items.update = false;
          }
        },
      },
    ];
    this.stock_actoins = [];
  },
  methods: {
    setTable(data) {
      this.rootBody = data;
      this.branch_id = data;
      this.show_comb = true;
      setTimeout(() => {
        this.expand = true;
      }, 300);
    },
    setDialogStock() {
      this.save_dialog.show = true;
      this.save_dialog.item = this.rootBody;
    },
    emptyDialog() {
      this.dialog_items.show = false;
      this.dialog_items.item - null;
    },
    reloadListVariation() {
      if (this.$refs.ListVariation && this.$refs.ListStock) {
        this.tab = 1;
        this.$refs.ListVariation.getDataFromApi();
        this.$refs.ListStock.getDataFromApi();
      }
    },
    updateAll(data) {
      try {
      } catch (error) {
        console.log(error);
      }
    },
    emitDataTable(data) {
      console.log(data);
    },
  },
};
</script>

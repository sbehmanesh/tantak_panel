<template>
  <v-container fluid>
    <v-card class="mx-4" >
      <ListStock />
    </v-card>
    <FastUpdateDialog :updateeDiaolog="dialog_items" />
    <BaseTable
      url="/warehouse-stock/list-product-variation-combination"
      :headers="headers"
      :BTNactions="actions"
      :autoDelete="deleteUrl"
      :rootBody="rootBody"
      :filters="filters"
    />
  </v-container>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
import FastUpdateDialog from "@/components/WarehouseStock/FastUpdateDialog.vue";
import ListStock from "~/components/WarehouseStock/ListStock.vue";
export default {
  components: { BaseTable, FastUpdateDialog, ListStock },
  data: () => ({
    deleteUrl: "/warehouse-stock/delete",
    headers: [],
    filters: {},
    actions: [],
    rootBody: {},
    dialog_items: {
      show: false,
      item: null,
    },
    title: "موجودی انبارها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.rootBody = { branch_id: this.$route.params.stock };
    this.actions = [
      {
        color: "success",
        icon: "inventory",
        text: "بروز رسانی",
        fun: (body) => {
          if (body.id) {
            this.dialog_items.show = true;
            this.dialog_items.item = body.id;
          }
        },
      },
    ];
    this.headers = [
      { text: "نام", value: "name" },
      { text: "بار کد", value: "barcode" },
      { text: "بارکد کامل", value: "full_barcode" },
      {
        text: "نوع فروش",
        filterType: "select",
        items: [
          { text: "تکی", value: "single" },
          { text: "عمده", value: "whole" },
        ],
        value: "sell_type",
      },
    ];
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>

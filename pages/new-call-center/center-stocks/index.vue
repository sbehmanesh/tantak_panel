<template>
  <v-row class="pa-4">
    <v-col cols="12" md="12">
      <BaseTable
        :extraBtn="extra_btn"
        url="/center-stock"
        :headers="headers"
        createUrl="/new-call-center/center-stocks/insert"
        :filters="filters"
        :autoLoad="false"
        autoUpdate="/new-call-center/center-stocks"
        :BTNactions="btn_actions"
        autoDelete="/center-stock/delete"
      />
    </v-col>
    <Dialog
      :branchId="id"
      :dialog="show_dialog"
      v-if="show_dialog"
      @closeDialog="closeDialog"
    />  
    
      <VarComExcel
      :dialog="varcome_excel"
      v-if="varcome_excel"
      @closeDialog="closeDialog"
    />
  </v-row>
</template>

<script>
import Dialog from "@/components/Product/Representative/Dialog.vue";
import VarComExcel from "@/components/Product/VarComExcel.vue";
export default {
  components: { Dialog , VarComExcel },
  data: () => ({
    headers: [],
    extra_btn: [],
    items: [],
    filters: {},
    btn_actions: [],
    title: "انبار مرکزی",
    id: "",
    show_dialog: false,
    varcome_excel: false,
  }),
  beforeMount() {
    this.headers = [
      { text: "نام مدیر", value: "first_name_manager" },
      { text: "نام خانوادگی", value: "last_name_manager" },
      { text: "نام مرکز", value: "name" },
      { text: "کد مرکز", value: "code" },
      { text: "شماره همراه", value: "username_manager" },
      {
        text: " نام شهر",
        value: (body) => {
          if (body.country_division) {
            return body.country_division.name;
          }
        },
      },
      {
        text: "آدرس دقیق",
        filterCol: "address",
        type: "tooltip",
        function: (body) => {
          if (body.address) {
            return body.address;
          }
        },
        value: (body) => {
          if (typeof body.address == "string") {
            if (body.address.length < 20) {
              return body.address;
            }
            return body.address.slice(0, 20) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: " تعریف موجودی ",
        icon: "storefront",
        color: "red",
        fun: (body) => {
          this.id = body.id;
          this.show_dialog = true;
        },
      },
    ];
    this.extra_btn = [
      {
        text: "ترکیبات محصول",
        icon: "backup",
        color: "teal darken-2",
        fun: (body) => {
          this.varcome_excel = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    closeDialog() {
      this.show_dialog = false;
      this.varcome_excel = false;
    },
  },
};
</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
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
  </v-row>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import Dialog from "~/components/NewCallCenter/CenterStok/Dialog.vue";
export default {
  components: { BaseTable , Dialog },
  data: () => ({
    headers: [],
    items: [],
    filters: {},
    btn_actions: [],
    title: "انبار مرکزی",
    id:"",
    show_dialog:false
  }),
  beforeMount() {
    this.headers = [

      {text:"نام مدیر" , value:"first_name_manager"},
      {text:"نام خانوادگی" , value:"last_name_manager"},
      {text:"نام مرکز" , value:"name"},
      {text:"کد مرکز" , value:"code"},
      {text:"شماره همراه" , value:"username_manager"},
      {text:" نام شهر" , value:(body)=>{
        if (body.country_division) {
          return body.country_division .name
        }
      }},  
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
        text: "موجودی تعریف",
        icon: "storefront",
        color: "primary",
        fun: (body) => {
          this.id = body.id;
          this.show_dialog = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    closeDialog(){
      this.show_dialog = false
    }
  },
};
</script>

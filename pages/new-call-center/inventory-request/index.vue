<template>
  <v-row class="d-flex justify-center mt-5">
    <v-col cols="12">
      <BaseTable
        url="/product-request"
        :headers="headers"
        :extraBtn="extra_btn"
        :actionsList="actions_list"
        ref="ProductRequest"
      />
    </v-col>
    <v-col cols="12" md="8">
      <Dialog
        :dialog="show_dialog"
        :request="request"
        :basketId="basket_id"
        v-if="show_dialog"
        @closeDialog="show_dialog = false"
        @reload="refresh"
      />
    </v-col>
  </v-row>
</template>

<script>
import Dialog from "@/components/NewCallCenter/InventoryRequest/Dialog.vue";
export default {
  components: { Dialog },
  data: () => ({
    title: "درخواست موجودی",
    headers: [],
    extra_btn: [],
    actions_list: [],
    show_dialog: false,
    request: "",
    basket_id: "",
  }),
  beforeMount() {
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "مجموع قیمت (ریال)",
        type: "price",
        value: "total_price",
      },
      {
        text: "وزن (گرم)",
        type: "price",
        value: "total_weight",
      },
      {
        text: "شماره فاکتور",
        value: "order_number",
      },     
       {
        text: "کد نمایندگی",
        value: "agency_code",
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_invitor,
      },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.step_invitor,
      },
      {
        text: "نوع",
        value: "type",
        filterType: "select",
        items: this.$store.state.static.type_invitor,
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    this.extra_btn = [
      {
        text: "درخواست موجودی",
        color: "primary darkeb-2",
        icon: "add_shopping_cart",
        fun: (body) => {
          this.show_dialog = true;
          this.request = true;
          this.basket_id = "";
        },
      },
    ];
    this.actions_list = [
      {
        text: "مشاهده جزییات",

        fun: (body) => {
          this.show_dialog = true;
          this.request = false;
          this.basket_id = body.id;
        },
      },
    ];
  },

  methods: {
    refresh() {
      this.$refs.ProductRequest.getDataFromApi();
    },
  },
};
</script>
<style scoped></style>

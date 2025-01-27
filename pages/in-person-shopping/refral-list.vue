<template>
  <div>
    <BaseTable
      url="/return-factory"
      ref="RefrralList"
      :headers="headers"
      :extraBtn="extra_btn"
      :BTNactions="btn_actions"
    />
    <ShowItems
      v-if="show_items"
      :dialog="show_items"
      :model-id="model_id"
      @closeDialog="show_items = false"
    />
    <Refral
      v-if="referral"
      :dialog="referral"
      :data="data"
      @reload="reload"
      @closeDialog="referral = false"
    />
    <History
      v-if="history"
      :dialog="history"
      :model-id="model_id"
      @closeDialog="history = false"
    />
  </div>
</template>

<script>
import Refral from "@/components/Product/PersonShopping/refrall/Refral.vue";
import History from "@/components/Product/PersonShopping/refrall/History.vue";
import ShowItems from "@/components/Product/PersonShopping/refrall/ShowItems.vue";
export default {
  components: { ShowItems, Refral, History },
  data: () => ({
    headers: [],
    extra_btn: [],
    btn_actions: [],
    data: {},
    title: " تاریخچه محصولات معوقه ",
    show_items: false,
    referral: false,
    history: false,
    model_id: "",
  }),
  beforeMount() {
    if (Boolean(this.$route.query.action)) {
      this.extra_btn.push({
        text: "برگشت",
        icon: "redo",
        color: "red",
        fun: (body) => {
          this.$router.push(`/in-person-shopping?step=${2}`);
        },
      });
    }
    this.btn_actions = [
      {
        text: "جزییات",
        color: "blue-grey",
        fun: (body) => {
          this.show_items = true;
          this.model_id = body.id;
        },
      },
      {
        text: "تاریخچه ارجاعات",
        color: "red",
        icon: "history",
        fun: (body) => {
          this.history = true;
          this.model_id = body.id;
        },
        show_fun: () => {
          if (
            this.$store.state.auth.action.indexOf("return_factories/logs") > -1
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "برسی روند ارجاع ",
        icon: "sync_alt",
        color: "teal",
        fun: (body) => {
          this.referral = true;
          this.data = body;
        },
        show_fun: (body) => {
          if (
            Boolean(this.$checkRole(this.$store.state.auth.role.agency_manager))
          ) {
            if (body.step == "init") {
              return true;
            } else if (body.step == "sefir_to_agency_manager") {
              return true;
            } else {
              return false;
            }
          } else if (
            Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))
          ) {
            return false;
          } else {
            return true;
          }
        },
      },
    ];
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
      { text: "شماره فاکتور", value: "factor_number" },
      { text: "مجموع قیمت به ریال ", value: "total_price", type: "price" },
      {
        text: "وضعیت",
        filterType: "select",
        filterCol: "status",
        value: "status",
        items: this.$store.state.static.status_basket_refral,
      },
      {
        text: "مرحله ",
        filterType: "select",
        filterCol: "step",
        value: "step",
        items: this.$store.state.static.step_reterned_product,
      },
      { text: "توضیحات ", value: "value_2" },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    reload() {
      this.$refs.RefrralList.getDataFromApi();
    },
  },
};
</script>

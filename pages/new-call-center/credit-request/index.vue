<template>
  <div>
    <ImageDialog
      v-if="image_dialog"
      :dialog="image_dialog"
      :images="imges"
      @closeDialog="image_dialog = false"
    />
    <RefralHistory
      v-if="history"
      :dialog="history"
      :model-id="history_id"
      @closeDialog="history = false"
    />
    <RefralCreditRequest
      v-if="refral"
      :dialog="refral"
      :model-id="refral_id"
      @closeDialog="refral = false"
      @reload="reload"
    />
    <BaseTable
      url="/credit-request"
      :headers="headers"
      :autoUpdate="update_url"
      :createUrl="create_url"
      :BTNactions="btn_actions"
      ref="CreditRequestList"
    />
  </div>
</template>

<script>
import ImageDialog from "@/components/NewCallCenter/CreditRequest/ImageDialog.vue";
import RefralHistory from "@/components/NewCallCenter/CreditRequest/RefralHistory.vue";
import RefralCreditRequest from "@/components/NewCallCenter/CreditRequest/RefralCreditRequest.vue";
export default {
  components: {
    ImageDialog,
    RefralHistory,
    RefralCreditRequest,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    imges: [],
    title: "درخواست های اعتبار",
    create_url: "",
    update_url: "",
    image_dialog: false,
    history: false,
    refral: false,
    refral_id: "",
    history_id: "",
  }),
  beforeMount() {
    if (this.$store.state.auth.action.indexOf("credit_requests/insert") > -1) {
      this.create_url = `/new-call-center/credit-request/insert`;
      this.update_url = `/new-call-center/credit-request`;
    }
    this.$store.dispatch("setPageTitle", this.title);
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
        text: "مبلغ درخواستی",
        value: (body) => {
          if (Boolean(body.amount)) {
            return this.$price(body.amount);
          }
        },
      },
      {
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.$store.state.static.step_credit_request,
      },
      {
        text: "وضعیت",
        filterType: "select",
        value: "status",
        items: this.$store.state.static.status_invitor,
      },
    ];
    this.btn_actions = [
      {
        text: "رسید های بارگذاری شده",
        color: "blue-grey",
        fun: (body) => {
          this.imges = [];
          this.image_dialog = true;
          this.imges = body.file;
        },
      },
      {
        text: " روند ارجاع",
        icon: "multiple_stop",
        color: "teal",
        fun: (body) => {
          this.refral = true;
          this.refral_id = body.id;
        },
        show_fun: () => {
          if (
            this.$store.state.auth.action.indexOf("credit_requests/referral") >
            -1
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تاریخچه",
        icon: "history",
        color: "error lighten-1",
        fun: (body) => {
          this.history_id = "";
          this.history = true;
          this.history_id = body.id;
        },
        // show_fun: () => {

        // },
      },
    ];
  },
  methods: {
    reload() {
      this.$refs.CreditRequestList.getDataFromApi();
    },
  },
};
</script>

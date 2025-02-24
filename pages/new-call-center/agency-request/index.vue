<template>
  <div>
    <BaseTable
      url="/agency-request"
      :headers="headers"
      :BTNactions="btn_actions"
      autoDelete="/agency-request/delete"
      autoUpdate="/new-call-center/agency-request"
      createUrl="/new-call-center/agency-request/insert"
    />
    <RefralAgencyRequest
      v-if="refral"
      :dialog="refral"
      :model-id="refreal_id"
      @closeDialog="refral = false"
      @refresh="refreshTabel"
    />
    <Historey
      v-if="show_history"
      :dialog="show_history"
      :model-id="refreal_id"
      @closeDialog="show_history = false"
    />
  </div>
</template>

<script>
import RefralAgencyRequest from "@/components/NewCallCenter/InventoryRequest/agency/RefralAgencyRequest.vue";
import Historey from "@/components/NewCallCenter/InventoryRequest/agency/Historey.vue";
export default {
  components: {
    RefralAgencyRequest,
    Historey,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "درخواست نمایندگی ها",
    refral: false,
    show_history: false,
    refreal_id: "",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "نام کاربر", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "شماره همراه", value: "phone_number" },
      { text: "متراژ", value: "size_store" },
      {
        text: "نوع مالکیت",
        value: "ownership_type",
        filterType: "select",
        items: this.$store.state.static.ownership_type_agancy,
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.complaint_status,
      },
      {
        text: "شهر",
        value: (body) => {
          return `
<h1 class='my-1'>
          ${body.agency_city}
          <br/>
          <small class='grey--text'>
                    استان
          ${body.agency_province}

                    </small>
          <h1>
`;
        },
      },

      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ تولد ",
        value: (body) => {
          if (body.birth_date) {
            return this.$toJalali(
              body.birth_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
    ];
    this.btn_actions = [
      {
        text: "برسی روند ارجاع",
        color: "blue-grey",
        icon: "swap_vert",
        fun: (body) => {
          this.refreal_id = body.id;
          this.refral = true;
        },
        show_fun: (body) => {
          if (
            this.$checkRole(this.$store.state.auth.role.sale_manager) &&
            (body.step == "init" || body.step == "sale_supervisor_to_manager")
          ) {
            return true;
          } else if (
            this.$checkRole(this.$store.state.auth.role.sales_manager) &&
            body.step == "sale_manager_to_supervisor"
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تاریخچه",
        color: "red",
        icon: "history",
        fun: (body) => {
          this.show_history = true;
          this.refreal_id = body.id;
        },
      },
    ];
  },
  methods: {
    refreshTabel() {
      this.$refs.refreshTabel.getDataFromApi();
    },
  },
};
</script>

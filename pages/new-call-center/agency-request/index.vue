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
    <RefralAgencyRequest :dialog="refral" />
  </div>
</template>

<script>
import RefralAgencyRequest from "@/components/NewCallCenter/InventoryRequest/agency/RefralAgencyRequest.vue";
export default {
  components: {
    RefralAgencyRequest,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "درخواست نمایندگی ها",
    refral: false,
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
          this.refral = true;
        },
      },
    ];
  },
};
</script>

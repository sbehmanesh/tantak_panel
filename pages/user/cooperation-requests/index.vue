<template>
  <div>
    <BaseTable
      url="/employment-form"
      ref="RefreshList"
      :headers="headers"
      :BTNactions="btn_actions"
      autoDelete="/employment-form/delete"
      autoUpdate="/user/cooperation-requests"
      createUrl="/user/cooperation-requests/insert"
    />
    <RefralRequest
      v-if="show_ref"
      :model-id="id"
      :dialog="show_ref"
      @closeDialog="show_ref = false"
      @refresh="reloadTabel"
    />  
      <History
      v-if="history"
      :model-id="refreal_id"
      :dialog="history"
      @closeDialog="history = false"
    />
  </div>
</template>

<script>
import RefralRequest from "@/components/User/CooperationRequests/RefralRequest.vue";
import History from "@/components/User/CooperationRequests/History.vue";
export default {
  components: {
    RefralRequest,
    History,
  },
  data: () => ({
    headers: [],
    show_ref: false,
    history: false,
    id: "",
    refreal_id: "",
    btn_actions: [],
    title: "درخواست های همکاری ( استخدام نیرو )",
  }),
  beforeMount() {
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
      { text: "نام کاربر ", value: "first_name" },
      { text: "نام خانوادگی ", value: "last_name" },
      { text: "شماره همراه", value: "phone_number" },
      { text: "کد ملی", value: "national_code" },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.cooperation_req,
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
      { text: "رشته تحصیلی", value: "field_study" },
      {
        text: "دارای وضعیت سلامتی کامل",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.health_status != "unhealthy") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "متاهل",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.marital_status == "married") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "برسی روند ارجاع",
        color: "blue-grey",
        icon: "swap_vert",
        fun: (body) => {
          this.id = body.id;
          this.show_ref = true;
        },
        show_fun: (body) => {
          let show = false;
    
          if (
            Boolean(
              this.$checkRole(
                this.$store.state.auth.role.human_resources_manager
              )
            )
          ) {
            if (
              body.step == "init" ||
              body.step == "human_resources_supervisor_to_manager"
            ) {
              show = true;
            }
          } else if (
            Boolean(
              this.$checkRole(
                this.$store.state.auth.role.human_resources_supervisor
              )
            )
          ) {
            if (
              body.step == "human_resources_expert_to_supervisor" ||
              body.step == "human_resources_manager_to_supervisor"
            ) {
              show = true;
            } else {
              show = false;
            }
          } else if (
            Boolean(
              this.$checkRole(
                this.$store.state.auth.role.human_resources_expert
              )
            ) &&
            body.step == "human_resources_supervisor_to_expert"
          ) {
            show = true;
          }
          return show;
        },
      },
      {
        text: "تاریخچه",
        color: "red",
        icon: "history",
        fun: (body) => {
          this.history = true;
          this.refreal_id = body.id;
        },
      },
    ];
  },
  methods: {
    reloadTabel() {
      this.$refs.RefreshList.getDataFromApi();
    },
  },
};
</script>

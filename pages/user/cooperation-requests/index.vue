<template>
  <div>
    <BaseTable
      url="/employment-form"
      ref="RefreshList"
      :headers="headers"
      :rowColor="rowColor"
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
    <CloseForm
      v-if="close_form"
      :item="selected_item"
      :dialog="close_form"
      @refresh="reloadTabel"
      @closeDialog="close_form = false"
    />
    <EmploymentInformation
      v-if="information"
      :item="selected_item"
      :dialog="information"
      @closeDialog="information = false"
    />
    <DefectDocument
      v-if="dialog_defect.show"
      :dialog_defect="dialog_defect"
      @relod="reloadTabel"
      @closeDialogDefect="dialog_defect.show = false"
      :body_defect="body_defect"
    />
  </div>
</template>

<script>
import History from "@/components/User/CooperationRequests/History.vue";
import CloseForm from "@/components/User/CooperationRequests/CloseForm.vue";
import RefralRequest from "@/components/User/CooperationRequests/RefralRequest.vue";
import DefectDocument from "@/components/User/CooperationRequests/DefectDocument.vue";
import EmploymentInformation from "@/components/User/CooperationRequests/EmploymentInformation.vue";
export default {
  components: {
    History,
    CloseForm,
    RefralRequest,
    DefectDocument,
    EmploymentInformation,
  },
  data: () => ({
    headers: [],
    show_ref: false,
    dialog_defect: { show: false, items: null },
    body_defect: null,

    information: false,
    selected_item: null,
    history: false,
    close_form: false,
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
          } 
          else if (
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
           ( body.step == "human_resources_supervisor_to_expert" || body.step == "interviewer_to_human_resources_expert")
          ) {
            show = true;
          }else if (
            Boolean(
              this.$checkRole(
                this.$store.state.auth.role.interviewer
              )
            )
          )
          {
            if (body.step == "human_resources_expert_to_interviewer") {
              show = true;
            }
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
      {
        text: "رد درخواست",
        color: "primary darken-3",
        icon: "cancel",
        fun: (body) => {
          this.close_form = true;
          this.selected_item = body;
        },
        show_fun: (body) => {
          if (
            Boolean(
              this.$store.state.auth.action.indexOf(
                "employment_forms/referral"
              ) > -1
            ) &&
            body.status != "done" &&
            body.step != "close" &&
            body.status != "reject"
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        color: "#d50017",
        text: "نقص مدرک",
        icon: "error",
        fun: (body) => {
          this.dialog_defect.items = null;
          this.dialog_defect.show = true;
          this.body_defect = body;
        },
        show_fun: (body) => {
          if (
            this.$store.state.auth.action.indexOf("defect-document/index") >
              -1 &&
            body.status != "close"
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "اطلاعات کاربر",
        color: "blue-grey",
        icon: "assignment",
        fun: (body) => {
          this.information = true;
          this.selected_item = body;
        },
      },
    ];
  },
  methods: {
    reloadTabel() {
      this.$refs.RefreshList.getDataFromApi();
    },
    rowColor(body) {
      if (body.item.step == "close") {
        return "red lighten-5";
      }
    },
  },
};
</script>

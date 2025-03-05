<template>
  <div>
    <BaseTable
      url="/complaint"
         :rootBody="root_body"
      :headers="headers"
      :extraBtn="extra_btn"
      :filters="filters"
      :actionsList="actions_list"
      :BTNactions="btn_actions"
      ref="ComplaintTabel"
      autoDelete="/complaint/delete"
    />
    <ComplaintsDialog
      v-if="show_dialog"
      :dialog="show_dialog"
      :user-id="userId"
      :model-id="model_id"
      @closeDialog="closeDialog"
      @relod="refresh"
    />
    <ComplaintRefral
      v-if="refral_dialog"
      :dialog="refral_dialog"
      :user-id="userId"
      :role-id="role_id"
      :complaint-id="complaint_id"
      @closeDialog="refral_dialog = false"
      @relod="refresh"
    />
    <History
      v-if="history"
      :dialog="history"
      :complaint-id="complaint_id"
      @closeDialog="history = false"
    />
  </div>
</template>

<script>
import ComplaintsDialog from "~/components/NewCallCenter/Complaint/ComplaintsDialog.vue";
import ComplaintRefral from "@/components/NewCallCenter/Complaint/ComplaintRefral.vue";
import History from "@/components/NewCallCenter/Complaint/History.vue";
export default {
  components: { ComplaintsDialog, ComplaintRefral, History },
  props: {
    userId: {
      require: false,
      default: false,
    },
    filterUser: {
      require: false,
      default: true,
    },
  },
  data: () => ({
    headers: [],
    extra_btn: [],
    btn_actions: [],
    actions_list: [],
    show_dialog: false,
    refral_dialog: false,
    history: false,
    model_id: "",
    complaint_id: "",
    role_id: "",
    filters: {},
    root_body: {},
  }),
  beforeMount() {
    if (Boolean(this.filterUser)) {
      this.root_body = {user_id : this.userId}
 
    }
  },
  mounted() {
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

      { text: "شماره پیگیری ", value: "tracking_number" },
      {
        text: "دسته بندی",
        value: (body) => {
          let text = body.category?.category;
          return text;
        },
      },
      { text: "زیر دسته", value: "subcategory" },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.complaint_step,
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.complaint_status,
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        icon: "visibility",
        color: "red",
        text: "نمایش فایل",
        fun: (body) => {
          if (body.file) {
            window.open(this.$getImage(body.file));
          }
        },
        show_fun: (body) => (body.file ? true : false),
      },

      {
        text: "تاریخچه",
        color: "teal",
        icon: "history",
        fun: (body) => {
          this.history = true;
          this.complaint_id = body.id;
        },
        show_fun: (body) => {
          if (body.step != "init") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "روند ارجاع ",
        color: "blue-grey",
        icon: "published_with_changes",
        fun: (body) => {
          this.refral_dialog = true;
          this.complaint_id = body.id;
          this.role_id = body.category?.role_id;
        },
        show_fun: (body) => {
          if (body.step == "close" || body.step == "done" ){
            return false
          }
          if (
            body.step == "init" &&
            !Boolean(this.$checkRole(this.$store.state.auth.role.tracking_unit))
          ) {
            return false;
          } else if (
            Boolean(
              this.$checkRole(this.$store.state.auth.role.tracking_unit)
            ) &&
            body.step == "referral_from_complaint_follow_up"
          ) {
            return false;
          } else {
            return true;
          }
        },
      },
    ];

    if (Boolean(this.filterUser)) {
      this.actions_list = [
        {
          text: "ویرایش",
          fun: (body) => {
            this.show_dialog = true;
            this.model_id = body.id;
          },
        },
      ];
      this.extra_btn = [
        {
          text: "ثبت شکایت",
          icon: "add_circle",
          color: "primary",
          fun: () => {
            this.show_dialog = true;
          },
        },
      ];
    }
  },
  methods: {
    refresh() {
      this.$refs.ComplaintTabel.getDataFromApi();
    },
    closeDialog() {
      this.model_id = "";
      this.show_dialog = false;
    },
  },
};
</script>

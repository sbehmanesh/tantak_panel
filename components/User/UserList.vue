<template>
  <div>
    <BaseTable
      :filters="filters"
      :headers="headers"
      :BTNactions="btnActions"
      :autoUpdate="updateUrl"
      :actions="actions"
      :actionsList="actionsList"
      :rootBody="rootBody"
      :autoDelete="deleteUrl"
      :createUrl="createUrl"
      url="/user/searchByRole"
      ref="reloadBasteTableRole"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable.vue";
export default {
  components: { BaseTable },
  props: {
    rootBody: { default: () => ({}) },
    filters: { default: () => ({}) },
    header: { type: Array, default: () => [] },
    btnActions: { type: Array, default: () => [] },
    dialog_items_issable: {
      type: Object,
      default: () => {
        show: false;
      }
    },
    setIssableItem: { type: Boolean, default: true },
    actionsList: { type: Array, default: () => [] },
    showEmail: {
      type: Boolean,
      default: true
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    showRole: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    createUrl: "/user/insert",
    deleteUrl: "/user/delete",
    updateUrl: "/user",
    headers: [],
    actions: [],
    valid: true,
    form: {
      user_id: "",
      issabel_server_id: "",
      issabel_server_rang: ""
    },
    jira_dialog: { item: null, show: false }
  }),
  watch: {
    "$store.state.setting.select_user_role"() {
      this.updateUrls();
    }
  },
  beforeMount() {
    this.updateUrls();
    this.headers = [
      {
        text: "تصویر",
        value: "avatar",
        type: "image",
        disableSort: "true",
        filterable: false
      },
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
      { text: "کد ملی", filterCol: "national_code", value: "national_code" },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ تولد",
        value: body => {
          if (body.birth_date) {
            return this.$toJalali(body.birth_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD');
          }
          return "";
        }
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: body => {
          if (body.description) {
            return body.description;
          }
        },
        value: body => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        }
      }
    ];
    if (this.showRole) {
      this.headers.push({
        text: "نقش",
        filterCol: "name",
        value: body => {
          if (Array.isArray(body.roles)) {
            return body.roles.map(x => x.name).join(" | ");
          }
          return "";
        }
      });
    }

    this.actions = [
      {
        icon: "update",
        color: "success",
        text: "ورود به پنل",
        fun: body => {
          this.$reqApi("/auth/secondary-token", { id: body.id })
            .then(response => {
              localStorage.setItem("secondary_token", response.Authorization);
              window.open("/#/panel");
            })
            .catch(error => {});
        },
        show_fun: body => {
          // return this.$store.state.auth.role.admin_id;
          return false;
        }
      }
    ];
  },
  methods: {
    updateUrls() {
      let patient_id = this.$store.state.auth.role.patient_id;
      let psychologist_id = this.$store.state.auth.role.psychologist_id;
      if (this.rootBody) {
        this.createUrl = "/user/insert";
        this.updateUrl = "/user";
      }
    },
    closeDialog() {
      this.form.issabel_server_id = null;
      this.form.issabel_server_rang = null;
    },
  }
};
</script>
<style scoped>
.click-to-call:hover {
  color: white;
  background: #602eaa;
}
</style>

<template>
  <div>
    <BaseTable
      url="/region"
      :headers="headers"
      :actions="actions"
      :BTNactions="btnActions"
      :autoUpdate="updateUrl"
      :autoDelete="deleteUrl"
      :createUrl="createUrl"
      :rootBody="rootBody"
      :actionsList="actionsList"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  props: {
    rootBody: { default: () => ({}) },
    filters: { default: () => ({}) },
    btnActions: { type: Array, default: () => [] },
    actionsList: { type: Array, default: () => [] },
  },
  data: () => ({
    createUrl: "/region/insert",
    deleteUrl: "/region/delete",
    updateUrl: "/region",
    headers: [],
    items: [],
    actions: [],
    title: "ناحیه ها",
    form: {
      fa_name: "",
      en_name: "",
      code: "",
    },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.actions = [
      {
        icon: "update",
        color: "success",
        text: "ورود به پنل",
        fun: (body) => {
          this.$reqApi("/auth/secondary-token", { id: body.id })
            .then((response) => {
              localStorage.setItem("secondary_token", response.Authorization);
              window.open("/#/panel");
            })
            .catch((error) => {});
        },
        show_fun: (body) => {
          // return this.$store.state.auth.role.admin_id;
          return false;
        },
      },
    ];
  },
  mounted() {
    this.headers = [
      { text: "نام", value: "fa_name" },
      { text: "نام (English)", value: "en_name" },
      { text: "کد ناحیه", value: "code" },
    ];
  },
  methods: {
    updateUrls() {
      if (this.rootBody) {
        this.createUrl = "/region/insert";
        this.updateUrl = "/region";
      }
    },
  },
};
</script>

<style>
</style>
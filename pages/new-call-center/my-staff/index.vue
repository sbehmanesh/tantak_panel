<template>
  <div>
    <BaseTable
      url="/user/list-employee"
      :headers="headers"
      ref="RefreshStaff"
      :extraBtn="extraBtn"
      :BTNactions="btn_actions"
    />
    <StaafDialog
      v-if="dialog_staff.show"
      :DialogStaff="dialog_staff"
      :staaf="staaf"
      @relod="reload"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import StaafDialog from "~/components/NewCallCenter/StaafDialog.vue";
export default {
  components: { BaseTable, StaafDialog },
  data: () => ({
    headers: [],
    btn_actions: [],
    staaf:null , 
    title: "لیست کارکنان",
    dialog_staff: {
      items: null,
      show: false,
    },
  }),
  beforeMount() {
    this.extraBtn = [
      {
        text: "افزودن زیر مجموعه",
        color: "primary darkeb-2",
        icon: "person_add",
        fun: (body) => {
          this.dialog_staff.show = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      { text: "ویرایش اطلاعات", icon: "account_circle", color: "blue-grey", fun: (body) => {
        this.dialog_staff.show = true
        this.staaf = body
      } },
    ];
    this.headers = [
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
    ];
  },
  methods: {
    reload() {
      this.$refs.RefreshStaff.getDataFromApi();
      this.staaf = null 
    },
  },
};
</script>

<template>
  <div>
    <BaseTable
      url="/representation-request-form"
      :headers="headers"
      :autoUpdate="updateUrl"
      :autoDelete="deleteUrl"
      :createUrl="createUrl"
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
    actionsList: { type: Array, default: () => [] }
  },
  data: () => ({
    createUrl: "/forms/representation-request-form/insert",
    deleteUrl: "/representation-request-form/delete",
    updateUrl: "/forms/representation-request-form",
    headers: [],
    items: [],
    actions: [],
    title: "درخواست نمایندگی"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: body => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        }
      },
      {
        text:'نام',
        value:'first_name'
      },
      {
        text:'نام خانوادگی',
        value:"last_name"
      },
      {
        text:'شماره تماس',
        value:'phone_number'
      },
      {
        text:'کد پستی',
        value:'postal_address'
      },
      {
        text: "وضعیت",
        filterType: "select",
        value: "status",
        items: this.$store.state.static.status_contact_form
      },
      {
        text: "نوع مالکیت",
        filterType: "select",
        value: "ownership_type",
        items: this.$store.state.static.ownership_type
      }
    ];
  }
};
</script>

<style></style>

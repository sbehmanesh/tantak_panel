<template>
  <div></div>
</template>

<script>
export default {
  data: () => ({
    title: "کارتابل",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {
    this.redirect();
  },
  methods: {
    redirect() {
      if (this.$checkAccess("access_cartable/coordinator_manager")) {
        this.$router.push("/panel/coordinator-manager");
      }
      if (this.$checkAccess("access_cartable/coordinator")) {
        this.$router.push("/panel/coordinator");
      }
      if (this.$checkAccess("access_cartable/coordinator_supervisor")) {
        this.$router.push("/panel/coordinator-supervisor");
      }
      //-----------------------------------------------------------------------------------------------------------------------

      if (this.$checkAccess("access_cartable/cartable_fiscal_manager")) {
        this.$router.push("/panel/financial-manager");
      }
      if (this.$checkAccess("access_cartable/cartable_fiscal_supervisor")) {
        this.$router.push("/panel/financial-supervisor");
      }
      if (this.$checkAccess("access_cartable/cartable_fiscal")) {
        this.$router.push("/panel/financial");
      }
      //-----------------------------------------------------------------------------------------------------------------------

      if (this.$checkAccess("access_cartable/cartable_sefir")) {
        this.$router.push("/panel/sefir");
      }

      //-----------------------------------------------------------------------------------------------------------------------

      if (
        this.$checkAccess("access_cartable/cartable_supervisor_center_stock")
      ) {
        this.$router.push("/panel/center-stock/supervisor");
      }
      if (this.$checkAccess("access_cartable/cartable_employee_center_stock")) {
        this.$router.push("/panel/center-stock/employee");
      }

      //-----------------------------------------------------------------------------------------------------------------------
      if (this.$checkAccess("access_cartable/cartable_manager_sale")) {
        this.$router.push("/panel/Sales-units/manager");
      }
      if (this.$checkAccess("access_cartable/cartable_supervisor_sale")) {
        this.$router.push("/panel/Sales-units/supervisor");
      }
      if (this.$checkAccess("ccess_cartable/cartable_employee_sale")) {
        this.$router.push("/panel/Sales-units/employee");
      }
    },
  },
};
</script>

<template>
  <div>
    <AgencyRequestForm />
  </div>
</template>

<script>
import AgencyRequestForm from "@/components/NewCallCenter/InventoryRequest/agency/AgencyRequestForm.vue";

export default {
  components: { AgencyRequestForm },
  data: () => ({
    title: "ثبت درخواست",
  }),
  beforeMount() {},
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

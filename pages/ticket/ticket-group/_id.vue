<template>
  <div>
    <TicketGroupForm :model-id="$route.params.id" />
  </div>
</template>
  
  <script>
import TicketGroupForm from "~/components/Ticket/TicketGroupForm.vue";

export default {
  components: { TicketGroupForm },
  data: () => ({
    title: "ویرایش دسته بندی",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
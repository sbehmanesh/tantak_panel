<template>
    <div>
      <TicketGroupForm  />
    </div>
  </template>
    
    <script>
import TicketGroupForm from '@/components/Ticket/TicketGroupForm.vue'
  export default {
    components: { TicketGroupForm },
    data: () => ({
      title: "ثبت دسته بندی جدید",
    }),
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    },
  };
  </script>
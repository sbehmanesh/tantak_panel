<template>
  <div>
    <TicketInsert />
  </div>
</template>
<script>
import TicketInsert from "@/components/Ticket/TicketInsert.vue";

export default {
  components: { TicketInsert },
  data() {
    return {
      title: "ایچاد تیکت",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>

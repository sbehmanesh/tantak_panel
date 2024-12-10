<template>
  <div>
    <TicketMessages ref="ticketMessage" :model-id="$route.params.id" />
    <SendTicket @getData="sendNewMessage" :model-id="$route.params.id" />
  </div>
</template>

<script>
import SendTicket from '@/components/Ticket/SendTicket.vue'
import TicketMessages from '@/components/Ticket/TicketMessages.vue'
export default {
  components: { SendTicket, TicketMessages },
  data: () => ({
    title: 'پاسخ به تیکت',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
  methods: {
    sendNewMessage() {
      this.$refs.ticketMessage.loadData()
    },
  },
}
</script>

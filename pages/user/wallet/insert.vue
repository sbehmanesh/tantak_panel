<template>
  <div>
    <UserWalletForm :user-id="user_id" />
  </div>
</template>

<script>
import UserWalletForm from '@/components/User/UserWalletForm'
export default {
  components: { UserWalletForm },
  data: () => ({
    title: 'ثبت تراکنش جدید برای کیف پول',
    user_id: '',
  }),
  beforeMount() {
    this.user_id = this.$route.query.id
    if (!this.user_id) {
      this.back()
    } else {
    }
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },

  methods: {
    back() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push('')
      }
    },
  },
}
</script>
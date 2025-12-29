<template>
  <div class="form-transactions-section">
    <div class="transactions-header">{{ label }}</div>

    <div
      v-if="!hasTransactions"
      class="transactions-empty grey lighten-4 rounded pa-3 text-center"
    >
      تراکنشی ثبت نشده است
    </div>

    <div v-else class="transactions-list">
      <div
        v-for="(transaction, index) in transactionsList"
        :key="`${transaction.transaction_number || 'transaction'}-${index}`"
        class="transaction-card rounded elevation-1 pa-3 mb-3"
      >
        <div class="transaction-head">
          <div>
            <p class="transaction-title mb-1">
              {{ transaction.text || 'تراکنش ثبت‌شده' }}
            </p>
            <p
              v-if="transaction.description"
              class="transaction-subtitle text--secondary"
            >
              {{ transaction.description }}
            </p>
          </div>
          <div class="transaction-amount text-left">
            {{ formatNumber(transaction.price) }} ریال
          </div>
        </div>

        <div class="transaction-row">
          <span class="transaction-label">نوع پرداخت</span>
          <span class="transaction-value">
            {{ transactionKindText(transaction.kind_set) }}
          </span>
        </div>
        <div class="transaction-row">
          <span class="transaction-label">وضعیت</span>
          <span class="transaction-value">
            {{ transactionStatusText(transaction.status) }}
          </span>
        </div>
        <div v-if="transaction.paid_date" class="transaction-row">
          <span class="transaction-label">تاریخ پرداخت</span>
          <span class="transaction-value">
            {{ transactionDate(transaction.paid_date) }}
          </span>
        </div>
        <div class="transaction-row">
          <span class="transaction-label">تاریخ ثبت</span>
          <span class="transaction-value">
            {{ transactionDate(transaction.created_at) }}
          </span>
        </div>
        <div class="transaction-row">
          <span class="transaction-label">شناسه تراکنش</span>
          <span class="transaction-value">
            {{ transaction.transaction_number || '-' }}
          </span>
        </div>
        <div v-if="transaction.ref_id" class="transaction-row">
          <span class="transaction-label">شناسه ارجاع</span>
          <span class="transaction-value">{{ transaction.ref_id }}</span>
        </div>
        <div v-if="transaction.card_num" class="transaction-row">
          <span class="transaction-label">شماره کارت</span>
          <span class="transaction-value">{{ transaction.card_num }}</span>
        </div>
        <div v-if="transaction.discount" class="transaction-row">
          <span class="transaction-label">تخفیف</span>
          <span class="transaction-value">
            {{ formatNumber(transaction.discount) }} ریال
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const TRANSACTION_KIND_LABELS = {
  bank: 'درگاه آنلاین',
  manual: 'ثبت دستی',
  cardToCard: 'کارت به کارت',
  naghd: 'نقد',
  check: 'چک',
  pos: 'دستگاه پوز',
  send_pay_link: 'لینک پرداخت',
  post: 'پست',
  sav: 'ساو',
}

export default {
  name: 'TransactionOverview',
  props: {
    label: {
      type: String,
      default: 'لیست تراکنش',
    },
    transactions: {
      type: [Array, Object],
      default: () => [],
    },
  },
  computed: {
    transactionsList() {
      if (!this.transactions) {
        return []
      }
      if (Array.isArray(this.transactions)) {
        return this.transactions
      }
      return [this.transactions]
    },
    hasTransactions() {
      return this.transactionsList.length > 0
    },
  },
  methods: {
    transactionStatusText(status) {
      const items = this.$store?.state?.static?.status_transactions
      const matching = items?.find?.((entry) => entry.value === status)
      return matching?.text || status || '-'
    },
    transactionKindText(value) {
      return TRANSACTION_KIND_LABELS[value] || value || '-'
    },
    formatNumber(value) {
      const number = Number(value)
      if (Number.isNaN(number)) {
        return '-'
      }
      return number.toLocaleString()
    },
    transactionDate(value) {
      if (!value) {
        return '-'
      }
      if (typeof this.$toJalali === 'function') {
        return this.$toJalali(value)
      }
      return value
    },
  },
}
</script>

<style scoped>
.form-transactions-section {
  margin-bottom: 1rem;
}
.transactions-header {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.transactions-empty {
  font-weight: 500;
  color: #616161;
}
.transactions-list {
  display: flex;
  flex-direction: column;
}
.transaction-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  direction: rtl;
}
.transaction-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.transaction-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}
.transaction-subtitle {
  font-size: 0.8rem;
  margin: 0;
}
.transaction-amount {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  text-align: left;
}
.transaction-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
  font-size: 0.85rem;
  color: #3c3c3c;
}
.transaction-label {
  color: #707070;
}
.transaction-value {
  font-weight: 500;
  text-align: left;
}
</style>

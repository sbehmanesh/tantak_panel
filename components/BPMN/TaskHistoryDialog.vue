<template>
  <v-dialog :value="value" max-width="720px" @input="$emit('input', $event)">
    <v-card>
      <v-card-title class="primary white--text">
        <span class="headline">
          تاریخچه وظایف
          <span v-if="task && task.element_name" class="d-block">- {{ task.element_name }}</span>
        </span>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="loading" class="d-flex justify-center py-8">
          <v-progress-circular :size="48" indeterminate color="primary" />
        </div>
        <div v-else-if="error" class="text-center py-8 red--text">
          {{ error }}
        </div>
        <div v-else-if="timeline.length === 0" class="text-center py-8">
          این اولین وظیفه است و برای این درخواست تاریخچه‌ای ثبت نشده است.
        </div>
        <div v-else>
          <v-timeline dense>
            <v-timeline-item
              v-for="item in timeline"
              :key="item.id"
              :color="item.color"
              :icon="item.icon"
              fill-dot
            >
              <v-card outlined>
                <v-card-title class="subtitle-1 font-weight-bold">
                  {{ item.element_name }}
                </v-card-title>
                <v-card-text>
                  <div class="mb-2">
                    <span class="font-weight-medium">وضعیت:</span>
                    <span class="mr-2">{{ item.status_label }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="font-weight-medium">کاربر:</span>
                    <span class="mr-2">{{ item.user_name }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="font-weight-medium">تاریخ ایجاد:</span>
                    <span class="mr-2">{{ item.created_at }}</span>
                  </div>
                  <div class="mb-2" v-if="item.completed_at">
                    <span class="font-weight-medium">تاریخ تکمیل:</span>
                    <span class="mr-2">{{ item.completed_at }}</span>
                  </div>
                  <div class="mb-2" v-if="item.due_at">
                    <span class="font-weight-medium">تاریخ سررسید:</span>
                    <span class="mr-2">{{ item.due_at }}</span>
                  </div>
                  <div>
                    <span class="font-weight-medium">نوع گام:</span>
                    <span class="mr-2">{{ item.element_type_label }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <amp-button text="بستن" icon="close" color="error" @click="closeDialog" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const STATUS_LABELS = {
  ACTIVE: 'در حال انجام',
  COMPLETED: 'تکمیل شده',
  FAILING: 'ناموفق',
  CLOSED: 'بسته شده',
  EVENT_CATCH: 'در انتظار رویداد',
  TRIGGERED: 'فعال شده',
  INCOMING: 'در انتظار'
}

const STATUS_COLORS = {
  ACTIVE: 'info',
  COMPLETED: 'success',
  FAILING: 'error',
  CLOSED: 'grey darken-1',
  EVENT_CATCH: 'orange darken-1',
  TRIGGERED: 'teal',
  INCOMING: 'deep-purple accent-3'
}

const ELEMENT_LABELS = {
  task: 'وظیفه',
  scriptTask: 'وظیفه اسکریپتی',
  serviceTask: 'وظیفه سرویس',
  event: 'رویداد',
  gateway: 'دروازه',
  end_event: 'پایان'
}

const ELEMENT_ICONS = {
  task: 'assignment',
  scriptTask: 'code',
  serviceTask: 'build',
  event: 'event',
  gateway: 'device_hub',
  end_event: 'flag'
}

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    process_request_id: {
      type: Number,
      default: null
    },
    task: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      error: '',
      historyItems: []
    }
  },
  computed: {
    timeline() {
      if (!Array.isArray(this.historyItems)) {
        return []
      }
      const sorted = [...this.historyItems].sort((a, b) => {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
        return aDate - bDate
      })
      return sorted.map((item) => ({
        ...item,
        id: item.id || `${item.element_name}-${item.created_at}`,
        icon: ELEMENT_ICONS[item.element_type] || 'help_outline',
        color: STATUS_COLORS[item.status] || 'primary',
        status_label: STATUS_LABELS[item.status] || item.status || '-',
        element_type_label: ELEMENT_LABELS[item.element_type] || 'گام',
        created_at: this.formatJalali(item.created_at),
        completed_at: this.formatJalali(item.completed_at),
        due_at: this.formatJalali(item.due_at),
        user_name: item.user?.fullname || 'بدون کاربر'
      }))
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.loadHistory()
      } else {
        this.resetState()
      }
    },
    task: {
      handler() {
        if (this.value) {
          this.loadHistory()
        }
      },
      deep: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('input', false)
    },
    async loadHistory() {
      const processRequestId =
        this.process_request_id || this.task?.process_request_id || this.task?.request_id
      console.log('process_request_id',processRequestId,this.process_request_id)
      if (!processRequestId) {
        this.historyItems = []
        this.error = ''
        return
      }

      this.loading = true
      this.error = ''
      this.historyItems = []

      try {
        const response = await this.$reqBpmn(
          '/tasks',
          'get',
          { only_me: false },
          { process_request_id: processRequestId }
        )

        const payload = response && response.data ? response.data : response
        let items = []

        if (Array.isArray(payload)) {
          items = payload
        } else if (Array.isArray(payload?.data)) {
          items = payload.data
        } else if (Array.isArray(payload?.model?.data)) {
          items = payload.model.data
        }

        this.historyItems = items
      } catch (error) {
        console.error('Error loading task history:', error)
        this.error = 'خطا در دریافت تاریخچه وظایف'
        this.$toast.error('خطا در دریافت تاریخچه وظایف')
      } finally {
        this.loading = false
      }
    },
    resetState() {
      this.loading = false
      this.error = ''
      this.historyItems = []
    },
    formatJalali(date) {
      if (!date) {
        return ''
      }
      try {
        const defaultFormat = this.$toJalali(date)
        if (defaultFormat && defaultFormat !== 'Invalid date') {
          return defaultFormat
        }
        const fallbackFormat = this.$toJalali(date, 'YYYY-MM-DDTHH:mm:ssZ')
        return fallbackFormat && fallbackFormat !== 'Invalid date'
          ? fallbackFormat
          : date
      } catch (error) {
        return date
      }
    }
  }
}
</script>

<template>
  <div>
    <v-row v-if="loading" class="pa-4">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">در حال بارگذاری فرآیندها...</div>
      </v-col>
    </v-row>
    
    <v-list v-else class="pa-2" two-line>
      <v-list-item
        v-for="process in processes"
        :key="process.process.id"
        class="mb-2 elevation-1 process-list-item"
        @click="$emit('start-process', process)"
      >
        <v-list-item-avatar class="primary white--text" size="40">
          <v-icon dark>assignment</v-icon>
        </v-list-item-avatar>
        
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">
            {{ process.process.name }} <span v-if="process.start_event_name != 'Start Event'"> ({{ process.start_event_name }})</span>
          </v-list-item-title>
        </v-list-item-content>
        
        <v-list-item-action>
          <amp-button
            text="شروع"
            color="primary"
            small
            :loading="false"
          />
        </v-list-item-action>
      </v-list-item>
      
      <v-list-item v-if="processes.length === 0">
        <v-list-item-content class="text-center py-6">
          <v-alert type="info" class="mb-0">
            هیچ فرآیند فعالی یافت نشد
          </v-alert>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    
    <v-card-actions class="pa-4 border-top">
      <v-spacer></v-spacer>
      <amp-button
        text="بستن"
        color="red"
        @click="$emit('close-dialog')"
      />
    </v-card-actions>
  </div>
</template>

<script>
export default {
  props: {
    processes: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    getStatusColor(status) {
      const statusColors = {
        'active': 'green',
        'inactive': 'red',
        'draft': 'orange',
        'archived': 'grey'
      }
      return statusColors[status] || 'grey'
    },
    
    getStatusText(status) {
      const statusTexts = {
        'active': 'فعال',
        'inactive': 'غیرفعال',
        'draft': 'پیش نویس',
        'archived': 'آرشیو شده'
      }
      return statusTexts[status] || status
    }
  }
}
</script>

<style scoped>
.process-list-item {
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.process-list-item:hover {
  background-color: #f5f5f5;
  transform: translateX(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.v-list-item__subtitle {
  white-space: normal !important;
}
</style>
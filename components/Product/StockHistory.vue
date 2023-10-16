<template>
  <div>
    <div v-if="loading" class="center-div pa-4">
      <v-progress-circular :size="50" indeterminate color="success"></v-progress-circular>
    </div>
    <div v-else>
      <v-timeline>
        <v-timeline-item v-for="(item, index) in items" :key="index" color="success">
          <v-card color="grey lighten-4">
            <v-card-text>
              <div>
                <v-chip label color="error" class="" v-if="item['type'] == 'minus'"> کاهش موجودی </v-chip>
                <v-chip label color="success" class="" v-else-if="item['plus '] == 'plus'"> افزایش موجودی </v-chip>
                <v-chip label color="success" class="" v-else>ثبت موجودی اولیه </v-chip>
              </div>
              <div>موجودی جدید {{ item['new_stock'] }}</div>

              <div>موجودی قبلی {{ item['old_stock'] }}</div>
              <div>{{ item['product_name'] }} - {{ item['message'] }}</div>
              <div class="ltr-item text-left">
                {{ $toJalali(item.created_at) }}
              </div>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <div class="center-div pa-4">
        <amp-button large text="بستن" icon="close" color="error" @click="closedialog()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { value: { require: true } },
  data: () => ({
    loading: true,
    items: [],
  }),
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      this.$reqApi('/stocks-log', {
        filters: { product_varcomb_id: this.value }
      })
        .then((response) => {
          this.items = response.model.data
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    closedialog(reload = false) {
      this.$emit('closeDialog', reload)
    },
  },
}
</script>

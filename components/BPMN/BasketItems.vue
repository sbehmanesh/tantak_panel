<template>
  <div class="basket-items">
    <div v-if="loading">
      <v-skeleton-loader
        v-for="n in 3"
        :key="`basket-item-skeleton-${n}`"
        type="list-item-avatar-two-line"
        class="mb-2"
      />
    </div>
    <v-alert
      v-else-if="error"
      type="error"
      dense
      outlined
    >
      {{ error }}
    </v-alert>
    <v-alert
      v-else-if="!normalizedItems.length"
      type="info"
      dense
      outlined
    >
      آیتمی برای این سبد ثبت نشده است.
    </v-alert>
    <v-list
      v-else
      dense
      class="py-0"
    >
      <template>
        <v-list-item
          v-for="(item, index) in normalizedItems"
          :key="item.id || index"
          class="px-0"
        >
          <v-list-item-avatar size="48">
            <v-img
              :src="item.image"
              contain
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <div class="d-flex align-center mb-1 flex-wrap">
              <div class="font-weight-medium text-body-2">
                {{ item.title }}
              </div>
              <v-chip
                label
                x-small
                class="ml-2 mt-1"
                color="deep-purple lighten-5"
                text-color="deep-purple darken-2"
              >
                {{ item.typeLabel }}
              </v-chip>
            </div>
            <div
              v-if="item.description != null && item.description != ''"
              class="text-caption grey--text text--darken-1 mb-1"
            >
              {{ item.description }}
            </div>
            <div class="basket-item-meta text-caption grey--text text--darken-2">
              <span>بارکد: <strong>{{ item.barcode }}</strong></span>
            </div>
            <div class="basket-item-meta text-caption grey--text text--darken-2">
              <span>تعداد: <strong>{{ item.numberLabel }}</strong></span>
            </div>
          </v-list-item-content>
          <v-list-item-action class="text-right">
            <div class="text-caption grey--text text--darken-1">
              قیمت (ریال)
            </div>
            <div class="font-weight-bold">
              {{ item.priceFormatted }}
            </div>
          </v-list-item-action>
        </v-list-item>
        <v-divider
          v-if="index < normalizedItems.length - 1"
          :key="`divider-${item.id || index}`"
          class="my-1"
        />
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'BasketItems',
  props: {
    basket_id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      basketData: null,
    }
  },
  computed: {
    normalizedItems() {
      if (!this.basketData || !Array.isArray(this.basketData.items)) {
        return []
      }
      return this.basketData.items.map((item, index) => this.normalizeItem(item, index))
    },
  },
  watch: {
    basket_id: {
      handler(newVal) {
        if (newVal) {
          this.fetchBasketDetails()
        } else {
          this.basketData = null
        }
      },
      immediate: true,
    },
  },
  methods: {
    async fetchBasketDetails() {
      this.loading = true
      this.error = null
      try {
        const response = await this.$reqApi('basket/show-task', { id: this.basket_id })
        this.basketData = response?.data || null
      } catch (error) {
        this.error = 'خطا در دریافت اطلاعات سبد'
        // eslint-disable-next-line no-console
        console.error('BasketItems: unable to load basket details', error)
      } finally {
        this.loading = false
      }
    },
    normalizeItem(item = {}, index) {
      const isPackage = Boolean(item.package)
      const imagePath = isPackage ? item.package?.logo : item.product?.main_image
      const packageName =
        item.package?.name ||
        (item.package?.package_number ? `پکیج ${item.package.package_number}` : '')
      const productName = item.product?.name
      const title = isPackage
        ? packageName || item.information || 'آیتم بدون عنوان'
        : [productName, item.information].filter(Boolean).join(' - ') || 'آیتم بدون عنوان'
      return {
        id: item.id || `${item.full_barcode || 'basket-item'}-${index}`,
        typeLabel: isPackage ? 'پکیج' : 'محصول',
        image: this.resolveImage(imagePath),
        title,
        description: isPackage ? item.information : item.information,
        barcode: item.full_barcode || '-',
        priceFormatted: this.formatPrice(item.price),
        numberLabel: this.formatNumber(item.number),
        sellType: item.sell_type || '-',
        stockBlockedLabel:
          typeof item.stock_blocked === 'number'
            ? this.formatNumber(item.stock_blocked)
            : '-',
      }
    },
    resolveImage(path) {
      if (typeof this.$getImage === 'function') {
        return this.$getImage(path || '/image/no_image.png')
      }
      return path || '/image/no_image.png'
    },
    formatPrice(value) {
      if (typeof this.$price === 'function') {
        return this.$price(value || 0)
      }
      return this.formatNumber(value)
    },
    formatNumber(value) {
      const number = Number(value)
      if (Number.isNaN(number)) {
        return '-'
      }
      return number.toLocaleString()
    },
  },
}
</script>

<style scoped>
.basket-items {
  width: 90%;
  margin-right: 5%;
}

.basket-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>

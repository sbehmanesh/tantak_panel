<template>
  <div class="easy-product pa-4">
    <v-stepper alt-labels v-model="activeStep">
      <v-stepper-header>
        <template v-for="(step, index) in steps">
          <v-stepper-step
            :key="`step-${step.key}`"
            :complete="activeStep > index + 1"
            :step="index + 1"
          >
            {{ step.label }}
          </v-stepper-step>
          <v-divider v-if="index < steps.length - 1" :key="`div-${index}`"></v-divider>
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-row>
            <v-col cols="12" md="4">
              <amp-input text="نام محصول" rules="require" v-model="form.name" />
            </v-col>
            <v-col cols="12" md="4">
              <amp-input text="لینک" v-model="form.slug" />
            </v-col>
            <v-col cols="12" md="4">
              <amp-select text="برند" v-model="form.brand_id" :items="brandItems" />
            </v-col>
            <v-col cols="12" md="4">
              <amp-input text="قیمت پایه" is-price v-model="form.base_price" />
            </v-col>
            <v-col cols="12" md="4">
              <amp-input text="قیمت عمده" is-price v-model="form.base_wholesale_price" />
            </v-col>
            <v-col cols="12" md="4">
              <amp-select text="واحد عمده" :items="wholesaleUnits" v-model="form.wholesale_unit" />
            </v-col>
            <v-col cols="12" md="4">
              <AmpUploadFileNew :label="false" title="تصویر اصلی" v-model="form.main_image" />
            </v-col>
            <v-col cols="12" md="4">
              <AmpUploadFileNew
                multiple
                :label="false"
                title="گالری تصاویر"
                v-model="form.medias"
              />
              <div v-if="form.medias && form.medias.length" class="d-flex flex-wrap mt-2">
                <v-avatar v-for="(media, index) in form.medias" :key="`media-${index}`" size="48" class="ma-1">
                  <v-img :src="$getImage(media)" />
                </v-avatar>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-switch inset dense label="فروش آنلاین" v-model="form.online_sale" />
              <v-switch inset dense label="فروش تلفنی" v-model="form.phone_sale" />
              <v-switch inset dense label="فروش حضوری" v-model="form.person_sale" />
            </v-col>
            <v-col cols="12" md="4" v-if="form.phone_sale">
              <amp-select text="نوع پیش پرداخت" :items="prepayTypes" v-model="form.prepay_type" />
            </v-col>
            <v-col cols="12" md="4" v-if="form.phone_sale">
              <amp-input
                :text="form.prepay_type === 'percent' ? 'درصد پیش پرداخت' : 'مبلغ پیش پرداخت'"
                v-model="form.prepay_amount"
              />
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-row>
            <v-col cols="12" md="6">
              <amp-autocomplete
                chips
                multiple
                text="جستجوی دسته"
                v-model="selectedCategories"
                :items="categoryOptions"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-treeview
                dense
                selectable
                transition
                open-on-click
                :items="categoryTree"
                :value="selectedCategories"
                @input="setCategories"
              />
            </v-col>
          </v-row>
          <v-divider class="my-6" />
          <v-row>
            <v-col v-for="slot in variationSlots" :key="slot.slot" cols="12" md="4">
              <v-card outlined class="pa-3">
                <div class="d-flex justify-space-between align-center mb-3">
                  <strong>{{ slot.title }}</strong>
                  <amp-select
                    dense
                    :items="variationTypes"
                    placeholder="نوع ویژگی"
                    v-model="slot.variation_type_id"
                    @change="(value) => setVariationType({ slot: slot.slot, variation_type_id: value })"
                  />
                </div>
                <v-text-field
                  v-if="slot.mode !== 'color'"
                  dense
                  outlined
                  label="افزودن سریع"
                  hint="برای بازه عددی از - یا , استفاده کنید"
                  persistent-hint
                  v-model="slot.quickValue"
                  @keyup.enter="handleQuickAdd(slot)"
                />
                <v-btn
                  v-else
                  block
                  color="primary"
                  small
                  class="mt-1"
                  @click="handleQuickAdd(slot)"
                >
                  افزودن رنگ جدید
                </v-btn>
                <v-simple-table dense class="mt-2">
                  <tbody>
                    <tr v-for="item in slot.items" :key="item.client_temp_id">
                      <td width="50">
                        <v-chip x-small>{{ slot.mode === 'color' ? 'رنگ' : 'متن' }}</v-chip>
                      </td>
                      <td>
                        <component
                          :is="slot.mode === 'color' ? 'amp-autocomplete' : 'amp-input'"
                          :items="slot.mode === 'color' ? colorOptions : []"
                          :multiple="slot.mode === 'color'"
                          :chips="slot.mode === 'color'"
                          :text="slot.mode === 'color' ? 'رنگ' : 'مقدار'"
                          dense
                          v-model="item.value"
                          @input="onVariationValueChange(slot, item, $event)"
                          @chang="onVariationValueChange(slot, item, $event)"
                        />
                      </td>
                      <td width="40">
                        <v-btn icon x-small @click="removeVariationValue({ slot: slot.slot, id: item.client_temp_id })">
                          <v-icon color="error" small>delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card outlined class="pa-4">
            <h3 class="mb-4">مرور نهایی</h3>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>نام</v-list-item-title>
                  <v-list-item-subtitle>{{ form.name || '-' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>دسته‌بندی</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedCategories.length }} مورد</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>ترکیب‌ها</v-list-item-title>
                  <v-list-item-subtitle>{{ combinations.length }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-alert v-if="summaryErrors.length" type="error" outlined class="mt-4">
              <div v-for="(err, index) in summaryErrors" :key="index">{{ err }}</div>
            </v-alert>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <div class="easy-footer d-flex justify-space-between align-center mt-4">
      <div>
        گام {{ activeStep }} از {{ steps.length }}
      </div>
      <div>
        <amp-button text="قبلی" color="grey" small class="mx-1" :disabled="activeStep === 1" @click="prevStep" />
        <amp-button
          text="بعدی"
          color="primary"
          small
          class="mx-1"
          :disabled="activeStep >= steps.length"
          @click="nextStep"
        />
        <amp-button text="ذخیره" color="success" small class="mx-1" :loading="saving" @click="handleSave" />
      </div>
    </div>
  </div>
</template>

<script>
const createTempId = (prefix = 'tmp') => `${prefix}-${Math.random().toString(16).slice(2)}`

export default {
  data: () => ({
    steps: [
      { key: 'base', label: 'اطلاعات پایه' },
      { key: 'categories', label: 'دسته‌بندی و ویژگی' },
      { key: 'review', label: 'مرور و ذخیره' },
    ],
    activeStep: 1,
    loading: false,
    saving: false,
    form: {
      id: null,
      name: '',
      slug: '',
      barcode: '',
      brand_id: null,
      base_price: null,
      base_wholesale_price: null,
      online_sale: true,
      phone_sale: false,
      person_sale: true,
      prepay_type: 'amount',
      prepay_amount: null,
      wholesale_unit: null,
      main_image: '',
      medias: [],
      tags: [],
    },
    selectedCategories: [],
    categoryTree: [],
    categoryOptions: [],
    variationSlots: [
      { slot: 1, title: 'تنوع ۱', variation_type_id: null, mode: 'text', items: [], quickValue: '' },
      { slot: 2, title: 'تنوع ۲', variation_type_id: null, mode: 'text', items: [], quickValue: '' },
      { slot: 3, title: 'تنوع ۳', variation_type_id: null, mode: 'text', items: [], quickValue: '' },
    ],
    combinations: [],
    comboTimer: null,
    summaryErrors: [],
    variationTypes: [],
    colorOptions: [],
    wholesaleUnits: [],
    brandItems: [],
    prepayTypes: [],
    deletedVariations: [],
    deletedCombinations: [],
    variationDefaults: {
      sort: 1,
      category_id: null,
    },
    combinationDefaults: {
      sell_type: 'single',
      stock: 0,
      price: null,
      discount: null,
      order_point_center: 0,
      order_point_agency: 0,
    },
  }),
  watch: {
    variationSlots: {
      deep: true,
      handler() {
        this.scheduleComboRefresh()
      },
    },
    combinations: {
      deep: true,
      handler() {
        this.validateForm()
      },
    },
    selectedCategories: 'validateForm',
    form: {
      deep: true,
      handler() {
        this.validateForm()
      },
    },
  },
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      this.loading = true
      await Promise.all([this.fetchMeta(), this.fetchCategories()])
      await this.hydrateIfNeeded()
      this.loading = false
      this.validateForm()
    },
    async fetchMeta() {
      const [types, colors, units, brands] = await Promise.all([
        this.$reqApi('/setting', { filters: { key: 'variation_type' }, row_number: 10 }),
        this.$reqApi('/setting', { filters: { key: 'product_colors' }, row_number: 1000 }),
        this.$reqApi('/setting', { filters: { key: 'wholesale_unit' }, row_number: 10 }),
        this.$reqApi('/brand', { row_number: 100 }),
      ])
      this.variationTypes = (types?.model?.data || []).map((item) => ({
        text: item.value,
        value: item.id,
        value_2: item.value_2,
      }))
      this.colorOptions = (colors?.model?.data || []).map((item) => ({
        text: item.value,
        value: item.id,
      }))
      this.wholesaleUnits = (units?.model?.data || []).map((item) => ({
        text: item.value,
        value: item.id,
      }))
      this.brandItems = (brands?.model?.data || []).map((item) => ({
        text: item.name,
        value: item.id,
      }))
      this.prepayTypes = this.$store.state.static?.prepaid_type || []
    },
    async fetchCategories() {
      const response = await this.$reqApi('/category', { row_number: 1000 })
      const data = response?.model?.data || []
      this.categoryTree = this.buildTree(data)
      this.categoryOptions = data.map((item) => ({
        text: item.name,
        value: item.id,
      }))
    },
    async hydrateIfNeeded() {
      const idParam = this.$route.params.id
      if (!idParam || idParam === 'insert') {
        this.$store.dispatch('setPageTitle', 'افزودن سریع محصول')
        this.deletedVariations = []
        this.deletedCombinations = []
        this.combinations = []
        return
      }
      const payload = await this.$reqApi('/product/show', { id: idParam })
      const product = payload?.product || payload?.data || {}
      this.form = {
        ...this.form,
        ...product,
        id: product.id,
        tags: (product.tags || []).map((tag) => (typeof tag === 'object' ? tag.name : tag)),
      }
      const gallery = product.medias || product.product_images || []
      this.form.medias = this.normalizeMedias(gallery)
      this.selectedCategories =
        product.category_ids || (product.categories || []).map((cat) => cat.id)
      if (product.variations) {
        this.loadVariations(product.variations)
      }
      if (product.variation_combinations) {
        this.combinations = this.normalizeCombinations(product.variation_combinations)
      } else {
        this.combinations = []
      }
      this.deletedCombinations = []
      this.$store.dispatch('setPageTitle', 'ویرایش سریع محصول')
    },
    loadVariations(payload) {
      const slots = this.variationSlots.map((slot) => ({
        slot: slot.slot,
        title: slot.title,
        variation_type_id: null,
        mode: 'text',
        items: [],
        quickValue: '',
      }))
      this.deletedVariations = []
      const items = Array.isArray(payload.items || payload) ? payload.items || payload : payload.items
      ;(items || []).forEach((item) => {
        const slotIndex = item.variation_type?.sort || 1
        const slot = slots[slotIndex - 1]
        if (!slot) {
          return
        }
        slot.variation_type_id = item.variation_type_id
        slot.mode = item.variation_type?.value_2 === 'product_colors' ? 'color' : 'text'
        const parsedValue = this.parseValue(item.value)
        slot.items.push({
          id: item.id,
          client_temp_id: item.client_temp_id || createTempId('var'),
          value:
            slot.mode === 'color'
              ? Array.isArray(parsedValue)
                ? [...parsedValue]
                : []
              : parsedValue,
          barcode: item.barcode || '',
          images: (item.product_images || []).map((img) => img.path || img),
        })
      })
      this.variationSlots = slots
    },
    normalizeCombinations(payload) {
      const items = Array.isArray(payload.items || payload) ? payload.items || payload : payload.items
      return (items || []).map((item) => ({
        ...item,
        client_temp_id: item.client_temp_id || createTempId('combo'),
      }))
    },
    buildTree(list) {
      if (!Array.isArray(list)) {
        return []
      }
      const nodes = list.map((item) => ({
        ...item,
        children: [],
      }))
      const map = nodes.reduce((acc, node) => {
        acc[node.id] = node
        return acc
      }, {})
      const roots = []
      nodes.forEach((node) => {
        const parentId = node.parent_id || node.parent_category_id || null
        if (parentId && map[parentId]) {
          map[parentId].children.push(node)
        } else if (!parentId || node.level === 1) {
          roots.push(node)
        }
      })
      const sortNodes = (items) => {
        return items
          .sort((a, b) => {
            const aSort = typeof a.sort === 'number' ? a.sort : a.level || 0
            const bSort = typeof b.sort === 'number' ? b.sort : b.level || 0
            if (aSort === bSort) {
              return (a.name || '').localeCompare(b.name || '')
            }
            return aSort - bSort
          })
          .map((item) => ({
            ...item,
            children: sortNodes(item.children || []),
          }))
      }
      return sortNodes(roots)
    },
    parseValue(value) {
      if (typeof value === 'string' && value.trim().startsWith('[')) {
        try {
          return JSON.parse(value)
        } catch (error) {
          return value
        }
      }
      return value
    },
    setCategories(ids) {
      this.selectedCategories = ids
    },
    setVariationType({ slot, variation_type_id }) {
      const target = this.variationSlots.find((item) => item.slot === slot)
      if (!target) {
        return
      }
      const type = this.variationTypes.find((item) => item.value === variation_type_id)
      const previousType = target.variation_type_id
      target.variation_type_id = variation_type_id
      target.mode = type && type.value_2 === 'product_colors' ? 'color' : 'text'
      if (previousType && previousType !== variation_type_id) {
        target.items = []
      }
    },
    addVariationValue({ slot, value }) {
      const target = this.variationSlots.find((item) => item.slot === slot)
      if (!target) {
        return
      }
      const normalizedValue =
        target.mode === 'color'
          ? Array.isArray(value)
            ? [...value]
            : []
          : typeof value === 'number'
          ? `${value}`
          : (value || '').toString().trim()
      if (target.mode !== 'color' && !normalizedValue) {
        return
      }
      if (
        target.mode !== 'color' &&
        target.items.some((item) => (item.value || '').toString() === normalizedValue)
      ) {
        return
      }
      target.items.push({
        client_temp_id: createTempId(`var${slot}`),
        value: normalizedValue,
        barcode: '',
        images: [],
      })
      this.variationSlots = [...this.variationSlots]
    },
    handleQuickAdd(slot) {
      if (slot.mode === 'color') {
        this.addVariationValue({ slot: slot.slot, value: [] })
        slot.quickValue = ''
        return
      }
      const values = this.parseQuickValues(slot.quickValue)
      if (!values.length) {
        return
      }
      values.forEach((value) => {
        this.addVariationValue({ slot: slot.slot, value })
      })
      slot.quickValue = ''
    },
    updateVariationValue({ slot, id, patch }) {
      console.log(slot,id,patch)
      const target = this.variationSlots.find((item) => item.slot === slot)
      if (!target) {
        return
      }
      const row = target.items.find((item) => item.client_temp_id === id || item.id === id)
      if (!row) {
        return
      }
      Object.assign(row, patch)
      this.variationSlots = [...this.variationSlots]
    },
    onVariationValueChange(slot, item, value) {
      this.updateVariationValue({
        slot: slot.slot,
        id: item.client_temp_id,
        patch: { value },
      })
    },
    removeVariationValue({ slot, id }) {
      const target = this.variationSlots.find((item) => item.slot === slot)
      if (!target) {
        return
      }
      const removedItem = target.items.find(
        (item) => item.client_temp_id === id || item.id === id
      )
      if (removedItem && removedItem.id) {
        this.markVariationForDeletion(removedItem.id)
      }
      target.items = target.items.filter((item) => item.client_temp_id !== id && item.id !== id)
      this.variationSlots = [...this.variationSlots]
    },
    parseQuickValues(input) {
      if (typeof input !== 'string') {
        return []
      }
      const raw = input.trim()
      if (!raw) {
        return []
      }
      const normalizedRaw = this.normalizeDigits(raw).replace(/،/g, ',')
      const segments = normalizedRaw
        .split(',')
        .map((segment) => segment.trim())
        .filter(Boolean)
      const sources = segments.length ? segments : [normalizedRaw]
      const values = []
      sources.forEach((segment) => {
        const rangeParts = segment.split('-').map((part) => part.trim())
        const numericRange =
          rangeParts.length === 2 && rangeParts.every((part) => this.isNumericToken(part))
        if (numericRange) {
          const start = parseInt(rangeParts[0], 10)
          const end = parseInt(rangeParts[1], 10)
          if (!Number.isNaN(start) && !Number.isNaN(end)) {
            const step = start <= end ? 1 : -1
            for (let current = start; step > 0 ? current <= end : current >= end; current += step) {
              values.push(`${current}`)
            }
            return
          }
        }
        values.push(segment)
      })
      return values
    },
    normalizeDigits(value) {
      if (typeof value !== 'string') {
        return value
      }
      const persian = '۰۱۲۳۴۵۶۷۸۹'
      const arabic = '٠١٢٣٤٥٦٧٨٩'
      return value
        .replace(/[۰-۹]/g, (digit) => persian.indexOf(digit))
        .replace(/[٠-٩]/g, (digit) => arabic.indexOf(digit))
    },
    isNumericToken(value) {
      if (typeof value !== 'string' || !value) {
        return false
      }
      return /^-?\d+$/.test(value)
    },
    markVariationForDeletion(id) {
      if (!id || this.deletedVariations.some((item) => item.id === id)) {
        return
      }
      this.deletedVariations.push({ id, delete: true })
    },
    normalizeVariationValue(slot, value) {
      if (!slot) {
        return value
      }
      if (slot.mode === 'color') {
        if (!Array.isArray(value)) {
          return []
        }
        return value
          .filter((item) => item !== null && item !== undefined && item !== '')
          .map((item) => {
            const numeric = Number(item)
            return Number.isNaN(numeric) ? item : numeric
          })
      }
      if (value === null || typeof value === 'undefined') {
        return ''
      }
      return value.toString().trim()
    },
    normalizeMedias(list = []) {
      return (list || [])
        .map((item) => {
          if (!item) {
            return ''
          }
          if (typeof item === 'string') {
            return item
          }
          if (typeof item === 'object') {
            return item.path || item.url || ''
          }
          return ''
        })
        .filter(Boolean)
    },
    scheduleComboRefresh() {
      clearTimeout(this.comboTimer)
      this.comboTimer = setTimeout(() => {
        this.regenerateCombinations()
      }, 300)
    },
    regenerateCombinations() {
      const previous = [...this.combinations]
      const activeSlots = this.variationSlots
        .filter((slot) => slot.variation_type_id && slot.items.length)
        .map((slot) => ({
          slot: slot.slot,
          items: slot.items.map((item) => ({
            id: item.id || null,
            client_temp_id: item.id ? item.client_temp_id || null : item.client_temp_id,
          })),
        }))
        .sort((a, b) => a.slot - b.slot)
      if (!activeSlots.length) {
        this.trackDeletedCombinations(previous)
        this.combinations = []
        return
      }
      const existingMap = previous.reduce((acc, combo) => {
        acc[this.comboKey(combo)] = combo
        return acc
      }, {})
      const generated = []
      const traverse = (depth, parts) => {
        if (depth === activeSlots.length) {
          const combo = this.composeComboFromParts(parts)
          const key = this.comboKey(combo)
          generated.push(existingMap[key] ? { ...existingMap[key] } : combo)
          return
        }
        const slot = activeSlots[depth]
        slot.items.forEach((item) => {
          const payload = {
            slot: slot.slot,
            id: item.id,
            client_temp_id: item.id ? null : item.client_temp_id,
          }
          traverse(depth + 1, [...parts, payload])
        })
      }
      traverse(0, [])
      this.trackDeletedCombinations(previous, generated)
      this.combinations = generated
    },
    composeComboFromParts(parts) {
      const combo = {
        variation_1_id: null,
        variation_2_id: null,
        variation_3_id: null,
        variation_1_temp_id: null,
        variation_2_temp_id: null,
        variation_3_temp_id: null,
        stock: this.combinationDefaults.stock,
        price: this.combinationDefaults.price,
        discount: this.combinationDefaults.discount,
        order_point_center: this.combinationDefaults.order_point_center,
        order_point_agency: this.combinationDefaults.order_point_agency,
        client_temp_id: createTempId('combo'),
      }
      parts.forEach((part) => {
        const idKey = `variation_${part.slot}_id`
        const tempKey = `variation_${part.slot}_temp_id`
        if (part.id) {
          combo[idKey] = part.id
          combo[tempKey] = null
        } else if (part.client_temp_id) {
          combo[tempKey] = part.client_temp_id
          combo[idKey] = null
        }
      })
      return combo
    },
    trackDeletedCombinations(previous = [], next = []) {
      const nextKeys = new Set(next.map((combo) => this.comboKey(combo)))
      previous.forEach((combo) => {
        const key = this.comboKey(combo)
        if (combo.id && !nextKeys.has(key)) {
          if (!this.deletedCombinations.some((item) => item.id === combo.id)) {
            this.deletedCombinations.push({ id: combo.id, delete: true })
          }
        }
      })
    },
    comboKey(combo) {
      return [1, 2, 3]
        .map((slot) => combo[`variation_${slot}_id`] || combo[`variation_${slot}_temp_id`] || 'null')
        .join('|')
    },
    prevStep() {
      if (this.activeStep > 1) {
        this.activeStep -= 1
      }
    },
    nextStep() {
      if (this.activeStep < this.steps.length) {
        this.activeStep += 1
      }
    },
    validateForm() {
      const errors = []
      if (!this.form.name) {
        errors.push('نام محصول الزامی است')
      }
      if (!this.selectedCategories.length) {
        errors.push('حداقل یک دسته‌بندی انتخاب کنید')
      }
      if (!this.variationSlots.some((slot) => slot.items.length)) {
        errors.push('حداقل یک مقدار برای ویژگی‌ها مشخص کنید')
      }
      const incompleteColors = this.variationSlots.some(
        (slot) => slot.mode === 'color' && slot.items.some((item) => !Array.isArray(item.value) || !item.value.length)
      )
      if (incompleteColors) {
        errors.push('برای هر رنگ، حداقل یک مقدار از لیست را انتخاب کنید')
      }
      if (!this.combinations.length) {
        errors.push('برای ساخت ترکیب خودکار، ویژگی‌ها را کامل کنید')
      }
      if (this.form.phone_sale && !this.form.prepay_amount) {
        errors.push('برای فروش تلفنی، پیش‌پرداخت لازم است')
      }
      this.summaryErrors = errors
    },
    async handleSave() {
      this.validateForm()
      if (this.summaryErrors.length) {
        this.$toast.error('ابتدا خطاها را برطرف کنید')
        return
      }
      this.saving = true
      const payload = this.buildPayload()
      try {
        const response = this.form.id
          ? await this.$reqApi('/product/easy-update', payload)
          : await this.$reqApi('/product/easy-insert', payload)
        this.applyTempMaps(response)
        this.$toast.success('ذخیره شد')
      } finally {
        this.saving = false
      }
    },
    buildPayload() {
      const variations = this.variationSlots.flatMap((slot) =>
        slot.items.map((item) => ({
          id: item.id,
          client_temp_id: item.client_temp_id,
          variation_type_id: slot.variation_type_id,
          value: this.normalizeVariationValue(slot, item.value),
        }))
      )
      const combos = this.combinations.map((item) => ({
        id: item.id,
        client_temp_id: item.client_temp_id,
        variation_1_id: item.variation_1_id,
        variation_1_temp_id: item.variation_1_temp_id,
        variation_2_id: item.variation_2_id,
        variation_2_temp_id: item.variation_2_temp_id,
        variation_3_id: item.variation_3_id,
        variation_3_temp_id: item.variation_3_temp_id,
        stock: item.stock,
        price: item.price,
        discount: item.discount,
        order_point_center: item.order_point_center,
        order_point_agency: item.order_point_agency,
        minimum: item.minimum,
        maximum: item.maximum,
        warranty: item.warranty,
        warranty_id: item.warranty_id,
      }))
      const medias = this.normalizeMedias(this.form.medias)
      return {
        ...this.form,
        medias,
        category_ids: this.selectedCategories,
        variations: {
          defaults: { ...this.variationDefaults },
          items: [...variations, ...this.deletedVariations],
        },
        variation_combinations: {
          defaults: { ...this.combinationDefaults },
          items: [...combos, ...this.deletedCombinations],
        },
      }
    },
    applyTempMaps(response) {
      const mapVar = response?.variation_temp_map || []
      const mapCombo = response?.combination_temp_map || []
      const varLookup = mapVar.reduce((acc, item) => {
        acc[item.client_temp_id] = item.id
        return acc
      }, {})
      const comboLookup = mapCombo.reduce((acc, item) => {
        acc[item.client_temp_id] = item.id
        return acc
      }, {})
      this.variationSlots.forEach((slot) => {
        slot.items.forEach((item) => {
          if (!item.id && varLookup[item.client_temp_id]) {
            item.id = varLookup[item.client_temp_id]
          }
        })
      })
      this.combinations.forEach((item) => {
        if (!item.id && comboLookup[item.client_temp_id]) {
          item.id = comboLookup[item.client_temp_id]
        }
      })
      this.deletedVariations = []
      this.deletedCombinations = []
    },
  },
}
</script>

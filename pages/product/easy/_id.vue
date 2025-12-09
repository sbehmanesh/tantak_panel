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
              <amp-input text="بارکد" v-model="form.barcode" />
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
            <v-col cols="12">
              <amp-tags v-model="form.tags" text="برچسب‌ها" />
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
                    @chang="(value) => setVariationType({ slot: slot.slot, variation_type_id: value })"
                  />
                </div>
                <v-text-field
                  dense
                  outlined
                  label="افزودن سریع"
                  v-model="slot.quickValue"
                  @keyup.enter="handleQuickAdd(slot)"
                />
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
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-text-field
                dense
                outlined
                label="جستجو"
                v-model="comboFilters.search"
                @input="updateComboFilters({ search: comboFilters.search })"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-switch
                inset
                label="بدون موجودی"
                v-model="comboFilters.missingStock"
                @change="updateComboFilters({ missingStock: comboFilters.missingStock })"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-switch
                inset
                label="دارای تخفیف"
                v-model="comboFilters.hasDiscount"
                @change="updateComboFilters({ hasDiscount: comboFilters.hasDiscount })"
              />
            </v-col>
          </v-row>
          <v-data-table
            :items="filteredCombinations"
            :headers="comboHeaders"
            dense
            disable-pagination
            hide-default-footer
          >
            <template v-slot:item.label="{ item }">
              {{ comboLabel(item) }}
            </template>
            <template v-slot:item.stock="{ item }">
              <amp-input dense is-number :value="item.stock" @input="updateCombinationField({ client_temp_id: item.client_temp_id, field: 'stock', value: $event })" />
            </template>
            <template v-slot:item.price="{ item }">
              <amp-input dense is-price :value="item.price" @input="updateCombinationField({ client_temp_id: item.client_temp_id, field: 'price', value: $event })" />
            </template>
            <template v-slot:item.discount="{ item }">
              <amp-input dense :value="item.discount" @input="updateCombinationField({ client_temp_id: item.client_temp_id, field: 'discount', value: $event })" />
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click="removeCombinationRows([item.client_temp_id])">
                <v-icon color="error" small>delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-stepper-content>
        <v-stepper-content step="4">
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
      { key: 'combinations', label: 'ترکیب‌ها' },
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
    comboFilters: {
      search: '',
      missingStock: false,
      hasDiscount: false,
    },
    comboHeaders: [
      { text: 'ترکیب', value: 'label' },
      { text: 'موجودی', value: 'stock' },
      { text: 'قیمت', value: 'price' },
      { text: 'تخفیف', value: 'discount' },
      { text: '', value: 'actions', sortable: false },
    ],
    comboTimer: null,
    summaryErrors: [],
    variationTypes: [],
    colorOptions: [],
    wholesaleUnits: [],
    brandItems: [],
    prepayTypes: [],
  }),
  computed: {
    filteredCombinations() {
      return this.combinations.filter((combo) => {
        if (this.comboFilters.missingStock && Number(combo.stock || 0) > 0) {
          return false
        }
        if (this.comboFilters.hasDiscount && !combo.discount) {
          return false
        }
        if (this.comboFilters.search) {
          return (
            this.comboLabel(combo).toLowerCase().indexOf(this.comboFilters.search.toLowerCase()) > -1 ||
            JSON.stringify(combo).indexOf(this.comboFilters.search) > -1
          )
        }
        return true
      })
    },
    variationLabels() {
      const map = {}
      this.variationSlots.forEach((slot) => {
        map[slot.slot] = {}
        slot.items.forEach((item) => {
          const key = item.id || item.client_temp_id
          map[slot.slot][key] = item.value
        })
      })
      return map
    },
  },
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
        this.$reqApi('/setting', { filters: { key: 'variation_type' }, paginate_num: 0 }),
        this.$reqApi('/setting', { filters: { key: 'product_colors' }, paginate_num: 0 }),
        this.$reqApi('/setting', { filters: { key: 'wholesale_unit' }, paginate_num: 0 }),
        this.$reqApi('/brand', { paginate_num: 0 }),
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
      const response = await this.$reqApi('/category', { paginate_num: 0 })
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
      this.selectedCategories =
        product.category_ids || (product.categories || []).map((cat) => cat.id)
      if (product.variations) {
        this.loadVariations(product.variations)
      }
      if (product.variation_combinations) {
        this.combinations = this.normalizeCombinations(product.variation_combinations)
      }
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
      const items = Array.isArray(payload.items || payload) ? payload.items || payload : payload.items
      ;(items || []).forEach((item) => {
        const slotIndex = item.variation_type?.sort || 1
        const slot = slots[slotIndex - 1]
        if (!slot) {
          return
        }
        slot.variation_type_id = item.variation_type_id
        slot.mode = item.variation_type?.value_2 === 'product_colors' ? 'color' : 'text'
        slot.items.push({
          id: item.id,
          client_temp_id: item.client_temp_id || createTempId('var'),
          value: this.parseValue(item.value),
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
      const map = {}
      list.forEach((item) => {
        map[item.id] = { ...item, children: [] }
      })
      const roots = []
      list.forEach((item) => {
        const parentId = item.parent_id || item.parent_category_id
        if (parentId && map[parentId]) {
          map[parentId].children.push(map[item.id])
        } else {
          roots.push(map[item.id])
        }
      })
      return roots
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
      target.variation_type_id = variation_type_id
      target.mode = type && type.value_2 === 'product_colors' ? 'color' : 'text'
    },
    addVariationValue({ slot, value }) {
      const target = this.variationSlots.find((item) => item.slot === slot)
      if (!target || value === undefined || value === null || value === '') {
        return
      }
      target.items.push({
        client_temp_id: createTempId(`var${slot}`),
        value,
        barcode: '',
        images: [],
      })
      this.variationSlots = [...this.variationSlots]
    },
    handleQuickAdd(slot) {
      if (!slot.quickValue) {
        return
      }
      this.addVariationValue({ slot: slot.slot, value: slot.quickValue })
      slot.quickValue = ''
    },
    updateVariationValue({ slot, id, patch }) {
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
      target.items = target.items.filter(
        (item) => item.client_temp_id !== id && item.id !== id
      )
      this.variationSlots = [...this.variationSlots]
    },
    scheduleComboRefresh() {
      clearTimeout(this.comboTimer)
      this.comboTimer = setTimeout(() => {
        this.regenerateCombinations()
      }, 300)
    },
    regenerateCombinations() {
      const slots = this.variationSlots
        .filter((slot) => slot.variation_type_id && slot.items.length)
        .map((slot) => ({
          slot: slot.slot,
          items: slot.items,
        }))
      if (!slots.length) {
        this.combinations = []
        return
      }
      const existingMap = {}
      this.combinations.forEach((combo) => {
        existingMap[this.comboKey(combo)] = combo
      })
      const lists = slots.map((slot) =>
        slot.items.map((item) => ({
          slot: slot.slot,
          id: item.id,
          client_temp_id: item.client_temp_id,
        }))
      )
      const cartesian = lists.reduce(
        (acc, list) => acc.flatMap((x) => list.map((y) => [...x, y])),
        [[]]
      )
      this.combinations = cartesian.map((parts) => {
        const combo = {
          variation_1_id: null,
          variation_2_id: null,
          variation_3_id: null,
          variation_1_temp_id: null,
          variation_2_temp_id: null,
          variation_3_temp_id: null,
          stock: 0,
          price: null,
          discount: null,
          client_temp_id: createTempId('combo'),
        }
        parts.forEach((part) => {
          const idKey = `variation_${part.slot}_id`
          const tempKey = `variation_${part.slot}_temp_id`
          if (part.id) {
            combo[idKey] = part.id
          } else {
            combo[tempKey] = part.client_temp_id
          }
        })
        const key = this.comboKey(combo)
        return existingMap[key] ? { ...existingMap[key] } : combo
      })
    },
    comboKey(combo) {
      return [1, 2, 3]
        .map((slot) => combo[`variation_${slot}_id`] || combo[`variation_${slot}_temp_id`] || 'null')
        .join('|')
    },
    comboLabel(combo) {
      return [1, 2, 3]
        .map((slot) => {
          const map = this.variationLabels[slot] || {}
          const key = combo[`variation_${slot}_id`] || combo[`variation_${slot}_temp_id`]
          return key ? map[key] || `Slot ${slot}` : null
        })
        .filter(Boolean)
        .join(' / ')
    },
    updateComboFilters(filters) {
      this.comboFilters = { ...this.comboFilters, ...filters }
    },
    updateCombinationField({ client_temp_id, field, value }) {
      const target = this.combinations.find((item) => item.client_temp_id === client_temp_id)
      if (!target) {
        return
      }
      target[field] = value
      target.dirty = true
    },
    removeCombinationRows(ids) {
      this.combinations = this.combinations.filter((item) => !ids.includes(item.client_temp_id))
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
      if (!this.combinations.length) {
        errors.push('ترکیب‌ها را تولید کنید')
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
          value: item.value,
          barcode: item.barcode,
          images: (item.images || []).map((path) => ({ path })),
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
        minimum: item.minimum,
        maximum: item.maximum,
        warranty: item.warranty,
        warranty_id: item.warranty_id,
      }))
      return {
        ...this.form,
        category_ids: this.selectedCategories,
        variations: { items: variations },
        variation_combinations: { items: combos },
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
    },
  },
}
</script>

<template>
  <amp-autocomplete
    v-model="internalValue"
    :text="text"
    :rules="rules"
    :items="cityItems"
    :loading="loading"
    :placeholder="placeholder || 'انتخاب کنید...'"
    :readonly="readonly"
    :disabled="disabled"
    :help_text="help_text"
    :class="['country-division-autocomplete', { disabled: disabled || readonly }]"
  />
</template>

<script>
export default {
  name: 'CountryDivisionCityAutocomplete',
  props: {
    value: null,
    text: {
      type: String,
      default: '',
    },
    rules: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    help_text: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cityItems: [],
      loading: false,
      fetchedSource: null,
      internalValue: this.modelValue,
    }
  },
  computed: {
    apiType() {
      const value = this.modelValue
      const numericString =
        typeof value === 'string' && /^\d+$/.test(value)
      if (
        (typeof value === 'number' && Number.isFinite(value)) ||
        numericString
      ) {
        return 'tipax'
      }
      return 'country'
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        this.internalValue = value
      },
      immediate: true,
    },
    internalValue(value) {
      this.$emit('update:modelValue', value)
    },
    apiType: {
      handler(newSource) {
        this.loadItems(newSource)
      },
      immediate: true,
    },
  },
  methods: {
    async loadItems(source) {
      if (!source) {
        this.cityItems = []
        this.fetchedSource = null
        this.loading = false
        return
      }
      if (this.fetchedSource === source && this.cityItems.length) {
        return
      }
      this.loading = true
      this.fetchedSource = null
      try {
        if (source === 'tipax') {
          const cities = await this.$reqApi('shop/tipax/get-cities', {})
          this.cityItems = this.mapTipaxCities(cities)
        } else {
          const response = await this.$reqApi('shop/country-division', {
            row_number: 1000,
          })
          this.cityItems = this.mapCountryDivisionCities(response)
        }
        this.fetchedSource = source
      } catch (error) {
        this.cityItems = []
        this.fetchedSource = null
      } finally {
        this.loading = false
      }
    },
    mapTipaxCities(list) {
      const cities = Array.isArray(list) ? list : []
      return cities.map((city) => ({
        text: city.title || city.name || city.id || '',
        value: city.id ?? city.value ?? null,
      }))
    },
    mapCountryDivisionCities(response) {
      const list = Array.isArray(response?.model?.data)
        ? response.model.data
        : Array.isArray(response?.data)
        ? response.data
        : []
      const lookup = list.reduce((acc, entry) => {
        if (entry?.id) {
          acc[entry.id] = entry
        }
        return acc
      }, {})
      return list
        .filter((entry) => entry?.level === 'city')
        .map((city) => {
          const province = lookup[city.parent_id]
          const provinceName = province?.name || province?.title || ''
          const label = provinceName
            ? `${provinceName} - ${city.name || city.title || city.id}`
            : city.name || city.title || city.id
          return {
            text: label,
            value: city.id ?? city.value ?? null,
          }
        })
        .sort((a, b) => a.text.localeCompare(b.text))
    },
  },
}
</script>

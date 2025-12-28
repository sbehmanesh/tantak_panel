<template>
  <div>
    <v-text-field v-model="longitude" :rules="ruleItem" v-show="false" />
    <amp-labale text="ثبت موقعیت" :required="required" />
    <amp-button
      block
      height="40px"
      rules="require"
      text="ثبت موقعیت جفرافیایی"
      @click="openSelectLocation()"
    />
    <v-dialog v-model="dialog" width="800px">
      <v-card v-if="dialog" class="pa-3">
        <v-row dense class="mb-3">
          <v-col cols="12" md="8">
            <amp-input
              v-model="searchQuery"
              :loading="searchLoading"
              text="جستجو (فارسی)"
              prepend-inner-icon="search"
              hide-details
              dense
            />
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-center">
            <amp-button
              block
              text="جستجو روی نقشه"
              color="primary"
              :loading="searchLoading"
              :disabled="!searchQuery || searchLoading || disabled"
              @click="searchLocation"
            />
          </v-col>
          <v-col cols="12" v-if="searchResults.length">
            <v-autocomplete
              v-model="selectedSearchResult"
              :items="searchResults"
              item-text="text"
              item-value="value"
              label="نتایج جستجو"
              hide-details
              dense
              clearable
              :disabled="disabled"
            />
          </v-col>
        </v-row>
        <div>
          <div id="map-location"></div>
        </div>
        <div class="py-3">
          <hr />
        </div>
        <div class="text-center">
          <amp-button text="بستن" color="error" @click="closeDialog()" />
          <amp-button
            text="حذف"
            color="error"
            :disabled="disabled"
            @click="deleteItem()"
          />
          <amp-button
            text="تایید"
            color="success"
            @click="submit()"
            :disabled="disabled"
          />
        </div>

        <MapTools
          @goTo="goTo"
          :disabled="disabled"
          @getTileLayer="changeTileLayer"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import L from 'leaflet'
import MapTools from '@/components/Base/MapTools.vue'
export default {
  components: { MapTools },
  props: {
    value: {
      require: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rules: {
      default: '',
    },
  },
  data: () => ({
    map: null,
    marker: null,
    latitude: '',
    ruleItem: [],
    tileLayer: {},
    dialog: false,
    longitude: '',
    required: false,
    center: [35.68351380631503, 51.389574711981815],
    searchQuery: '',
    searchLoading: false,
    searchResults: [],
    selectedSearchResult: null,
  }),
  watch: {
    dialog(value) {
      if (value) {
        setTimeout(() => {
          this.loadMap()
        }, 200)
      } else {
        this.mapDestroy()
      }
    },
    latitude() {
      this.addMarket()
    },
    longitude() {
      this.addMarket()
    },
    value(value) {
      if (Array.isArray(value) && value[1]) {
        this.latitude = value[0]
        this.longitude = value[1]
      }
    },
    selectedSearchResult(newValue) {
      if (newValue && newValue.lat && newValue.long) {
        this.latitude = newValue.lat
        this.longitude = newValue.long
        this.focusMapOnPoint(newValue.lat, newValue.long)
      }
    },
  },
  mounted() {
    this.loadTileLayer()
    this.setRules()
  },
  beforeDestroy() {
    this.mapDestroy()
  },
  methods: {
    closeDialog() {
      this.dialog = false
    },
    openSelectLocation() {
      this.dialog = true
    },
    async searchLocation() {
      if (!this.searchQuery || this.searchLoading) {
        return
      }
      this.searchLoading = true
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&accept-language=fa&limit=5&q=${encodeURIComponent(
          this.searchQuery
        )}`
        const response = await fetch(url, {
          headers: { 'Accept-Language': 'fa' },
        })
        const json = await response.json()
        const results = Array.isArray(json) ? json : []
        this.searchResults = results.map((item) => ({
          text: item.display_name,
          value: `${item.lat},${item.lon}`,
          lat: parseFloat(item.lat),
          long: parseFloat(item.lon),
        }))
        if (this.searchResults.length) {
          const first = this.searchResults[0]
          this.selectedSearchResult = first
          this.latitude = first.lat
          this.longitude = first.long
          this.focusMapOnPoint(first.lat, first.long)
        } else {
          this.$toast.error('موردی یافت نشد')
        }
      } catch (error) {
        this.$toast.error('خطا در جستجوی موقعیت')
      } finally {
        this.searchLoading = false
      }
    },
    deleteItem() {
      this.latitude = ''
      this.longitude = ''
      this.submit()
    },
    submit() {
      this.$emit('input', [this.latitude, this.longitude])
      this.dialog = false
    },
    setRules() {
      this.ruleItem = []
      let inpRules = this.$inpRules()
      if (typeof this.rules == 'string') {
        this.rules.split(',').forEach((element) => {
          if (typeof inpRules[element] != 'undefined') {
            if (element == 'require') {
              this.required = true
            }
            this.ruleItem.push(inpRules[element])
          }
        })
      } else if (typeof this.rules == 'function') {
        this.ruleItem.push(this.rules)
      }
    },
    mapDestroy() {
      if (this.map) {
        this.map.remove()
      }
      this.map = null
    },
    loadMap() {
      if (this.map != null || this.dialog == false) {
        return
      }
      let center = [...this.center]
      if (this.latitude) {
        center[0] = this.latitude
      }
      if (this.longitude) {
        center[1] = this.longitude
      }
      this.map = L.map('map-location').setView(this.center, 15)
      this.changeTileLayer('googleStreets')
      setTimeout(() => {
        this.addMarket()
      }, 100)
      this.map.on('click', (e) => {
        if (this.disabled) {
          return
        }
        if (e.latlng && e.latlng.lat) {
          this.latitude = e.latlng.lat
          this.longitude = e.latlng.lng
        }
      })
    },
    addMarket() {
      if (this.marker) {
        this.marker.remove()
      }
      if (this.map == null) {
        return
      }
      if (this.latitude) {
        this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map)
        this.map.panTo(new L.LatLng(this.latitude, this.longitude))
      } else {
        this.map.setView(this.center, 15)
      }
    },
    goTo(point) {
      this.latitude = point[0]
      this.longitude = point[1]
    },
    changeTileLayer(key) {
      if (!this.map || !this.tileLayer[key]) {
        return
      }
      Object.values(this.tileLayer).forEach((layer) => {
        if (layer && this.map.hasLayer(layer)) {
          this.map.removeLayer(layer)
        }
      })
      this.map.addLayer(this.tileLayer[key])
    },
    loadTileLayer() {
      this.tileLayer = {
        googleStreets: L.tileLayer(
          'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          {
            zoom: 10,
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        ),
        googleHybrid: L.tileLayer(
          'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          {
            zoom: 10,
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        ),
      }
    },
    focusMapOnPoint(lat, long) {
      if (this.map) {
        this.map.setView([lat, long], 15)
        this.addMarket()
      }
    },
  },
}
</script>

<style>
#map-location {
  width: 100%;
  height: 500px;
}
</style>

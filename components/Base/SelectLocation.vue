<template>
  <div>
    <v-card v-if="dialog" class="pa-3">
      <div>
        <div  id="map2-location"></div>
      </div>
      <div class="py-3">
        <hr />
      </div>
      <div class="text-center">
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
  </div>
</template>

<script>
import L from 'leaflet'
import MapTools from '@/components/Base/MapTools'
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
    dialog: true,
    longitude: '',
    required: false,
    center: [35.68351380631503, 51.389574711981815],
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
  },
  mounted() {
    this.loadTileLayer()
    this.setRules()
    this.loadMap()
  },
  beforeDestroy() {
    this.mapDestroy()
  },
  methods: {
    deleteItem() {
      this.latitude = ''
      this.longitude = ''
      this.submit()
    },
    submit() {
      this.$emit('input', [this.latitude, this.longitude])
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
      this.map = L.map('map2-location').setView(this.center, 15)
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
      this.map.removeLayer(this.tileLayer.googleStreets)
      this.map.removeLayer(this.tileLayer.googleHybrid)
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
  },
}
</script>

<style>
#map2-location {
  width: 100%;
  height: 500px;
  z-index: 0;
}
</style>

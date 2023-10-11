<template>
  <v-expansion-panels class="pa-3">
    <v-expansion-panel>
      <v-expansion-panel-header color="primary" class="white--text">
        امکانات
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row dense>
          <v-col cols="12">
            <amp-section text="لایه ها" />
          </v-col>
          <v-col cols="12">
            <v-chip
              label
              outlined
              class="mx-1"
              color="success"
              @click="changeTileLayer('googleStreets')"
            >
              نمایی خیابان
            </v-chip>
            <v-chip
              label
              outlined
              color="success"
              @click="changeTileLayer('googleHybrid')"
            >
              نمایی ماهواره ای
            </v-chip>
            <v-chip
              label
              outlined
              color="success"
              @click="getCurrentPosition()"
            >
              مکان شما
            </v-chip>
          </v-col>
        </v-row>
        <v-form v-if="showGoto" v-model="cForm.valid" @submit.prevent="changeCenter()">
          <v-row dense>
            <v-col cols="12">
              <amp-section text="تغییر مکان" />
            </v-col>
            <v-col cols="12" md="3">
              <amp-input
                cClass="ltr-item"
                v-model="cForm.lat"
                text="طول جغرافیایی"
                rules="require,number_float"
              />
            </v-col>
            <v-col cols="12" md="3">
              <amp-input
                cClass="ltr-item"
                v-model="cForm.long"
                text="عرض جغرافیایی"
                rules="require,number_float"
              />
            </v-col>
            <v-col cols="12" md="3" class="center-div pt-2 mt-2 mr-5">
              <amp-button
                text="تایید"
                type="submit"
                color="success"
                :disabled="!cForm.valid || disabled"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-form
          ref="formAddPolygon"
          v-if="canAddPolygon"
          v-model="pForm.valid"
          @submit.prevent="addPolygon()"
        >
          <v-row dense>
            <v-col cols="12">
              <amp-section text="ثبت پولیگان" />
            </v-col>
            <v-col cols="12" v-for="(item, index) in pForm.items" :key="index">
              <v-row dense>
                <v-col cols="5">
                  <amp-input
                    cClass="ltr-item"
                    v-model="item['lat']"
                    text="طول جغرافیایی"
                    rules="require,number_float"
                  />
                </v-col>
                <v-col cols="5">
                  <amp-input
                    cClass="ltr-item"
                    v-model="item['long']"
                    text="عرض جغرافیایی"
                    rules="require,number_float"
                  />
                </v-col>
                <v-col cols="2" class="center-div">
                  <v-icon color="error" @click="removePolygonItem(index)">
                    delete
                  </v-icon>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pr-4">
              <v-icon size="30" color="success" @click="addPolygonItem()">
                add_circle
              </v-icon>
            </v-col>
            <v-col cols="12" class="center-div pt-4">
              <amp-button
                type="submit"
                color="success"
                text="ثبت پولیگان"
                :disabled="!pForm.valid || disabled"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },showGoto: {
      type: Boolean,
      default: true,
    },
    canAddPolygon: { type: Boolean, default: false },
  },
  data: () => ({
    cForm: { lat: '', long: '', valid: false },
    pForm: {
      valid: false,
      items: [
        { lat: '', long: '' },
        { lat: '', long: '' },
        { lat: '', long: '' },
      ],
    },
    loading: false,
  }),
  methods: {
    changeTileLayer(key) {
      this.$emit('getTileLayer', key)
    },
    getCurrentPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.successCurrentPosition,
          this.errorCurrentPosition
        )
      }
    },
    successCurrentPosition(location) {
      this.$emit('goTo', [location.coords.latitude, location.coords.longitude])
    },
    errorCurrentPosition(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.$toast.error('اجازه درسترسی به موقعیت مکانی داده نشده')
          break
        case error.POSITION_UNAVAILABLE:
          this.$toast.error('موقعیت مکانی در دسترس نیست')
          break
        case error.TIMEOUT:
          this.$toast.error('موقعیت مکانی در دسترس نیست')
          break
        case error.UNKNOWN_ERROR:
          this.$toast.error('خطا در دریافت موقعیت مکانی')
          break
      }
    },
    changeCenter() {
      if (
        !this.$checkNotNull(this.cForm.lat) ||
        !this.$checkNotNull(this.cForm.long)
      ) {
        this.$toast.error('اطلاعات درست وارد نشده')
        return
      }
      this.$emit('goTo', [this.cForm.lat, this.cForm.long])
    },
    addPolygon() {
      this.loading = true
      let items = [...this.pForm.items]
      if (items.length < 3) {
        this.$toast.error('حداقل سه نقطه')
        return
      }
      this.$emit('addPolygon', items)
      try {
        this.$refs.formAddPolygon.reset()
      } catch (error) {}
    },
    addPolygonItem() {
      this.loading = true
      let items = [...this.pForm.items, { lat: '', long: '' }]
      this.pForm = {
        items,
        valid: false,
      }
    },
    removePolygonItem(index) {
      let items = this.pForm.items.filter((x, i) => i != index)
      this.pForm = {
        items,
        valid: false,
      }
    },
  },
}
</script>

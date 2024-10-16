<!-- components/Qrcode.vue -->
<template>
  <v-row v-if="barcode"  class="justify-center align-center">
    <qrcode
      :value="`https://test-api.tantak.ir/${barcode}`"
      :options="{
        color: {
          dark: '#4f5356',
          light: '#ffffff',
        },
        width: width,
      }"
    ></qrcode>
  
  </v-row>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
  components: {
    qrcode: VueQrcode,
  },
  props: {
    barcode: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "75",
    },
  },

  beforeMount() {},
};
</script>

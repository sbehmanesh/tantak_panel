<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card class="elevation-0 pa-4" style="overflow: hidden !important">
        <v-row class="mx-2 mt-1 align-center mb-4">
          <h1 class="font_15 mr-2">بدهکاری های سفارش</h1>
          <v-spacer></v-spacer>
          <v-btn icon text @click="closeDialog">
            <v-icon class="mr-3"> cancel </v-icon>
          </v-btn>
          <v-col cols="12">
          <v-divider v-for="i in 3" :key="i"></v-divider>
        </v-col>
        </v-row>
    
        <v-card
          v-for="(item, index) in items"
          :key="index"
          class="ma-2 mx-4 pa-4 elevation-1" outlined
        >
          <h1 class="font_14">{{ index + 1 }} - {{ item.name }}</h1>
          <div class="d-flex my-2">
            <small>قیمت : {{ $price(item.base_price) }} ریال</small>
            <v-spacer />
            <small>
              تعداد :‌
              {{ item.count }}
            </small>
            <v-spacer />
            <small>
              قیمت کل :‌
              {{ $price(item.base_price) }} ریال
            </small>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },

    logs: {
      default: [],
      type: Array,
    },
  },
  data() {
    return {
      now: "",
      items: [],
    };
  },
  mounted() {
    this.items = [...this.logs];
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>


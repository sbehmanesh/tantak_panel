<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card class="elevation-0 pa-6" style="overflow: hidden !important">
        <v-card class="d-flex align-center pa-3 mb-7 border-card">
          <v-spacer></v-spacer>
          <strong class="font_18"> موجودی های سفارش </strong>
          <v-spacer></v-spacer>
          <v-btn icon text @click="cloasDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-card>

        <v-card
          class="elevation-1 pa-4  border-card mt-3"
          v-for="(item, index) in items"
          :key="index"
        >
          <h1 class="font_17"> {{ index+1 }} - {{ item.name }}</h1>
          <div class="d-flex mt-3">
            <h1>قیمت : {{ $price(item.base_price) }} ریال</h1>
            <v-spacer />
            <h1>
              تعداد :‌
              {{ item.count }}
            </h1>
            <v-spacer />
            <h1>
              قیمت کل :‌
              {{ $price(item.base_price) }} ریال
            </h1>
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

    data: {
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
    this.items = this.data;
  },
  methods: {
    cloasDialog() {
      this.$emit("cloasDialog");
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 18px;
}
h1 {
  font-size: 12px;
}
.border-card{
    border: 1px solid #0000006b;
}
</style>

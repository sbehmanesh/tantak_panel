<template>
  <v-card
    :class="sizeCard == 'small' ? 'pa-5 elevation-0' : 'pa-15 elevation-1'"
    :outlined="sizeCard == 'small' ? false : true"
  >
    <v-col cols="12" class="d-flex align-center" v-if="sizeCard != 'small'">
      <v-divider style="border: 1px dashed #bababa"></v-divider>
      <h1 class="mx-4 font_17 text-center">
        محصول مورد نظر را انتخاب کنید
        <br />
        <small class="grey--text"> محصولات غیر سیستمی </small>
      </h1>
      <v-divider style="border: 1px dashed #bababa"></v-divider>
    </v-col>
    <v-row class="justify-center mt-6">
      <v-col cols="12">
        <amp-autocomplete
          multiple
          v-model="not_system_product_ids"
          :items="datas"
        />
      </v-col>
    </v-row>
    <!-- <amp-autocomplete
          rules="require"
          multiple
          v-model="not_system_product_ids"
          :items="datas"
        /> -->
    <v-row class="d-flex align-center" v-if="not_system_product_ids.length > 0">
      <v-col
        cols="12"
        :md="sizeCard == 'small' ? '6' : '4'"
        v-for="(x, i) in list_items"
        :key="i"
      >
        <v-card class="text-center" width="100%" outlined>
          <v-col cols="12" class="text-center elevation-1">
            <h1>
              {{ x.text }}
            </h1>
          </v-col>
          <v-col cols="12">
            <amp-input
              text="تعداد محصول"
              cClass="ltr-item"
              v-model="x.number"
              rules="require,number"
            ></amp-input>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-col
      cols="12"
      class="text-center mt-6"
      v-if="not_system_product_ids.length == 0"
    >
      <v-icon size="65" color="grey lighten-1">
        production_quantity_limits</v-icon
      >
      <h1>محصولی انتخاب نشده</h1>
    </v-col>
  </v-card>
</template>
<script>
export default {
  components: {},
  props: {
    loadItems: {
      require: false,
    },
    datas: {
      default: [],
      type: Array,
    },
    sizeCard: {
      default: "normal",
      type: String,
    },
  },
  data: () => ({
    step: 1,
    package_id: "",
    product_id: "",
    not_system_product_ids: [],
    list_items: [],
  }),
  watch: {
    not_system_product_ids: {
      deep: true,
      handler() {
        let items = [];
        for (let i = 0; i < this.not_system_product_ids.length; i++) {
          const x = this.not_system_product_ids[i];
          let find = this.datas.find((y) => y.value == x);
          if (Boolean(find)) {
            find["number"] = "1";
            items.push(find);
          }
        }
        this.list_items = items;
      },
    },
  },
  mounted() {

    if (this.loadItems && this.loadItems.length > 0) {
      this.not_system_product_ids = this.loadItems;
    }
  },
  methods: {
    callSubmit() {
      let items = [];
      this.list_items.map((x) => {
        items.push({
          id: x.value,
          number: x.number,
        });
      });

      this.$emit("selectedIItems", items);
      this.$emit("selectedIItemsShow", this.list_items);
    },
  },
};
</script>

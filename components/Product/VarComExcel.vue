<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card class="d-flex align-center card-style justify-center">
        <div class="text-center">
          <v-progress-circular
            class="pa-5"
            :rotate="360"
            :size="130"
            :width="13"
            :value="value"
            color="#13945f"
          >
            <div v-if="!loading">
              <v-icon
                v-if="total_data.length == total_length"
                size="45"
                color="#13945f"
              >
                task_alt
              </v-icon>
              <div v-else>
                <small class="grey--text"> بارگیری اکسل</small>
                <br />
                <v-icon color="grey" size="22"> download </v-icon>
                <br />
                <small class="white--text">
                  {{ status_request }}
                </small>
              </div>
            </div>
            <div v-if="loading">
              <small class="grey--text"> در حال آماده سازی برای بارگیری </small>
              <br />
              <v-icon color="grey" small> hourglass_top </v-icon>
            </div>
          </v-progress-circular>
          <v-col cols="12" class="text-center">
            <v-btn @click="closeDialog" color="white" text>
              بستن / انصراف
            </v-btn>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      page_number: 1,
      total_length: "0",
      value: 0,
      end: false,
      last_page: 10000000,
      total_data: [],
      excel_hed: [
        { text: "نام محصول", value: "name" },
        { text: " رنگ", value: "var_1" },
        { text: " سایز ", value: "var_2" },
        { text: "کیفیت", value: "var_3" },
        { text: "full_barcode", value: "barcode" },
        {
          text: " قیمت",
          value: (body) => {
            return body.price;
          },
        },
        { text: "number_add_product", value: "count" },
      ],
    };
  },

  watch: {
    total_data: {
      deep: true,
      handler() {
        this.value = (this.total_data.length * 100) / this.total_length;
      },
    },
  },
  computed: {
    status_request() {
      return `
 ${this.total_length}
          /
                    ${this.total_data.length}
                    `;
    },
  },
  beforeMount() {
    this.getVarComs();
  },
  methods: {
    getVarComs() {
      if (Boolean(this.end)) {
        return;
      }
      if (this.last_page < this.page_number) {
        this.total_data.length = this.total_length;
        this.value = 100;
        let file_name = "ویژگی های محصولات تنتاک";
        this.$exportCSV(this.excel_hed, this.total_data, file_name);
        return;
      }

      this.$reqApi("/product-variation-combination", {
        paginate: true,
        row_number: 346,
        paginate_num: 346,
        page: this.page_number,
      })
        .then((res) => {
          this.last_page = res.model.last_page;

          this.total_length = res.model.total;
          if (res.model.data.length > 0) {
            this.getSortData(res.model.data);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getSortData(data) {
      return new Promise((resolve, reject) => {
        let items = [];

        try {
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            let var_1 = "";
            let var_2 = "";
            let var_3 = "";
            let name = "";
            if (Boolean(x.variation1.product)) {
              name = x.variation1.product.name;
              var_1 = x.variation1.colors
                ? x.variation1.colors
                : x.variation1.value;
            }

            if (Boolean(x.variation2.product)) {
              name = x.variation2.product.name;
              var_2 = x.variation2.value;
            }
            if (Boolean(x.variation3.product)) {
              name = x.variation3.product.name;
              var_3 = x.variation3.value;
            }
            let price = Boolean(x.variation1)
              ? x.variation1.product.base_price
              : x.price;

            items.push({
              name: name,
              var_1: var_1,
              var_2: var_2,
              var_3: var_3,
              count: "",
              barcode: x.full_barcode,
              price: this.$price(price),
            });
          }
        } catch (error) {}

        resolve(items);
      })
        .then((response) => {
          this.total_data = [...this.total_data, ...response];

          this.page_number++;
          this.getVarComs();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.end = true;
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.card-style {
  background-color: rgba(0, 0, 0, 0.74) !important;
}
</style>

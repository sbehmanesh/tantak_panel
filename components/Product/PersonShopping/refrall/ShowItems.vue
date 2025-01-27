<template>
  <v-dialog v-model="dialog" width="520" persistent>
    <v-card class="pa-4 py-6">
      <div class="pa-2 py-5" style="border: 7px double #8585858a">
        <v-col cols="12" class="d-flex align-top">
          <h1 class="font_16">
            جزییات
            <br />
            <small>
              مجموع قیمت
              {{ $price(items.total_price) }} ریال
            </small>
            <br />
            <small
              class="grey--text"
              style="border-bottom: 1px solid #8585858a"
            >
              شماره فاکتور
              {{ items.factor_number }}
            </small>
          </h1>

          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon color="grey"> cancel </v-icon>
          </v-btn>
        </v-col>
        <v-col v-if="loading" class="text-center my-10" cols="12">
          <v-progress-circular
            :size="30"
            :width="4"
            indeterminate
            color="grey"
          />
        </v-col>
        <v-col cols="12" v-if="!loading">
          <div v-for="(x, i) in items.return_factory_items" :key="i">
            <v-card
              style="border-right: 4px solid #8585858a"
              class="elevation-1 my-4 pa-4"
              outlined
            >
              <h1>
                <small>
                  {{ x.name }}
                </small>
             
              </h1>
              <div class="d-flex justify-space-between align-center grey--text">
                <h1>
                  <small> تعداد {{ x.number }} عدد </small>
                </h1>
                <h1>
                  <small> جمع کل {{ $price(x.price) }} ریال </small>
                </h1>
              </div>
            </v-card>
          </div>
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    modelId: {
      default: "",
    },
    dialog: {
      default: false,
    },
  },
  data: () => ({
    valid: true,
    loading: false,
    items: [],
  }),
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      this.$reqApi("return-factory/show", { id: this.modelId })
        .then((res) => {
          this.items = res.model;
          this.loading = false;
        })
        .catch((err) => {
          this.closeDialog();
        });
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form["return_product_id"] = this.data.id;
      this.$reqApi("return-product/change-status", form)
        .then((res) => {
          this.loading = false;
          this.$emit("reload");
          this.closeDialog();
          this.$toast.success("عملیات با موفقیت انجام شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

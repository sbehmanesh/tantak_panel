<template>
  <v-dialog v-model="dialog" persistent max-width="1000">
    <v-card style="overflow: hidden !important" class="pa-2">
      <div class="card-style pa-4 pt-7">
        <v-row class="d-flex align-center px-3">
          <h1 class="font_16">ثبت قرعه کشی</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <amp-input
              text="تعداد افراد جشنواره"
              v-model="form.people_number_use"
              rules="number,number"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-jdate
              text="زمان قرعه کشی"
              :is-number="true"
              v-model="form.time"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-select
              text="وضعیت"
              v-model="form.status"
              :items="$store.state.static.status"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              text="ترتیب"
              v-model="form.sort"
              rules="number,number"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols>
            <amp-textarea
              text="توضیحات"
              v-model="form.description"
              rules="require"
            />
          </v-col>
        </v-row>
        <v-row class="align-center justify-center">
          <v-col cols="12">
            <FestivalAwards
              v-if="products.length > 0 && package.length > 0"
              :products="products"
              :package="package"
              :load-items=load_items
              @selectedIItems="selectedIItems($event)"
              ref="FestivalAwards"
            />
          </v-col>
        </v-row>
        <v-col cols="12" class="text-center">
          <amp-button
            large
            icon="done"
            class="my-1"
            @click="submit"
            color="success"
            :text="itemId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import FestivalAwards from "@/components/Product/Festival/FestivalAwards.vue";
export default {
  components: { FestivalAwards },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    festivalId: {
      type: String,
      default: "",
    },
    itemId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      createUrl: "/lottery/insert",
      updateUrl: "/lottery/update",
      showUrl: "/lottery/show",
      only_price: false,
      products: [],
      package: [],
      load_items: {},
      form: {
        product_items: [],
        package_items: [],
      },
    };
  },
  mounted() {
    this.loadPackages();
    this.loadProduct();
    if (this.itemId) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.$refs.FestivalAwards.callSubmit();
    },
    selectedIItems(event) {
      this.form.package_items = event.packages;
      this.form.product_items = event.products;
      let form = { ...this.form };
      form["festival_id"] = this.festivalId;
      this.loading = true;
      let url = this.createUrl;
      if (this.itemId) {
        url = this.updateUrl;
        form["id"] = this.itemId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.itemId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.closeDialog();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.itemId })
        .then(async (response) => {
          let data = response.data;
          for (let i in data) {
            this.form[i] = data[i];
          }
          if (Boolean(data.packages) && data.packages.length > 0) {
            this.load_items["packages"] = data.packages
          }   
             if (Boolean(data.products) && data.products.length > 0) {
            this.load_items["products"] = data.products
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadPackages() {
      let filter = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      this.$reqApi("/package", { filters: filter, row_number: 2000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.package = items;
        })
        .catch((error) => {});
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.card-style {
  border: 9px double #919191 !important;
}
</style>

<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row class="d-flex justify-center mb-6"> </v-row>
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="3">
          <amp-input text="عنوان پکیج" v-model="form.name" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="نرخ (ریال)"
            v-model="form.price"
            is-price
            cClass="ltr-item"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            :items="$store.state.static.status"
            text="وضعیت"
            rules="require"
            v-model="form.status"
          />
        </v-col>

        <v-col cols="12" md="2">
          <AmpUploadFile title="بارگذاری تصویر" v-model="form.logo" />
        </v-col>

        <v-col cols="12" md="2">
          <amp-input text="ترتیب" v-model="form.sort" cClass="ltr-item" rules="number" />
        </v-col>
        <v-col cols="12" md="12">
          <amp-textarea text="توضیحات" v-model="form.description"></amp-textarea>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="12">
          <SelectVariation
            ref="GetVariatonsId"
            @variation_array="getVariationIds($event)"
            :productVarcoms="product_varcoms"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button
            large
            icon="redo"
            class="my-1"
            color="error"
            text="انصراف"
            @click="redirectPage()"
          />
          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import SelectVariation from "@/components/Product/SelectVariation.vue";
export default {
  components: {
    SelectVariation,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/package/insert",
    updateUrl: "/package/update",
    showUrl: "/package/show",
    product_varcoms: [],
    variations: [],
    selected: {},

    product_varcomb_id: "",
    products: [],

    form: {
      sort: 1,
      logo: "",
      price: "",
      name: "",
      status: "active",
      description: "",
      product_varcom_ids: [],
    },
  }),

  beforeMount() {},
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      this.$refs.GetVariatonsId.sendVariation();
      return new Promise((res, rej) => {
        let form = { ...this.form };
        this.loading = true;
        let url = this.createUrl;
        if (this.modelId) {
          url = this.updateUrl;
          form["id"] = this.modelId;
        }
        this.$reqApi(url, form)
          .then((response) => {
            if (!this.modelId) {
              this.$toast.success("اطلاعات ثبت شد");
            } else {
              this.$toast.success("اطلاعات ویرایش شد");
            }
            res(true);
            this.redirectPage();
          })
          .catch((error) => {
            rej(true);
            this.loading = false;
          });
      }).then((res) => {
        this.getVariationIds();
        this.loading = false;
      });
    },
    loadData() {
      this.loading = true;
      return new Promise((res, rej) => {
        this.$reqApi(this.showUrl, { id: this.modelId })
          .then(async (response) => {
            response = response.data;

            for (let i in response) {
              this.form[i] = response[i];
            }
            if (response.product_varcoms && response.product_varcoms.length > 0) {
              this.product_varcoms = response.product_varcoms;
            }
            res(true);
          })
          .catch((rej) => {
            rej(true);
            this.loading = false;
          });
     
      })
        .then((res) => {
          this.$refs.GetVariatonsId.loadVariationsCombinations();
          this.loading = false;
        })
        .catch((rej) => {
          this.loading = false;
          return rej;
        });
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/list-by-personnel", { row_number: 50000 })
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
    getVariationIds(event) {
      this.form.product_varcom_ids = event;
    },
    redirectPage() {
      this.$router.back();
    },
  },
};
</script>

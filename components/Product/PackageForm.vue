<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row class="mb-6"> </v-row>
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="عنوان پکیج" v-model="form.name" rules="require" />
        </v-col>

        <v-col cols="12" md="3">
          <amp-select
            :items="$store.state.static.status"
            text="وضعیت"
            rules="require"
            v-model="form.status"
          />
        </v-col>

        <v-col cols="12" md="3">
          <AmpUploadFile title="بارگذاری تصویر" v-model="form.logo" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="نوع فروش"
            multiple
            rules="require"
            v-model="sale_type_selected"
            :items="sale_type_items"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-select
            text="نوع تخفیف "
            rules="require"
            v-model="form.discount_type"
            :items="pay_type_item"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.discount_type != 'none'">
          <amp-input
            v-if="form.discount_type == 'amount'"
            text="مبلغ تخفیف  (ریال)"
            rules="require"
            is-price
            cClass="ltr-item"
            v-model="discount_value"
          />
          <amp-input
            v-else
            text="درصد  تخفیف"
            rules="require,percent"
            cClass="ltr-item"
            v-model="discount_value"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="Boolean(check_sale_type)">
          <amp-select
            text="نوع پیش پرداخت "
            rules="require"
            v-model="form.prepay_type"
            :items="pay_type_item"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
          v-if="Boolean(check_sale_type) && form.prepay_type != 'none'"
        >
          <amp-input
            v-if="form.prepay_type == 'amount'"
            text="مبلغ پیش پرداخت (ریال)"
            rules="require"
            is-price
            cClass="ltr-item"
            v-model="prepayment"
          />
          <amp-input
            v-else
            text="درصد پیش پرداخت"
            rules="require,percent"
            cClass="ltr-item"
            v-model="prepayment"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-input text="ترتیب" v-model="form.sort" cClass="ltr-item" rules="number" />
        </v-col>
        <v-col cols>
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
    prepayment: "",
    discount_value: "",
    createUrl: "/package/insert",
    updateUrl: "/package/update",
    showUrl: "/package/show",
    product_varcoms: [],
    variations: [],
    selected: {},
    pay_type_item: [
      { text: "درصد", value: "percent" },
      { text: "مقدار", value: "amount" },
      { text: "* ندارد", value: "none" },
    ],
    product_varcomb_id: "",
    products: [],
    sale_type_items: [
      { text: "فروش آنلاین", value: "sale_online" },
      { text: "فروش تلفنی", value: "sale_phone" },
      { text: "فروش حضوری", value: "sale_person" },
    ],
    sale_type_selected: [],
    form: {
      sort: 1,
      logo: "",
      name: "",
      prepay_type: "none",
      discount_type: "none",
      status: "active",
      description: "",
      product_varcom_ids: [],
    },
  }),
  computed: {
    check_sale_type() {
      if (this.sale_type_selected.indexOf("sale_phone") > -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  beforeMount() {},
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      if (!Boolean(this.form.logo)) {
        this.$toast.error("بارگذاری تصویر اجباری میباشد");
        return;
      }
      this.loading = true;
      this.$refs.GetVariatonsId.sendVariation();
      return new Promise((res, rej) => {
        let form = { ...this.form };
        form["sale_online"] = false;
        form["sale_phone"] = false;
        form["sale_person"] = false;
        if (this.sale_type_selected.indexOf("sale_online") > -1) {
          form.sale_online = true;
        }
        if (this.sale_type_selected.indexOf("sale_person") > -1) {
          form.sale_person = true;
        }

        if (this.sale_type_selected.indexOf("sale_phone") > -1) {
          form.sale_phone = true;
          if (form.prepay_type != "none") {
            form["prepay_amount"] = this.prepayment;
          }
        }

        if (form.discount_type != "none") {
          form["discount_amount"] = this.discount_value;
        }
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
            if (response.prepay_type != "none") {
              this.prepayment = response.prepay_amount;
            }
            if (response.discount_type != "none") {
              this.discount_value = response.discount_amount;
            }
            if (response.product_varcoms && response.product_varcoms.length > 0) {
              this.product_varcoms = response.product_varcoms;
            }
            if (Boolean(response.sale_online)) {
              this.sale_type_selected.push("sale_online");
            }
            if (Boolean(response.sale_person)) {
              this.sale_type_selected.push("sale_person");
            }
            if (Boolean(response.sale_phone)) {
              this.sale_type_selected.push("sale_phone");
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

    getVariationIds(event) {
      this.form.product_varcom_ids = event;
    },
    redirectPage() {
      this.$router.back();
    },
  },
};
</script>

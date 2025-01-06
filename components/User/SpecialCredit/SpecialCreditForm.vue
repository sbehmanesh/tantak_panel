<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-card :disabled="Boolean(loading)" class="elevation-0">
      <v-row class="ma-2">
        <v-col cols="12" md="4">
          <amp-input
            text="میزان تومانی اعتبار"
            v-model="form.price"
            rules="require"
            is-price
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="4">
          <amp-select
            text="بابت"
            :items="reason"
            rules="require"
            v-model="form.reason"
          />
        </v-col>
        <v-col cols="12" md="4">
          <amp-jdate
            text=" تاریخ شروع "
            rules="require"
            v-model="form.start_at"
          />
        </v-col>

        <v-col cols="12" md="4" class="d-flex align-center">
          <v-col cols="10" class="pa-0">
            <amp-autocomplete
              :disabled="true"
              text="دسته بندی های انتخاب شده"
              multiple
              :items="catgoury_items"
              rules="require"
              v-model="category_ids"
            />
          </v-col>
          <v-col cols="2" class="pa-0 mt-1">
            <amp-button
              block
              height="38"
              @click="show_dialog = true"
              :text="category_ids.length > 0 ? 'ویرایش' : 'ثبت'"
              color="blue-grey"
            />
          </v-col>
        </v-col>
        <v-col cols="12" md="4">
          <amp-autocomplete
            text="محصولات"
            multiple
            v-model="form.product_ids"
            :items="products"
            rules="require"
          />
        </v-col>

        <v-col cols="12" md="4">
          <amp-jdate
            text="حداکثر مهلت استفاده"
            rules="require"
            :min="now"
            v-model="form.end_at"
          />
        </v-col>
        <v-col cols="12">
          <amp-textarea :rows="3" text="توضیحات" v-model="form.description" />
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-card>
    <SelectCategorey
      title-card="فیلتر کردن محصولات بر اساس دسته بندی"
      :dialog="show_dialog"
      v-if="show_dialog"
      @closeDialog="show_dialog = false"
      @catgoryIds="category_ids = $event"
      :data="category_ids"
      :categorey-items="catgoury_items"
    />
    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="برگشت"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        text="تایید"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loading"
        :loading="loading"
      ></amp-button>
    </v-row>
  </v-form>
</template>

<script>
let jmoment = require("moment");
import SelectCategorey from "@/components/Product/Discount/SelectCategorey.vue";

export default {
  components: {
    SelectCategorey,
  },
  props: {
    modelId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      show_dialog: false,
      insurance: [],
      category_ids: [],
      transactions: [],
      send_info_trasnsaction: {},
      products: [],
      reason: [],
      catgoury_items: [],
      now: "",
      left_over: "",
      total_transaction: "",
      form: {
        price: "",
        reason: "",
        sort: "",
        end_at: "",
        user_id: "",
        start_at: "",
        description: "",
        product_ids: [],
      },
    };
  },

  mounted() {
    this.loadCategory();
    this.getReasons();
    this.loadProduct();
    if (Boolean(this.$route.query.id)) {
      this.form.user_id = this.$route.query.id;
    }
    this.now = jmoment().format("YYYY-MM-DD");
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },

  watch: {
    category_ids: {
      deep: true,
      handler() {
        if (this.category_ids.length > 0) {
          let filter = {
            category_id: {
              op: "in",
              value: this.category_ids,
            },
          };
          this.loadProduct(filter);
        }
      },
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (this.modelId) {
        form["id"] = this.modelId;
      }
      let url = this.modelId
        ? "/special-amount/update"
        : "/special-amount/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadCategory() {
      this.load_item = true;
      this.$reqApi("/category", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
              level: x.level,
              parent: x.parent_id,
            });
          }
          this.catgoury_items = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/special-amount/show", { id: this.modelId })
        .then((res) => {
          let data = res.data;
          for (let i in data) {
            this.form[i] = data[i];
          }
          this.form.product_ids = data.products.map((x) => x.id);
          this.loading = false;

          response(send_info_trasnsaction);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getReasons() {
      this.$reqApi("/setting", { filters: { key: "for_wallet" } })
        .then(async (response) => {
          let items = [];
          if (response.model.data.length > 0) {
            for (let index = 0; index < response.model.data.length; index++) {
              const element = response.model.data[index];
              items.push({
                text: element.value,
                value: element.value,
              });
            }
            this.reason = items;
          }
        })
        .catch((error) => {});
    },

    loadProduct(filter) {
      this.load_item = true;
      let filters = {};
      if (filter && Boolean(filter)) {
        filters = filter;
      }
      this.$reqApi("/product/low-search", {
        row_number: 50000,
        filters: filters,
      })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          items.unshift({
            text: "همه محصولات",
            value: "all",
          });
          this.products = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },

    back() {
      this.$router.back();
    },
  },
};
</script>

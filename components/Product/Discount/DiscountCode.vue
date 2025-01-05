<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <v-col cols="12" md="4">
        <amp-select
          text="بابت"
          :items="for_title_texts"
          rules="require"
          v-model="form.for_title"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-select
          :items="code_type"
          text="نوع کد"
          v-model="form.type"
          rules="require"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="form.type">
        <amp-input
          v-if="form.type == 'percentage'"
          text="درصد تخفیف"
          v-model="form.value"
          rules="require,percent"
        />
        <amp-input
          v-if="form.type == 'amount'"
          text="مقدار تخفیف (ریال)"
          v-model="form.value"
          rules="require,price"
          is-price
        />
      </v-col>

      <v-col cols="12" md="4">
        <amp-select
          text="عمومی"
          :items="$store.state.static.bool_en"
          rules="require"
          v-model="form.is_public"
        ></amp-select>
      </v-col>
      <v-col cols="12" md="4">
        <amp-select
          text="وضعیت"
          :items="$store.state.static.status_cupon"
          rules="require"
          v-model="form.status"
        ></amp-select>
      </v-col>

      <v-col cols="12" md="4" v-if="form.is_public == 'no'">
        <UserSelectForm
          text="انتخاب کاربر"
          v-model="user"
          multi
          url="user"
          rules="require"
          :role-id="[]"
        />
      </v-col>
      <v-col cols="12" md="4" v-if="form.send_in != 'custom'">
        <amp-input
          rules="number,require"
          text="حداکثر استفاده "
          v-model="form.coupon_usage_limit"
          cClass="ltr-item"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-select
          text="قابل استفاده برای تمامی محصولات (پکیج و محصولات)"
          :items="$store.state.static.bool_en"
          rules="require"
          v-model="form.all_products"
        ></amp-select>
      </v-col>
      <v-col cols="12" md="4" v-if="form.all_products == 'no'">
        <amp-select
          text="تخفیف برای "
          :items="send_for_items"
          rules="require"
          v-model="form.send_for"
        ></amp-select>
      </v-col>
      <v-col
        cols="12"
        md="4"
        v-if="form.all_products == 'no' && form.send_for != 'category'"
      >
        <amp-autocomplete
          v-if="form.send_for == 'product'"
          text="انتخاب محصول"
          multiple
          :items="products"
          rules="require"
          v-model="form.product_ids"
        />
        <amp-autocomplete
          v-if="form.send_for == 'package'"
          text="انتخاب پکیج"
          multiple
          :items="package"
          rules="require"
          v-model="form.package_ids"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex align-center"
        v-if="form.send_for == 'category' && form.all_products == 'no'"
      >
        <v-col cols="10" class="pa-0">
          <amp-autocomplete
            :disabled="true"
            text="دسته بندی های انتخاب شده"
            multiple
            :items="catgoury_items"
            rules="require"
            v-model="form.category_ids"
          />
        </v-col>
        <v-col cols="2" class="pa-0 mt-1">
          <amp-button
            block
            height="38"
            @click="show_dialog = true"
            :text="form.category_ids.length > 0 ? 'ویرایش' : 'ثبت'"
            color="blue-grey"
            v-if="form.send_for == 'category'"
          />
        </v-col>
      </v-col>
      <v-col cols="12" md="4">
        <amp-input
          text="  سقف استفاده برای کاربر (ریال)"
          rules="require,price"
          is-price
          v-model="form.user_usage_limit"
          cClass="ltr-item"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-jdate
          text=" تاریخ شروع "
          rules="require"
          v-model="form.start_date"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-jdate
          text="تاریخ پایان"
          rules="require"
          :min="now"
          v-model="form.end_date"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-input text="ترتیب" v-model="form.sort" cClass="ltr-item" />
      </v-col>
      <v-col cols="12" md="12">
        <amp-textarea :rows="3" text="توضیحات" v-model="form.description" />
      </v-col>
      <SelectCategorey
        title-card=" اعمال کد تخفیف بر اساس دسته بندی"
        :dialog="show_dialog"
        v-if="show_dialog"
        @closeDialog="show_dialog = false"
        @catgoryIds="form.category_ids = $event"
        :data="form.category_ids"
        :categorey-items="catgoury_items"
      />
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="انصراف"
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
import UserSelectForm from "@/components/User/UserSelectForm";
import SelectCategorey from "@/components/Product/Discount/SelectCategorey.vue";

export default {
  components: {
    UserSelectForm,
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
      code_type: [
        { text: "درصد", value: "percentage" },
        { text: "مقدار", value: "amount" },
      ],
      send_for_items: [
        { text: "محصولات", value: "product" },
        { text: "پکیج ها", value: "package" },
        { text: "بر اساس دسته بندی", value: "category" },
      ],
      user: [],
      for_title_texts: [],
      products: [],
      package: [],
      catgoury_items: [],
      users: [],
      show_dialog: false,
      now: "",
      form: {
        for_title: "",
        type: "",
        send_for: "product",
        start_date: "",
        end_date: "",
        all_products: "",
        status: "active",
        value: "",
        coupon_usage_limit: "",
        user_usage_limit: "",
        description: "",
        sort: "",
        is_public: "yes",
        product_ids: [],
        category_ids: [],
        package_ids: [],
        user_ids: [],
      },
    };
  },
  beforeMount() {
    this.loadProduct();
    this.loadPackages();
    this.loadCategory();
  },
  mounted() {
    this.getForTitle();
    this.now = jmoment().format("YYYY-MM-DD");
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      this.loading = true;

      if (this.form.is_public == "yes") {
        this.form.is_public = true;
      } else {
        this.form.is_public = false;
      }

      if (this.form.all_products == "yes") {
        this.form.all_products = true;
      } else {
        this.form.all_products = false;
      }
      if (this.user.length > 0) {
        this.user.map((x) => {
          this.form.user_ids.push(x.id);
        });
      }
      let form = { ...this.form };
      if (this.modelId) {
        form["id"] = this.modelId;
      }
      let url = this.modelId ? "/coupon/update" : "/coupon/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;

          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/coupon/show", { id: this.modelId, with_user: true })
        .then((res) => {
          let data = res.model;
          for (let i in data) {
            this.form[i] = data[i];
          }
          this.form.all_products = Boolean(data.all_products) ? "yes" : "no";
          this.form.is_public = Boolean(data.is_public) ? "yes" : "no";
          this.user =
            data.users.length > 0 ? data.users.map((x) => x.user) : [];
          data.couponables.map((y) => {
            if (y.couponable_type == "products") {
              this.form.product_ids.push(y.couponable_id);
            } else if (y.couponable_type == "packages") {
              this.form.package_ids.push(y.couponable_id);
            } else if (y.couponable_type == "categories") {
              this.form.category_ids.push(y.couponable_id);
            }
          });

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadContract() {
      this.loading = true;

      this.$reqApi("/contract", { row_number: 2000 })
        .then(async (response) => {
          this.contract_ids = response.model.data.map((x) => ({
            text: x.fa_name + " | " + x.company_fa_name,
            value: x.id,
          }));
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getForTitle() {
      this.loading = true;
      let filters = {
        key: {
          op: "=",
          value: "for_discount",
        },
      };
      let items = [];
      this.$reqApi("/setting", { row_number: 2000, filters: filters })
        .then(async (response) => {
          for (let i = 0; i < response.model.data.length; i++) {
            const x = response.model.data[i];
            items.push({
              text: x.value,
              value: x.id,
            });
          }
          this.for_title_texts = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
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

    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/discount-code");
      }
    },
  },
};
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="850">
      <v-card style="overflow: hidden">
        <v-col cols="12" class="d-flex align-center primary white--text">
          <span class="font_16">ایجاد کد تخفیف با استفاد از اکسل</span>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog" icon>
            <v-icon color="white"> close </v-icon>
          </v-btn>
        </v-col>
        <v-divider></v-divider>
        <v-form
          v-model="valid"
          @submit.prevent="submit()"
          :disabled="loading"
          class="rounded-0 pa-2 d-flex flex-column justify-center"
        >
          <v-row class="align-center d-flex pa-4 justify-center">
            <v-col cols="12" md="6">
              <v-file-input
                color="primary"
                label="بارگذاری اکسل"
                v-model="form.file"
                accept=".xlsx"
              ></v-file-input>

              <div class="text-center mt-4">
                <v-btn text icon @click="open">
                  <v-icon>downloading</v-icon>
                </v-btn>
                <br />
                <small> فایل نمونه </small>
              </div>
            </v-col>
          </v-row>

          <v-row class="ma-2" v-if="Boolean(form.file)">
            <v-col cols="12" md="6">
              <amp-select
                text="بابت"
                :items="for_title_texts"
                rules="require"
                v-model="form.for_title"
              />
            </v-col>
            <v-col cols="12" md="6">
              <amp-select
                :items="code_type"
                text="نوع کد"
                v-model="form.type"
                rules="require"
              />
            </v-col>
            <v-col cols="12" md="6" v-if="form.type">
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

            <v-col cols="12" md="6">
              <amp-select
                text="وضعیت"
                :items="$store.state.static.status_cupon"
                rules="require"
                v-model="form.status"
              ></amp-select>
            </v-col>

            <v-col cols="12" md="6" v-if="form.send_in != 'custom'">
              <amp-input
                rules="number,require"
                text="حداکثر استفاده "
                v-model="form.coupon_usage_limit"
                cClass="ltr-item"
              />
            </v-col>
            <v-col cols="12" md="6">
              <amp-select
                text="قابل استفاده برای تمامی محصولات (پکیج و محصولات)"
                :items="$store.state.static.bool_en"
                rules="require"
                v-model="form.all_products"
              ></amp-select>
            </v-col>
            <v-col cols="12" md="6" v-if="form.all_products == 'no'">
              <amp-select
                text="تخفیف برای "
                :items="send_for_items"
                rules="require"
                v-model="form.send_for"
              ></amp-select>
            </v-col>
            <v-col
              cols="12"
              md="6"
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
              md="6"
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
            <v-col cols="12" md="6">
              <amp-input
                text="  سقف استفاده برای کاربر (ریال)"
                rules="require,price"
                is-price
                v-model="form.user_usage_limit"
                cClass="ltr-item"
              />
            </v-col>
            <v-col cols="12" md="6">
              <amp-jdate
                text=" تاریخ شروع "
                rules="require"
                v-model="form.start_date"
              />
            </v-col>
            <v-col cols="12" md="6">
              <amp-jdate
                text="تاریخ پایان"
                rules="require"
                :min="now"
                v-model="form.end_date"
              />
            </v-col>
            <v-col cols="12" md="6">
              <amp-input text="ترتیب" v-model="form.sort" cClass="ltr-item" />
            </v-col>
            <v-col cols="12" md="12">
              <amp-textarea
                :rows="3"
                text="توضیحات"
                v-model="form.description"
              />
            </v-col>
            <SelectCategorey
              :dialog="show_dialog"
              v-if="show_dialog"
              @closeDialog="show_dialog = false"
              @catgoryIds="form.category_ids = $event"
              :data="form.category_ids"
              :categorey-items="catgoury_items"
            />
          </v-row>
          <v-row class="ma-1 d-flex justify-center" v-if="Boolean(form.file)">
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
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SelectCategorey from "@/components/Product/Discount/SelectCategorey.vue";
export default {
  components: {
    SelectCategorey,
  },
  props: {
    dialog: {
      require: false,
      default: false,
    },

    couponId: {
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
        product_ids: [],
        category_ids: [],
        package_ids: [],
        file: null,
      },
    };
  },
  mounted() {
    this.loadProduct();
    this.loadPackages();
    this.getForTitle();
    this.loadCategory();
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.form.file == null) {
        this.loading = false;
        return this.$toast.error("بارگذاری اکسل اجباری می باشد");
      }
      if (this.form.all_products == "yes") {
        this.form.all_products = true;
      } else {
        this.form.all_products = false;
      }
      let form = { ...this.form };
      let formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }


   

   
      let url = "/coupon/insert-excel";
      this.$reqApi(url, formData)
        .then((res) => {
          this.loading = false;
this.$emit("refresh")
          this.closeDialog();
        })
        .catch((err) => {
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

    closeDialog() {
      this.$emit("closeDialog");
    },
    open() {
      window.open("https://test-api.tantak.ir/example/coupon.xlsx");
    },
  },
};
</script>

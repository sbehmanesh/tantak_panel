<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-card class="elevation-0 pa-8" :disabled="Boolean(loading)">
      <v-row dense>
        <v-col cols="12" md="2">
          <amp-input text="نام نمایندگی" v-model="form.name" rules="require" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            text="کد نمایندگی"
            v-model="form.code"
            rules="require,number"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="وضعیت"
            rules="require"
            v-model="form.status"
            :items="$store.state.static.status"
          />
        </v-col>
        <v-col cols="12" md="2">
          <UserSelectForm
            text="انتخاب مدیر"
            v-model="manager"
            url="/user/searchByRole"
            rules="require"
            :role-id="role_id"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="انتخاب ناحیه"
            rules="require"
            v-model="form.region_id"
            :items="region"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="شعبه اصلی است ؟‌"
            v-model="form.agency_main"
            :items="type_items"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-autocomplete
            text="انتخاب استان"
            rules="require"
            v-model="province_id"
            :items="province"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-autocomplete
            :disabled="!Boolean(province_id)"
            text="انتخاب شهر"
            rules="require"
            v-model="form.country_division_id"
            :items="citis"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="نوع فروش"
            multiple
            rules="require"
            v-model="sale_type_selected"
            :items="sale_type_items"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="ارسال کالا"
            rules="require"
            v-model="form.send_good"
            :items="check_have"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="خدمات پس از فروش"
            rules="require"
            v-model="form.after_sale_service"
            :items="check_have"
          />
        </v-col>    
        
            <v-col cols="12" md="2">
          <amp-select
            text="دسترسی تعریف موجودی"
            rules="require"
            v-model="form.access_add_product"
            :items="$store.state.static.access_request_product"
          />
        </v-col>

        <v-col cols="12" md="2">
          <SelectLocationDialog v-model="location" />
        </v-col>
        <v-col cols="12" md="2">
          <AmpUploadFileNew v-model="form.img" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            text="امتیاز"
            v-model="form.score"
            rules="number,percent"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            text="ترتیب"
            v-model="form.sort"
            rules="number"
            cClass="ltr-item"
          />
        </v-col>

        <v-col cols>
          <amp-textarea
            text="آدرس"
            v-model="form.address"
            :rows="1"
          ></amp-textarea>
        </v-col>

        <v-col cols="12" md="12">
          <Time
            v-if="!loading"
            :deliveryTime="delivery_time"
            :deliveryTimeIds="form.delivery_time_ids"
            @validTime="valid_time = $event"
            @deliveryForm="form.delivery_time_ids = $event"
          />
        </v-col>
      </v-row>
      <v-row dense>
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
            @click="redirectPage"
          />

          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            :loading="loading"
            color="success"
            :disabled="!valid || loading || !valid_time"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";
import SelectLocationDialog from "@/components/Base/SelectLocationDialog.vue";
import Time from "@/components/Product/Representative/Time.vue";
export default {
  components: {
    UserSelectForm,
    SelectLocationDialog,
    Time,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    valid_time: false,
    loading: false,
    location: [],
    check_have: [
      {
        text: "دارد",
        value: "have",
      },
      {
        text: "ندارد",
        value: "dont_have",
      },
    ],
    region: [],
    citis: [],
    province: [],
    province_id: "",
    role_id: [],
    city_items: [],
    delivery_time: [],
    manager: [],
    sale_type_selected: [],
    createUrl: "/sale-agency/insert",
    updateUrl: "/sale-agency/update",
    showUrl: "/sale-agency/show",
    sale_type_items: [
      { text: "فروش آنلاین", value: "sale_online" },
      { text: "فروش تلفنی", value: "sale_phone" },
      { text: "فروش حضوری", value: "sale_person" },
    ],
    type_items: [
      { text: "بله", value: "main" },
      { text: "خیر", value: "sub" },
    ],
    form: {
      lat: "",
      img: "",
      sort: "",
      long: "",
      code: "",
      score: "",
      name: "",
      status: "active",
      after_sale_service: "",
      access_add_product: "",
      send_good: "",
      address: "",
      sale_online: "",
      sale_phone: "",
      manager_id: "",
      sale_person: "",
      agency_main: "",
      country_division_id: "",
      delivery_time_ids: [],
      region_id: "",
    },
  }),

  beforeMount() {
    this.role_id = [this.$store.state.auth.role.seal_manager];
    this.loadCitise();
    this.loadRegion();
  },

  watch: {
    location() {
      if (this.location.length > 0 && this.location[0] && this.location[1]) {
        this.form.lat = this.location[0].toString();
        this.form.long = this.location[1].toString();
      }
    },
    province_id() {
      if (this.province_id) {
        let set_citis = [];
        for (let index = 0; index < this.city_items.length; index++) {
          const element = this.city_items[index];
          if (element.parent_id == this.province_id) {
            set_citis.push({
              text: element.name,
              value: element.id,
            });
          }
        }

        this.citis = set_citis;
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      if (
        !this.form.delivery_time_ids ||
        this.form.delivery_time_ids.length == 0
      ) {
        this.loading = false;
        this.$toast.error(
          "نمایندگی باید حداقل یک بازه زمانی ارسال  داشته باشد"
        );
        return;
      }
      this.form.delivery_time_ids = this.form.delivery_time_ids.map((x) => {
        let week_days = x.week_days;
        if (typeof week_days != "string") {
          week_days = JSON.stringify(x.week_days);
        }
        return {
          ...x,
          week_days,
        };
      });
      let form = JSON.parse(JSON.stringify(this.form));

      switch (form.agency_main) {
        case "main":
          form.agency_main = true;
          break;
        case "sub":
          form.agency_main = false;
          break;
      }

      switch (form.send_good) {
        case "have":
          form.send_good = true;
          break;
        case "dont_have":
          form.send_good = false;
          break;
      }
      switch (form.after_sale_service) {
        case "have":
          form.after_sale_service = true;
          break;
        case "dont_have":
          form.after_sale_service = false;
          break;
      }

      form["sale_online"] = false;
      form["sale_phone"] = false;
      form["sale_person"] = false;
      form.manager_id = this.manager[0].id;
      if (this.sale_type_selected.indexOf("sale_online") > -1) {
        form.sale_online = true;
      }
      if (this.sale_type_selected.indexOf("sale_person") > -1) {
        form.sale_person = true;
      }

      if (this.sale_type_selected.indexOf("sale_phone") > -1) {
        form.sale_phone = true;
      }
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
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          response = response.data;
          for (let key in response) {
            this.form[key] = response[key];
          }
          this.manager = response.manager;
          this.province_id = response.country_division.parent_id;
          this.form.country_division_id = response.country_division.id;
          switch (response.agency_main) {
            case true:
              this.form.agency_main = "main";
              break;

            default:
              this.form.agency_main = "sub";
              break;
          }
          switch (response.send_good) {
            case true:
              this.form.send_good = "have";
              break;

            default:
              this.form.send_good = "dont_have";
              break;
          }
          switch (response.after_sale_service) {
            case true:
              this.form.after_sale_service = "have";
              break;

            default:
              this.form.after_sale_service = "dont_have";
              break;
          }

          this.form.delivery_time_ids = response.delivery_times;
          this.location.push(response.lat);
          this.location.push(response.long);
          if (Boolean(response.sale_online)) {
            this.sale_type_selected.push("sale_online");
          }

          if (Boolean(response.sale_person)) {
            this.sale_type_selected.push("sale_person");
          }
          if (Boolean(response.sale_phone)) {
            this.sale_type_selected.push("sale_phone");
          }

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadCitise() {
      this.loading = true;
      return new Promise((res, rej) => {
        this.$reqApi("/shop/country-division", { row_number: 50000 })
          .then(async (response) => {
            let items = [];
            let get_citis = [];
            let data = response.model.data;
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              if (element.level == "province") {
                items.push({
                  text: element.name,
                  value: element.id,
                });
              }
            }
            get_citis = data.filter((f) => f.level == "city");
            this.province = items;
            res(get_citis);
          })
          .catch((error) => {
            this.loading = false;
          });
      })
        .then((response) => {
          this.city_items = response;
          if (Boolean(this.modelId)) {
            this.loadData();
          } else {
            this.loading = false;
          }
        })
        .catch((rej) => {
          this.loading = false;
        });
    },
    loadRegion() {
      this.loading = true;
      this.$reqApi("/region").then(async (response) => {
        let items = [];
        let data = response.model.data;
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          items.push({
            text: element.fa_name,
            value: element.id,
          });
        }
        this.region = items;
      });
    },

    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>

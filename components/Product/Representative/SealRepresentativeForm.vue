<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-card class="elevation-0 pa-8" :disabled="Boolean(loading)">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="نام نمایندگی" v-model="form.name" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="کد نمایندگی"
            v-model="form.code"
            rules="require,number"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="وضعیت"
            rules="require"
            v-model="form.status"
            :items="$store.state.static.status"
          />
        </v-col>
        <v-col cols="12" md="3">
          <UserSelectForm
            text="انتخاب مدیر"
            v-model="manager"
            url="/user/searchByRole"
            rules="require"
            :role-id="role_id"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="شعبه اصلی است ؟‌"
            v-model="form.agency_main"
            :items="type_items"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            text="انتخاب استان"
            rules="require"
            v-model="province_id"
            :items="province"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            :disabled="!Boolean(province_id)"
            text="انتخاب شهر"
            rules="require"
            v-model="form.country_division_id"
            :items="citis"
          />
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
            text="بازه زمانی"
            multiple
            rules="require"
            v-model="form.delivery_time_ids"
            :items="delivery_time"
          />
        </v-col>
        <v-col cols="12" md="3">
          <SelectLocationDialog v-model="location" />
        </v-col>
        <v-col cols="12" md="3">
          <AmpUploadFileNew v-model="form.img" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="امتیاز"
            v-model="form.score"
            rules="number,percent"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="1">
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
            :disabled="!valid || loading"
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
export default {
  components: {
    UserSelectForm,
    SelectLocationDialog,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    location: [],
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
      address: "",
      sale_online: "",
      sale_phone: "",
      manager_id: "",
      sale_person: "",
      agency_main: "",
      country_division_id: "",
      delivery_time_ids: [],
    },
  }),

  beforeMount() {
    this.role_id = [this.$store.state.auth.role.seal_manager];
    this.loadCitise();
  },


  watch: {
    location() {
      if (this.location.length > 0) {
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
      let form = { ...this.form };
      switch (form.agency_main) {
        case "main":
          form.agency_main = true;
          break;
        case "sub":
          form.agency_main = false;
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
          let ids = [];
          response.delivery_times.map((x) => {
            ids.push(x.id);
          });
          this.form.delivery_time_ids = ids;

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
          }
          this.timsSend();
        })
        .catch((rej) => {
          console.log(rej);
          this.loading = false;
        });
    },
    timsSend() {
      this.$reqApi("delivery-time", { row_number: 50000 })
        .then(async (response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push({
              text: element.range_time,
              value: element.id,
            });
          }
          this.delivery_time = items;

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
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

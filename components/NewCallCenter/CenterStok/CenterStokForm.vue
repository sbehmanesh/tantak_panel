<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-row dense class="pa-5" >
      <v-col cols="12" md="2">
        <amp-input v-model="form.name" rules="require" text="نام مرکز" />
      </v-col>
      <v-col cols="12" md="2">
        <amp-input
          v-model="form.code"
          rules="require,number"
          cClass="ltr-item"
          text="کد مرکز"
        />
      </v-col>
      <v-col cols="12" md="2">
        <UserSelectForm
          text="انتخاب مدیر"
          v-model="user"
          url="user/searchByRole"
          rules="require"
          :role-id="role_id"
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
          :items="$store.state.static.status"
          text="وضعیت"
          v-model="form.status"
        />
      </v-col>
      <v-col cols="12" md="2">
        <AmpUploadFileNew text="بارگذاری تصویر" v-model="form.img" />
      </v-col>
      <v-col cols="12" md="2">
        <SelectLocationDialog v-model="location" />
      </v-col>
      <v-col cols="12" md="12">
        <amp-textarea text="آدرس دقیق" v-model="form.address" />
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
          @click="back()"
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
  </v-form>
</template>

<script>
import SelectLocationDialog from "@/components/Base/SelectLocationDialog.vue";
import UserSelectForm from "@/components/User/UserSelectForm";

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
    createUrl: "/center-stock/insert",
    updateUrl: "/center-stock/update",
    showUrl: "/center-stock/show",
    selected: {},
    location: [],
    province: [],
    user: [],
    citis: [],
    role_id: [],
    province_id: "",
    form: {
      lat: "",
      img: "",
      sort: "",
      long: "",
      code: "",
      name: "",
      status: "active",
      address: "",
      manager_id: "",
      country_division_id: "",
    },
  }),

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
  beforeMount() {
    this.role_id = [this.$store.state.auth.role.superviser_centeral_stock]
    this.loadCitise();
  },

  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.manager_id = this.user[0].id;
      let url = this.modelId ? this.updateUrl : this.createUrl;
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.back();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
   
      let res = response.data
      this.province_id =res.country_division.parent_id

for(let i in res){
    this.form[i] =res[i]
}
this.user = [res.manager[0]]
this.location.push(res.lat);
this.location.push(res.long);

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
          console.log(rej);
          this.loading = false;
        });
    },
    back(){
        this.$router.back();
    }

  },
};
</script>

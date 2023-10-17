<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="نام" v-model="form.first_name" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="نام خانوادگی"
            v-model="form.last_name"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            text="استان"
            v-model="province"
            :items="province_item"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            text="شهر"
            :disabled="province.length == 0"
            :items="citis"
            v-model="form.country_division_id"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="کد پستی"
            v-model="form.postal_address"
            :isNumber="true"
            rules="require,postCode"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            :items="$store.state.static.ownership_type"
            text="نوع مالکیت"
            v-model="form.ownership_type"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="اندازه فروشگاه"
            :isNumber="true"
            rules="number"
            v-model="form.store_size"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="شماره تماس"
            v-model="form.phone_number"
            :isNumber="true"
            rules="require,phone"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            :items="$store.state.static.status_contact_form"
            text="وضعیت"
            v-model="form.status"
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
export default {
  props: {
    modelId: { default: null }
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/shop/representation-request-form/insert",
    updateUrl: "/representation-request-form/update",
    showUrl: "/representation-request-form/show",
    categories: [],
    province: "",
    citis: [],
    province_item: [],
    form: {
      first_name: "",
      last_name: "",
      country_division_id: "",
      postal_address: "",
      ownership_type: "",
      store_size: "",
      phone_number: "",
      status: ""
    }
  }),
  beforeMount() {
    this.loadState();
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  watch: {
    province() {
      if (this.province) {
        this.loadCitis(this.province);
      }
    }
  },
  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then(response => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async response => {
          let res = response.model;
          this.form.first_name = res.first_name;
          this.form.last_name = res.last_name;
          this.form.ownership_type = res.ownership_type;
          this.form.phone_number = res.phone_number;
          this.form.store_size = res.store_size;
          this.form.postal_address = res.postal_address;
          this.form.status = res.status;
          this.setState(res.country_division_id);
          this.loading = false;
        })
        .catch(error => {
          this.redirectPage();
          this.loading = false;
        });
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province"
          }
        };
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 3000000
        })
          .then(res => {
            let province = [];
            if (res.model.data) {
              res.model.data.map(x => {
                province.push({
                  text: x.name,
                  value: x.id
                });
              });
            }
            this.province_item = province;
            response(province);
          })
          .catch(err => {
            return err;
          });
      });
    },
    setState(contrydivisionid) {
        
    },
    loadCitis(id) {
      this.citis = [];
      let filters = {
        parent_id: {
          op: "=",
          value: id
        }
      };
      if (id) {
        let data = [];
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 300000
        }).then(res => {
          data = res.model.data;
          data.filter(x => {
            this.citis.push({
              text: x.name,
              value: x.id
            });
          });
        });
      }
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    }
  }
};
</script>

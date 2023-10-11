<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <v-col cols="12" md="3">
        <UserSelectForm
          text="انتخاب کاربر"
          v-model="user"
          url="user"
          rules="require"
          :role-id="[$store.state.auth.role.admin_id]"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="کد شعبه"
          v-model="form.branch_code"
          rules="number"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="نام شعبه"
          v-model="form.name"
          rules="require"
        ></amp-input>
      </v-col>

      <v-col cols="12" md="3">
        <amp-select
          text="ناحیه"
          v-model="form.region_id"
          :items="$store.state.setting.region"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select text="استان" v-model="form.province_id" :items="province" />
      </v-col>
      <v-col>
        <amp-select
          text="شهر"
          v-model="form.country_division_id"
          :items="citis"
          :disabled="citis.length > 0 ? false : true"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input text="آدرس " v-model="form.address"></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          text=" وضعیت"
          rules="require"
          v-model="form.status"
          :items="$store.state.static.status_baranch"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          text=" نوع فروش"
          rules="require"
          v-model="form.sell_type"
          :items="$store.state.static.sell_type"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          text=" نوع شعبه"
          rules="require"
          v-model="form.is_main_branch"
          :items="$store.state.static.is_main_branch"
        />
      </v-col>
      <v-col cols="12" md="3">
        <SelectLocationDialog v-model="location" />
      </v-col>
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
        :text="modelId ? 'ویرایش' : 'افزودن'"
        type="submit"
        icon="done"
        class="ma-1"
        :loading="loader"
      ></amp-button>
    </v-row>
  </v-form>
</template>
  
  <script>
import UserSelectForm from "@/components/User/UserSelectForm";
import SelectLocationDialog from "@/components/Base/SelectLocationDialog.vue";
import SelectLocation from "@/components/Base/SelectLocation.vue";
export default {
  components: {
    UserSelectForm,
    SelectLocationDialog,
    SelectLocation,
  },
  props: {
    modelId: {
      require: false,
      default: false,
    },
    updateUrl: { default: "/branch/update" },
    createUrl: { default: "/branch/insert" },
    showUrl: { default: "/branch/show" },
  },
  data() {
    return {
      valid: true,
      loader: false,
      panel: [],
      location: [],
      province: [],
      citis: [],
      user: [],
      form: {
        user_id: "",
        parent_id: "",
        region_id: "",
        country_division_id: "",
        name: "",
        branch_code: "",
        long: "",
        lat: "",
        sell_type: "",
        address: "",
        is_main_branch: null,
        status: "",
        sort: 1,
        id: "",
      },
    };
  },
  computed: {},
  watch: {
    location() {
      if (this.location.length > 0) {
        this.form.lat = this.location[0].toString();
        this.form.long = this.location[1].toString();
      }
    },
    "form.province_id"() {
      this.loadCitis(this.form.province_id);
    },
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
    if (this.$route.query.id) {
      this.form.user_id = this.$route.query.id;
    }
    this.loadState().then((res) => {
      res.filter((x) => {
        this.province.push({
          text: x.name,
          value: x.id,
        });
      });
    });
  },
  methods: {
    submit() {
      this.loader = true;
      if (this.user) {
        this.form.user_id = this.user[0].id;
      }
      let form = this.$copyForm(this.form);
    
      let url = this.modelId ? this.updateUrl : this.createUrl;
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.loader = false;
          this.back();
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then((response) => {
          this.form.id = this.modelId;
          this.form.user_id = response.model.user_id;
          this.user = [response.model.user];
          this.form.name = response.model.name;
          this.form.long = response.model.long;
          this.form.lat = response.model.lat;
          this.form.status = response.model.status;
          this.form.sell_type = response.model.sell_type;
          this.form.branch_code = response.model.branch_code;
          this.form.address = response.model.address;
          this.form.is_main_branch = response.model.is_main_branch;
          this.form.region_id = response.model.region_id;
          this.form.sort = response.model.sort;
          this.form.country_division_id = response.model.country_division_id;
        

          this.loader = false;
        })
        .catch((error) => {
          this.loader = false;
        });
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province",
          },
        };
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 3000000,
        })
          .then((res) => {
            response(res.model.data);
          })
          .catch((err) => {
            return err;
          });
      });
    },
    loadCitis(id) {
      this.citis = [];
      let filters = {
        parent_id: {
          op: "=",
          value: id,
        },
      };
      if (id) {
        let data = [];
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 300000,
        }).then((res) => {
          data = res.model.data;
          data.filter((x) => {
            this.citis.push({
              text: x.name,
              value: x.id,
            });
          });
        });
      }
    },
    back() {
      this.$router.back();
    },
  },
};
</script>
  
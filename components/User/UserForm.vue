<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="نام" v-model="form.first_name" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input text="نام خانوادگی" v-model="form.last_name" rules="" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            class="ltr-item"
            text=" شماره همراه "
            rules="phone,require"
            v-model="form.username"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            class="ltr-item"
            text=" رمز عبور "
            type="password"
            :rules="modelId ? 'password' : 'require,password'"
            v-model="form.password"
          />
        </v-col>

        <v-col cols="12" md="3" v-if="!Boolean(roleId)">
          <amp-autocomplete
            text="نقش"
            chips
            multiple
            rules="require"
            v-model="form.role_id"
            :items="$store.state.setting.roles"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            text="دسته بندی کاربر"
            chips
            multiple
            rules="require"
            v-model="form.category_id"
            :items="category_users"
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
          <amp-select
            text="وضعیت کاری"
            rules="require"
            v-model="form.status_work"
            :items="$store.state.static.work_status"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="نوع شخص"
            rules="require"
            v-model="form.person_type"
            :items="$store.state.static.person_type"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.person_type == 'legal'">
          <amp-select
            text="شرکت"
            rules="require"
            v-model="form.company_id"
            :items="companies"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.person_type == 'legal'">
          <amp-input text="سمت (پست)" rules="require" v-model="form.post" />
        </v-col>

        <v-col cols="12" md="3">
          <amp-input
            text="کد ملی"
            rules="nationalCode"
            :is-number="true"
            v-model="form.national_code"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="پست الکترونیکی"
            rules="email"
            dir="ltr"
            v-model="form.email"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-jdate
            text="تاریخ تولد"
            :is-number="true"
            v-model="form.birth_date"
          />
        </v-col>
        <!-- <v-col cols="12" md="3">
          <amp-input
            text="کد پستی"
            cClass="ltr-item"
            rules="postCode"
            v-model="form.address.postal_code"
          />
        </v-col> -->
        <!-- <v-col cols="12" md="3">
          <amp-autocomplete
            text="استان"
            v-model="form.province_id"
            :items="province"
          />
        </v-col> -->

        <!-- <v-col cols="12" md="3">
          <amp-autocomplete
            text="شهر"
            v-model="form.address.country_division_id"
            :items="citis"
            :disabled="citis.length > 0 ? false : true"
          />
        </v-col> -->
        <!-- <v-col cols="12" md="3" v-if="cheke_branch">
          <UserSelectForm
            text=" کاربر ناظر"
            v-model="parent_id"
            url="user"
            :role-id="[$store.state.auth.role.admin_id]"
          />
        </v-col> -->
        <v-col cols="12" md="3" v-if="sales_manager">
          <amp-select
            text="ناحیه"
            rules="require"
            v-model="form.region_id"
            :items="$store.state.setting.region"
          />
        </v-col>
        <!-- <v-col cols="12" md="3" v-if="cheke_branch">
          <amp-select
            text=" کد شعبه "
            v-model="form.branch_id"
            :items="$store.state.setting.branch_code"
          />
        </v-col> -->
        <v-col cols="12" md="3">
          <amp-upload-file v-model="form.avatar" />
        </v-col>
        <v-col cols="12" md="3" v-if="!is_user">
          <amp-select
            text="انتخاب داخلی"
            v-model="form.internal_id"
            :items="internal_items"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="!is_user">
          <amp-input
            text="شمار پورت داخلی"
            v-model="form.internal_port"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-divider></v-divider>
        </v-col>
        <!-- <v-col cols="12" md="4">
          <amp-textarea
            text="آدرس"
            v-model="form.address.address"
          ></amp-textarea>
        </v-col> -->

        <v-col cols="12" md="12">
          <amp-textarea
            text="توضیحات"
            v-model="form.description"
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
import UserSelectForm from "~/components/User/UserSelectForm.vue";
export default {
  components: {
    UserSelectForm,
  },
  props: {
    roleId: { default: null },
    modelId: { default: null },
    path: { default: "/user" },
    showUrl: { default: "/user/show" },
    createUrl: { default: "/user/insert" },
    updateUrl: { default: "/user/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    is_user: false,
    supervisor_status: "",
    supervisor: [],
    internal_items: [],
    parent_id: [],
    psychologist: [],
    supervisor_status_items: [],
    category_users: [],
    companies: [],
    province: [],
    user: [],
    citis: [],
    form: {
      sort: -1,
      username: "",
      parent_id: "",
      birth_date: "",
      avatar: "",
      password: "",
      last_name: "",
      description: "",
      region_id: "",
      branch_id: "",
      first_name: "",
      company_id: "",
      post: "",
      email: "",
      internal_id: "",
      person_type: "",
      internal_port: "",
      status_work: "",
      role_id: [],
      category_id: [],
      national_code: "",
      status: "active",
    },
  }),
  computed: {
    // cheke_branch() {
    //   if (this.form.role_id) {
    //     return (
    //       this.form.role_id.indexOf(this.$store.state.auth.role.cashier_id) >
    //         -1 ||
    //       this.form.role_id.indexOf(
    //         this.$store.state.auth.role.warehouseman_id
    //       ) > -1
    //     );
    //   }
    // },
    sales_manager() {
      if (
        Boolean(
          this.form.role_id.indexOf(this.$store.state.auth.role.sales_manager) >
            -1
        )
      ) {
        this.$store.dispatch("setting/setgetRegion");
        return true;
      } else {
        return false;
      }
    },
    cheke_user() {
      return (
        this.form.role_id.indexOf(this.$store.state.auth.role.cashier_id) >
          -1 ||
        this.form.role_id.indexOf(this.$store.state.auth.role.writers_id) >
          -1 ||
        this.form.role_id.indexOf(this.$store.state.auth.role.warehouseman_id) >
          -1 ||
        this.form.role_id.indexOf(this.$store.state.auth.role.admin_id) > -1
      );
    },
  },
  beforeMount() {
    this.loadCategoryUser();
  },
  // watch: {
  //   "form.province_id"() {
  //     this.loadCitis(this.form.province_id);
  //   },
  //   // "form.role_id"() {
  //   //   let cashier_id = "38d3025b-ed61-4d0d-815f-31c008eb33fc"; //  صندوق دار

  //   //   if (
  //   //     this.form.role_id.indexOf(cashier_id) > -1 ||
  //   //     this.form.role_id.indexOf( warehouseman_id) > -1
  //   //   ) {
  //   //     this.cheke = true;
  //   //   } else {
  //   //     this.cheke = false;
  //   //   }
  //   //   if(this.form.role_id.indexOf(user) > -1){
  //   //     this.cheke_user = false
  //   //   }else{
  //   //     this.cheke_user = true
  //   //   }

  //   // },
  // },
  mounted() {
    this.$store.dispatch("setting/getRoleServer");
    if (this.form.role_id.indexOf(this.$store.state.auth.role.user_id) > -1) {
      this.is_user = true;
    }
    if (this.modelId) {
      this.loadData();
    }
    this.loadInternals();
    this.companiesList();
    // this.loadState().then((res) => {
    //   res.filter((x) => {
    //     this.province.push({
    //       text: x.name,
    //       value: x.id,
    //     });
    //   });
    // });
  },
  methods: {
    companiesList() {
      this.loading = true;
      this.$reqApi("company")
        .then((res) => {
          let items = [];
          for (let i = 0; i < res.model.data.length; i++) {
            const x = res.model.data[i];
            items.push({
              text: x.fa_name + " | " + x.en_name,
              value: x.id,
            });
            this.companies = items;
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      if (this.parent_id.length > 0) {
        this.form.parent_id = this.parent_id[0].id;
      }
      let form = this.$copyForm(this.form);
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      } else {
        form["manual"] = "manual";
      }

      form.username = this.$FarsiToEnglishNumber(form.username);
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          this.form.user_id = response.model.user_id;
          this.form.role_id = response.model.role_id;
          this.form.id = this.modelId;
          this.form.user_status = response.model.status;
          this.form.username = response.model.username;
          this.form.password = response.model.password;
          this.form.birth_date = response.model.birth_date;
          this.form.company_id = response.model.company_id;
          this.form.post = response.model.post;
          this.form.last_name = response.model.last_name;
          this.form.person_type = response.model.person_type;
          this.form.first_name = response.model.first_name;
          this.form.email = response.model.email;
          this.form.description = response.model.description;
          this.form.status_work = response.model.status_work;
          this.form.avatar = response.model.avatar;
          this.form.region_id = response.model.region_id;
          this.form.parent_id = response.model.parent_id;
          this.form.national_code = response.model.national_code;
          this.form.branch_id = response.model.branch_id;
          this.form.internal_id = response.model.internal_id;
          this.form.internal_port = response.model.internal_port;
          if (response.model.parent) {
            this.parent_id = [response.model.parent];
          }
          if (response.model.categories.length > 0) {
            response.model.categories.map((x) => {
              this.form.category_id.push({
                text: x.value,
                value: x.id,
              });
            });
          }

          if (Array.isArray(response.model.roles)) {
            this.form.role_id = response.model.roles.map((x) => x.id);
          }

          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    loadCategoryUser() {
      let filters = {
        key: {
          op: "=",
          value: "category_user",
        },
      };

      this.$reqApi("/setting", { filters: filters })
        .then((response) => {
          this.category_users = response.model.data.map((x) => ({
            value: x.id,
            text: x.value,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    // loadState() {
    //   return new Promise((response, rej) => {
    //     let filters = {
    //       level: {
    //         op: "=",
    //         value: "province",
    //       },
    //     };
    //     this.$reqApi("/shop/country-division", {
    //       filters: filters,
    //       row_number: 3000000,
    //     })
    //       .then((res) => {
    //         response(res.model.data);
    //       })
    //       .catch((err) => {
    //         return err;
    //       });
    //   });
    // },
    // filterProvince(id) {
    //   return new Promise((res, rej) => {
    //     let filter = {
    //       id: id,
    //     };
    //     this.$reqApi("/shop/country-division", { filters: filter }).then(
    //       (res) => {
    //         if (res.model.data) {
    //           this.form.province_id = res.model.data[0].cd2_id;
    //           setTimeout(() => {
    //             this.form.address.country_division_id = res.model.data[0].id;
    //           }, 500);
    //         }
    //       }
    //     );
    //   });
    // },
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
        this.$reqApi("/shop/country-division", {
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
    loadInternals() {
      this.$reqApi("/internal")
        .then(async (response) => {
          let items = [];
          response.model.data.forEach((x) => {
            items.push({
              text: x.server_name + " | " + x.start_port + " - " + x.end_port,

              value: x.id,
            });
          });
          this.internal_items = items;
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

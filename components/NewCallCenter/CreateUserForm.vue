<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="6">
          <amp-input text="نام" v-model="form.first_name" rules="require" />
        </v-col>
        <v-col cols="12" md="6">
          <amp-input text="نام خانوادگی" v-model="form.last_name" rules="" />
        </v-col>
        <v-col cols="12" md="6">
          <amp-input
            class="ltr-item"
            text=" شماره همراه "
            rules="phone,require"
            v-model="form.username"
          />
        </v-col>
        <v-col cols="12" md="6">
          <amp-input
            class="ltr-item"
            text=" رمز عبور "
            type="password"
            :rules="modelId ? 'password' : 'require,password'"
            v-model="form.password"
          />
        </v-col>

        <v-col cols="12" md="6">
          <amp-autocomplete
            text="دسته بندی کاربر"
            chips
            multiple
            rules="require"
            v-model="form.category_id"
            :items="category_users"
          />
        </v-col>

        <v-col cols="12" md="6">
          <amp-input
            text="کد ملی"
            rules="nationalCode"
            :is-number="true"
            v-model="form.national_code"
          />
        </v-col>
      </v-row>
      <v-row class="align-center pa-2 justify-center my-2">
        <amp-button
          text="ایجاد کاربر"
          height="38"
          class="ma-2"
          :loading="loading"
          color="blue-grey"
          @click="submit"
          :disabled="!valid || loading"
        />
        <amp-button
          text="انصراف"
          height="38"
          class="ma-2"
          color="red"
          @click="backStep"
          :disabled="loading"
        />
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
      person_type: "real",
      internal_port: "",
      status_work: "active",
      role_id: [],
      category_id: [],
      national_code: "",
      status: "active",
    },
  }),

  mounted() {
    this.loadCategoryUser();
  },
  methods: {
    submit() {
      this.loading = true;

      if (Boolean(this.roleId)) {
        this.form.role_id = [this.roleId];
      }
      let form = this.$copyForm(this.form);
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        let ids = [];
        if (form.category_id.length > 0) {
          for (let i = 0; i < form.category_id.length; i++) {
            const x = form.category_id[i];
            if (typeof x == "object") {
              ids.push(x.value);
            }
          }
        }
        form.category_id = ids;
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
          this.backStep();
          this.loading = false;

        })
        .catch((error) => {
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


    backStep() {
   this.$emit("backStep")
    },
  },
};
</script>

<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid>
      <v-col cols="12" class="text-center d-flex align-center justify-center">
        <v-row>
          <v-col cols="12" md="2">
            <amp-select
              rules="require"
              text="نوع مالکیت"
              v-model="form.ownership_type"
              :items="$store.state.static.ownership_type_agancy"
            />
          </v-col>
          <v-col cols="12" md="2">
            <UserSelectForm
              text="کاربران"
              v-model="user"
              url="user"
              rules="require"
              :role-id="[]"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-jdate
              text="تاریخ تولد"
              rules="require"
              :is-number="true"
              v-model="form.birth_date"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-input
              text="کد ملی"
              rules="nationalCode,require"
              :is-number="true"
              v-model="form.national_code"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-input
              text="متراژ ساختمان (متر مربع)"
              rules="number,require"
              v-model="form.size_store"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-input
              text="استان"
              rules="require"
              v-model="form.agency_province"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-input text="شهر" rules="require" v-model="form.agency_city" />
          </v-col>
          <v-col cols>
            <amp-input
              text="آدرس دقیق"
              rules="require"
              v-model="form.agency_address"
            />
          </v-col>
        </v-row>
      </v-col>

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
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/agency-request/insert",
    updateUrl: "/agency-request/update",
    showUrl: "/agency-request/show",
    user: [],
    form: {
      first_name: "",
      last_name: "",
      birth_date: "",
      national_code: "",
      phone_number: "",
      agency_province: "",
      agency_city: "",
      agency_address: "",
      size_store: "",
      ownership_type: "",
      pdf_path: "98418س41زر1طز1رط5رطزر1ط5ر1ط8ر14طر1طز5ر1طزر1",
    },
  }),

  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  watch: {
    user: {
      deep: true,
      handler() {
        if (this.user.length > 0 && !Boolean(this.modelId)) {
          this.form.national_code = Boolean(this.user[0].national_code)
            ? this.user[0].national_code
            : "";
          this.form.phone_number = Boolean(this.user[0].username)
            ? this.user[0].username
            : "";
          this.form.first_name = Boolean(this.user[0].first_name)
            ? this.user[0].first_name
            : "";
          this.form.last_name = Boolean(this.user[0].last_name)
            ? this.user[0].last_name
            : "";
          this.form.birth_date = Boolean(this.user[0].birth_date)
            ? this.user[0].birth_date
            : "";
          console.log("this.form ==> ", this.form);
        }
        console.log("user ==> ", this.user);
      },
    },
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
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          console.log("response ==> ", response);
          let data = response.model;
          console.log("data ==> ", data);
          for (let key in data) {
            this.form[key] = data[key];
          }

          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
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

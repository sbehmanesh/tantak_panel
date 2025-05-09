<template>
  <v-form @submit.prevent="submit()" :disabled="loading" v-model="valid">
    <v-container fluid class="px-8">
      <v-row dense class="justify-center">
        <v-col cols="12" md="2">
          <amp-select
            text="وضعیت"
            rules="require"
            v-model="form.status"
            :items="$store.state.static.sms_template_status"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            text="نام فارسی الگو"
            rules="require,fa_chart"
            v-model="form.fa_name"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            dir="ltr"
            text="نام انگلیسی الگو"
            rules="require,en_chart"
            v-model="form.en_name"
          />
        </v-col>
        <v-col cols="12" md="2">
          <UserSelectForm
            text="انتخاب مدیر"
            rules="require"
            v-model="selected_admin"
            url="/user/searchByRole"
            :role-id="role_id"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="نوع پرداخت"
            rules="require"
            v-model="form.kind_set"
            :items="$store.state.static.sms_template_kind_set"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <amp-textarea
            text="محتوا"
            rules="max_200,require"
            v-model="form.content"
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
            :text="templateId ? 'ویرایش' : 'ثبت'"
            :loading="loading"
            :disabled="!valid || loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import UserSelectForm from "../User/UserSelectForm.vue";
export default {
  components: { UserSelectForm },
  name: "add-template",
  props: {
    templateId: { default: null },
    updateUrl: { type: String },
    createUrl: { type: String },
  },
  data() {
    return {
      loading: false,
      valid: false,
      role_id: [],
      selected_admin: "",
      form: {
        user_id: "",
        status: "",
        en_name: "",
        fa_name: "",
        content: "",
        kind_set: "",
      },
    };
  },
  beforeMount() {
    this.loadData();
    this.role_id.push(this.$store.state.auth.role.admin_id);
  },
  methods: {
    loadData() {
      if (this.templateId) {
        this.loading = true;
        this.$reqApi("sms-template/show", { id: this.templateId })
          .then((response) => {
            let data = response.model;
            this.form.user_id = data.id;
            this.form.fa_name = data.fa_name;
            this.form.en_name = data.en_name;
            this.form.status = data.status;
            this.form.content = data.content;
            this.form.kind_set = data.kind_set;
            this.loading = false;
          })
          .catch((e) => {
            console.log(e);
            this.loading = false;
          });
      }
    },
    submit() {
      this.loading = true;
      const form = this.templateId
        ? { ...this.form, id: this.templateId }
        : { ...this.form };
      form.user_id = this.selected_admin[0]?.id;
      let url = Boolean(this.templateId) ? this.updateUrl : this.createUrl;
      this.$reqApi(url, form)
        .then((response) => {
          this.loading = false;
          this.$toast.success("اطلاعات ثبت شد");
          this.redirectPage();
        })
        .catch((e) => {
          console.log(e);
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

<style></style>

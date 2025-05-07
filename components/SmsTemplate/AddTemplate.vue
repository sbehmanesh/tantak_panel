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
            text="انتخابگر"
            :multi="false"
            :roleId="['791d1b02-3610-4177-9051-eb7ae6b72def']"
            v-model="selecteduser"
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
          <amp-textarea text="محتوا" rules="require" v-model="form.content" />
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
      admin_id: [],
      selecteduser: "",
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
  watch: {
    selecteduser(new_al) {
      console.log(new_al)
    },
  },
  beforeMount() {
    this.loadData();
    this.admin_id.push(this.$store.state.auth.role.admin_call_center_id);
    console.log(this.$store.state.auth.role.admin_call_center_id);
    console.log(this.admin_id);
  },
  methods: {
    loadData() {
      if (this.templateId) {
        this.loading = true;
        this.$reqApi("sms-template/show", { id: this.templateId })
          .then((response) => {
            let data = response.model;
            // console.log(data);
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
      console.log(this.selecteduser);
      this.loading = true;
      const form = { ...this.form };
      form.user_id = this.$store.state.auth.user.id;
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

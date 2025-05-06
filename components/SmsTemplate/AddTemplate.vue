<template>
  <v-form @submit.prevent="submit()" :disabled="loading" v-model="valid">
    <v-container fluid class="px-8">
      <v-row dense>
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
            text="نام انگلیسی الگو"
            rules="require,en_chart"
            v-model="form.en_name"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input text="محتوا" rules="require" v-model="form.content" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input text="تست اخر" rules="require" v-model="form.kind_set" />
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
            :text="dayinsId ? 'ویرایش' : 'ثبت'"
            :loading="loading"
            :disabled="!valid || loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "add-Dayins",
  props: {
    templateId: { default: null },
    updateUrl: { type: String },
    createUrl: { type: String },
  },
  data() {
    return {
      loading: false,
      valid: false,
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
    // this.loadData();
  },
  methods: {
    loadData() {
      // if (this.dayinsId) {
      //   this.loading = true;
      //   this.$reqApi("dayins-plan/show", { id: this.dayinsId }).then(
      //     (response) => {
      //       let data = response.model;
      //       // console.log(data);
      //       this.form.id = data.id;
      //       this.form.name = data.name;
      //       this.form.price_year = data.price_year;
      //       this.form.status = data.status;
      //       this.form.description = data.description || "";
      //       this.loading = false;
      //     }
      //   );
      // }
    },
    submit() {
      this.loading = true;
      const form = { ...this.form };
      let insert = this.createUrl;
      this.$reqApi(insert, form).then((response) => {
        this.loading = false;
        this.$toast.success("اطلاعات ثبت شد");
      });
      // let update = this.updateUrl;
      // if (this.dayinsId) {
      //   this.$reqApi(update, form).then((response) => {
      //     this.loading = false;
      //     if (this.dayinsId) {
      //       this.$toast.success("اطلاعات ویرایش شد");
      //     }
      //   });
      // } else {
      //   this.$reqApi(insert, form).then((response) => {
      //     this.loading = false;
      //     this.$toast.success("اطلاعات ثبت شد");
      //   });
      // }
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
  computed: {},
};
</script>

<style></style>

<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2 d-flex justify-center">
      <v-col cols="12" md="3">
        <amp-input text="نام" rules="require" v-model="form.name"></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-autocomplete
          text="نقش"
          chips
          multiple
          rules="require"
          v-model="form.role_id"
          :items="$store.state.setting.roles"
        />
      </v-col>
      <v-col cols="12" md="3" class="d-flex justify-center">
        <amp-help :text="helpText" v-if="helpText" />
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
        text="تایید"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loading"
        :loading="loading"
      ></amp-button>
    </v-row>
  </v-form>
</template>
    
    <script>
export default {
  props: {
    roleId: { default: null },
    modelId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      helpText: `
      پس از ایجاد دسته بندی به منوی
      <span class ="font_bold mx-1"> کاربران  >>  نقش  ها </span>
       
      رفته و با توجه به نیاز دسترسی ها را برای نقش انتخاب کنید 
      <br/>
      
       دسترسی ها  : 
      <br/>
       پشتیبانی 
       <br/>
      پیام های پشتیبانی  
      <br/>
      دسترسی ویژه
     
      `,
      valid: true,
      loading: false,
      form: {
        role_id: [],
        name: "",
      },
    };
  },
  mounted() {
    if (Boolean(this.roleId)) {
      this.form.role_id = [this.roleId];
    }
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (this.modelId) {
        form["id"] = this.modelId;
      }
      let url = this.modelId ? "/ticket-group/update" : "/ticket-group/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;

          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/ticket-group/show", { id: this.modelId })
        .then((res) => {
          this.form.name = res.model.name;
          setTimeout(() => {
            if (Array.isArray(res.model.roles)) {
              this.form.role_id = res.model.roles.map((x) => x.id);
            }
          }, 200);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/ticket-group");
      }
    },
  },
};
</script>
    
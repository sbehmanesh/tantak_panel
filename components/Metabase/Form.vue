<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="px-15">
        <v-col cols="12" md="6">
          <amp-input text="عنوان  " v-model="form.title" rules="require" />
        </v-col>
            <v-col cols="12" md="6">
          <amp-autocomplete
            text="نقش های مرتبت"
            chips
            rules="require"
            multiple
            v-model="form.role_ids"
            :items="$store.state.setting.roles"
          />
        </v-col>
        <v-col cols="12" md="4">
          <amp-select
            :items="$store.state.static.status"
            text="وضعیت"
            v-model="form.status"
          />
        </v-col>
        <v-col cols="12" md="4">
          <amp-input
            cClass="ltr-item"
            text="شناسه داشبورد"
            v-model="form.metabase_id"
            rules="require,number"
          />
        </v-col>
    

        <v-col cols="12" md="4">
          <amp-select
            text="نوع داشبورد"
            rules="require"
            v-model="form.type"
            :items="this.$store.state.static.metabase_type"
          />
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-card class="pa-5 elevation-5" outlined>
            <v-banner>
              <div class="d-flex align-center">
                <h1 class="font_20">
                  پارامتر های ورودی

                  <br />
                  <small class="font_11 grey--text">
                    ; در ثبت پارامتر , کلید های وارد شده فقط باید انگلیسی باشند
                    مثال : user_name , first_name , ...
                  </small>
                </h1>

                <v-spacer></v-spacer>
                <v-btn @click="addParameter" dark color="blue-grey">
                  <h1 class="font_15">ثبت پارامتر <v-icon> add</v-icon></h1>
                </v-btn>
              </div>
            </v-banner>
            <v-row class="mt-3">
              <v-col
                class="d-flex align-center px-0"
                cols="6"
                md="4"
                v-for="(x, i) in metabases_parameters"
                :key="i"
              >
                <v-chip>
                  <h1>
                    {{ i + 1 }}
                  </h1>
                </v-chip>
                <v-col cols="9" class="pa-0 text-center">
                  <amp-input
                    text="کلید را وارد کنید"
                    v-model="x.value"
                    placeholder="مثال  : phone_number"
                    cClass="ltr-item"
                  ></amp-input>
                </v-col>
                <v-btn @click="deleteParameters(i)" icon>
                  <v-icon size="20" color="red">close</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center mt-5">
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
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/metabase/insert",
    updateUrl: "/metabase/update",
    showUrl: "/metabase/show",
    metabases_parameters: [],
    selected: {},
    form: {
      type: "",
      title: "",
      status: "",
      metabase_id: "",
      request_body: [],
      role_ids: [],
    },
  }),

  beforeMount() {
    this.$store.dispatch("setting/getRoleServer");
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      if (this.metabases_parameters.length > 0) {
        form.request_body = this.metabases_parameters.map((x) => {
          return x.value;
        });
      }
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
          const res = response.model;
          console.log("response ==> ", res);
          for (let key in res) {
            this.form[key] = res[key];
          }
          this.form.role_ids = res.roles.map((x) => x.id);
          for (let i = 0; i < res.request_body.length; i++) {
            const x = res.request_body[i];
            this.metabases_parameters.push({ value: x });
          }
          console.log(
            "  this.metabases_parameters ==> ",
            this.metabases_parameters
          );
          this.loading = false;
          // this.form["id"] = response.id;
          // this.form.key = response.key;
          // this.form.value = JSON.parse(response.value);
          // this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    addParameter() {
      this.metabases_parameters.push({ value: "" });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
    deleteParameters(index) {
      this.metabases_parameters.splice(index, 1);
    },
  },
};
</script>

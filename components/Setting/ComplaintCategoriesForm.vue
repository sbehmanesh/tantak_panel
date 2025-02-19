<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input
            text="عنوان دسته بندی"
            v-model="form.category"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-autocomplete
            text="نقش"
            rules="require"
            v-model="form.role_id"
            :items="$store.state.setting.roles"
          />
        </v-col>
        <v-col cols="12" md="6">
          <amp-textarea :rows="1" text="توضیحات " v-model="form.description" />
        </v-col>
        <v-col cols="12" class="mb-4">
          <v-card class="pa-2 d-flex align-center elevation-0 px-4">
            <span class="font_15"> ثبت زیر مجموعه </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="actionSub(true)">
              <v-icon> add_circle </v-icon></v-btn
            >
          </v-card>
          <v-divider></v-divider>
          <v-divider></v-divider>
        </v-col>

        <v-row class="px-1" v-if="!loading">
          <v-col cols="12" md="6" v-for="(x, i) in sub_category" :key="i">
            <v-card class="elevation-5" outlined>
              <v-col cols="12" class="d-flex align-center">
                <v-chip>
                  <h1>
                    <h1>{{ i + 1 }}</h1>
                  </h1>
                </v-chip>
                <v-spacer></v-spacer>

                <v-btn icon @click="actionSub(false, i)">
                  <v-icon> delete</v-icon>
                </v-btn>
              </v-col>
              <amp-input
                text="عنوان  زیر مجموعه"
                v-model="x.title"
                rules="require"
              />
            </v-card>
          </v-col>
        </v-row>
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
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/complaint-category/insert",
    updateUrl: "/complaint-category/update",
    showUrl: "/complaint-category/show",
    sub_category: [],
    selected: {},
    form: {
      category: "",
      role_id: " ",
      description: "",
      subcategory: [],
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
      if (this.sub_category.length == 0) {
        this.$toast.info("لطفا زیر مجوعه ها را تعریف کنید");
        return;
      }
      let items = [];
      this.sub_category.map((x) => {
        items.push(x.title);
      });
      this.form.subcategory = items;
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
          let data = response.model
          for(let key in data){
            this.form[key] = data[key]
          }
       if (data.subcategory.length > 0) {
        let items  =[]
        data.subcategory.map((x)=>{
          items.push({
            title:x
          })
        })
        this.sub_category = items
       }
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    actionSub(insert, index = null) {

      this.loading = true;
      if (Boolean(insert)) {
        this.sub_category.push({
          title: "",
        });
      } else if ( !Boolean(insert)) {
        let items = this.sub_category;
        items.splice(index, 1);
        this.sub_category = items;
      }
      this.loading = false;
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

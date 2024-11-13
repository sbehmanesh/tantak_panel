<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="عنوان دسته بندی" v-model="form.name" rules="require" />
        </v-col>

        <v-col cols="12" md="3">
          <amp-input text="لینک" v-model="form.slug" rules="" />
        </v-col>

        <v-col cols="12" md="3">
          <amp-autocomplete
            text="دسته بندی والد"
            v-model="form.parent_id"
            :disabled="Boolean(this.$route.query.catgory_id)"
            :items="categories"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-input text="ترتیب نمایش" v-model="form.sort" rules="number" />
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
export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/category/insert",
    updateUrl: "/category/update",
    showUrl: "/category/show",
    categories: [],

    form: {
      id: "",
      name: "",
      slug: "",
      parent_id: "",
      sort: 1,
    },
  }),

  mounted() {
    if (Boolean(this.$route.query.catgory_id)) {
      this.form.parent_id = this.$route.query.catgory_id;
    }
    if (this.modelId) {
      this.loadData();
    }
    this.getCategories();
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
       response = response.model;
          this.form["id"] = response.id;
          this.form.name = response.name;
          this.form.slug = response.slug;
          this.form.parent_id = response.parent_id;
          this.form.sort = response.sort;
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
    getCategories() {
      let form = {
        row_number: 2000,
      };

      this.$reqApi("/category", form)
        .then((response) => {
          this.categories = response.model.data
            .filter((x) => !x.parent_category_id && this.modelId != x.id)
            .map((x) => ({
              value: x.id,
              text: x.name,
            }));

          this.categories.push({
            value: "",
            text: "بدون والد",
          });

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <div>
    <v-dialog persistent v-model="dialog" width="500">
      <v-card class="pa-3">
        <v-row class="mx-2 mt-1 align-center">
          <h1 class="font_14 mr-2">ثبت شکایت در مورد مشتری</h1>
          <v-spacer></v-spacer>
          <v-icon class="ml-5" large> badge </v-icon>
          <v-col cols="12 " class="mt-0">
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="submit()">
            <v-row>
              <v-col cols="12" md="12">
                <amp-select
                  text="دسته بندی"
                  v-model="form.category_id"
                  :items="category"
                  rules="require"
                />
                <amp-select
                  text="زیر دسته"
                  rules="require"
                  :items="subcategory"
                  v-model="form.subcategory"
                  :disabled="!Boolean(form.category_id)"
                />
                <AmpUploadFileNew
                  text="بارگذاری فایل"
                  v-model="form.file"
                  class="mb-5"
                />
                <amp-textarea text="توضیحات" v-model="form.description" />
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="4">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  type="submit"
                  class="ma-1"
                  :loading="loading"
                  :disabled="loading || !valid"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-button
                  text="انصراف"
                  height="38"
                  block
                  color="red darken-2"
                  @click="closeDialog"
                  class="ma-1"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },
    userId: {
      require: false,
      default: false,
    },
    modelId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    role_id: "",
    subcategory: [],
    category: [],
    loading: false,
    form: {
      description: "",
      subcategory: "",
      category_id: "",
      file: "",
    },
  }),
  beforeMount() {
    this.loadCategory();
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  watch: {
    "form.category_id"() {
      let find = this.category.find((x) => x.value == this.form.category_id);
      if (Boolean(find.items)) {
        find.items.map((y) => {
          this.subcategory.push({ text: y, value: y });
        });
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form["user_id"] = this.userId;
      if (Boolean(this.modelId)) {
        form["id"] = this.modelId;
      }
      let url = Boolean(this.modelId)
        ? "complaint/update"
        : "complaint/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("عملیات با موفقیت انجام  شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("complaint/show", { id: this.modelId })
        .then(async (response) => {
          for(let key in response.model){
            this.form[key] = response.model[key]
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadCategory() {
      let filter_role = [];
      this.$store.state.auth.user.roles.map((x) => {
        filter_role.push(x.id);
      });
      let filters = {
        op: "in",
        value: filter_role,
      };
      this.$reqApi("complaint-category", { filters: filters })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            items.push({
              text: x.category,
              value: x.id,
              items: x.subcategory,
            });
          }

          this.category = items;
        })
        .catch((err) => {});
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

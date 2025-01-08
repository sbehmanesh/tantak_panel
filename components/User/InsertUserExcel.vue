<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="500">
      <v-card style="overflow: hidden">
        <v-col cols="12" class="d-flex align-center">
          <span class="font_16">ایجاد کد کاربر با استفاد از اکسل</span>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog" icon>
            <v-icon color=""> close </v-icon>
          </v-btn>
        </v-col>
        <v-divider></v-divider>
        <v-form
          v-model="valid"
          @submit.prevent="submit()"
          :disabled="loading"
          class="rounded-0 pa-2 d-flex flex-column justify-center"
        >
          <v-row class="align-center d-flex pa-4 justify-center">
            <v-col cols="12" md="10">
              <v-file-input
                color="primary"
                label="بارگذاری اکسل"
                v-model="form.file"
                accept=".xlsx"
              ></v-file-input>

              <div class="text-center mt-4">
                <v-btn text icon @click="open">
                  <v-icon>downloading</v-icon>
                </v-btn>
                <br />
                <small> فایل نمونه </small>
              </div>
            </v-col>
          </v-row>

          <v-row class="ma-2 justify-center" v-if="Boolean(form.file)">
            <v-col cols="12" md="10">
              <amp-autocomplete
                text="نقش"
                rules="require"
                v-model="form.role_id"
                :items="$store.state.setting.roles"
              />
              <amp-autocomplete
                text="دسته بندی"
                rules="require"
                v-model="form.category_id"
                :items="user_category"
              />
            </v-col>
          </v-row>
          <v-row class="ma-1 d-flex justify-center" v-if="Boolean(form.file)">
            <amp-button
              text="تایید"
              type="submit"
              icon="done"
              class="ma-1"
              :disabled="!Boolean(form.category_id) ||!Boolean(form.role_id) || loading"
              :loading="loading"
            ></amp-button>
          </v-row>
        </v-form>
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

    couponId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,

      user_category: [],

      show_dialog: false,
      now: "",
      form: {
        role_id: "",
        category_id: "",
        file: null,
      },
    };
  },
  mounted() {
    this.$store.dispatch("setting/setgetRegion");
    this.loadCategory();
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.form.file == null) {
        this.loading = false;
        return this.$toast.error("بارگذاری اکسل اجباری می باشد");
      }

      let form = { ...this.form };
      let formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }

      let url = "/user/insert-excel";
      this.$reqApi(url, formData)
        .then((res) => {
          this.loading = false;
          this.$emit("reload");
          this.closeDialog();
          this.$toast.success("عملیات با  موفقیت انجام شد")
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    loadCategory() {
      this.$reqApi("/setting", { filters: { key: "category_user" } })
        .then(async (response) => {
          let items = [];
          if (response.model.data.length > 0) {
            for (let index = 0; index < response.model.data.length; index++) {
              const element = response.model.data[index];
              items.push({
                text: element.value,
                value: element.id,
              });
            }
            this.user_category = items;
          }
        })
        .catch((error) => {});
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    open() {
      window.open("https://test-api.tantak.ir/example/user.xlsx");
    },
  },
};
</script>

<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="4">
            <amp-input
              class="ltr-item"
              text="ارسال کننده"
              rules="phone,require"
              v-model="form.sender"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-input
              class="ltr-item"
              text="شناسه پیام"
              rules="require,number"
              v-model="form.messageid"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-input
              class="ltr-item"
              text="گیرنده"
              rules="require,number"
              v-model="form.receptor"
            />
          </v-col>
          <v-col cols="12" md="12">
            <amp-textarea               rules="require" text="متن پیام" v-model="form.message"></amp-textarea>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="12"> </v-col>
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
  </div>
</template>

<script>
export default {
  props: {
    roleId: { default: null },
    modelId: { default: null },
    path: { default: "/message" },
    showUrl: { default: "/message/show" },
    createUrl: { default: "/message/insert" },
    updateUrl: { default: "/message/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    headers: [],
    items: [],
    actions: [],
    title: "ناحیه ها",
    form: {
      sender: "",
      messageid: "",
      receptor: "",
      message: "",
    },
  }),
  beforeMount() {
    if (this.modelId) {
      this.loadData();
    }
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
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
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
          for (let key in response.data) {
            if (key == "user") {
              this.form.sender = response.data.user[0].username;
            } else {
              this.form[key] = response.data[key];
            }
          }

          this.loading = false;
        })
        .catch((error) => {
          // this.redirectPage();
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

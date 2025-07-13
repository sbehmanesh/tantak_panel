<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 py-5 d-flex flex-column"
  >
    <v-row class="ma-2 d-flex justify-center">
      <v-col cols="12" md="4">
        <amp-input
          cClass="ltr-item"
          text="مبلغ درخواستی (ریال)"
          v-model="form.amount"
          is-price
          rules="price,require"
        ></amp-input>
        <AmpUploadFileNew multiple title="تصویر چک / سفته" v-model="form.file" />
      </v-col>
    </v-row>
    <v-row class="ma-1 d-flex justify-center mt-5">
      <amp-button
        text="انصراف"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        :text="modelId ? 'ویرایش' : 'افزودن'"
        type="submit"
        icon="done"
        :disabled="!valid || loading"
        class="ma-1"
        :loading="loading"
      ></amp-button>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: {
      require: false,
      default: false,
    },
    updateUrl: { default: "/credit-request/update" },
    createUrl: { default: "/credit-request/insert" },
    showUrl: { default: "/credit-request/show" },
  },
  data() {
    return {
      valid: false,
      loading: false,
      start: "",
      end: "",
      form: {
        amount: "",
        file: [],
      },
    };
  },

  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      if (this.form.file.length == 0) {
        this.$toast.info("بارگذاری تصویر اجباری است");
        return;
      }
      this.loading = true;
      if (Boolean(this.modelId)) {
        this.form["id"] = this.modelId;
      }
      let form = this.$copyForm(this.form);
      let url = this.modelId ? this.updateUrl : this.createUrl;
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.loading = false;
          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then((response) => {
          this.loading = false;
          // this.form.status = response.model.status;
          // this.form.sort = response.model.sort;
          // let numbers = substrings.map((substring) => Number(substring));
          // this.start = numbers[0];
          // this.end = numbers[1];
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    back() {
      this.$router.back();
    },
  },
};
</script>

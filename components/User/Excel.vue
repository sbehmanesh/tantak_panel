<template>
  <div>
    <v-dialog persistent v-model="dialog.show" :model-id="dialog.items" width="570">
      <v-card>
        <v-toolbar class="primary white--text">
          <span style="font-size: 18px"> شارژ کیف پول با اکسل </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon color="white"> close </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form
            v-model="valid"
            @submit.prevent="submit()"
            :disabled="loading"
            class="rounded-0 d-flex flex-column"
          >
            <v-row class="d-flex mt-3 justify-center">
              <v-col cols="12" md="12">
                <amp-select
                  text="نوع"
                  rules="require"
                  v-model="form.type"
                  :items="$store.state.static.wallet_kind"
                />
              </v-col>
              <v-col cols="12" md="12">
                <amp-select
                  text="بابت"
                  :items="for_wallet"
                  rules="require"
                  v-model="form.pay_text"
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-file-input
                  color="blue"
                  label="بارگذاری اکسل"
                  v-model="form.excel"
                  accept=".xlsx"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center mt-8">
              <v-col cols="6">
                <amp-button
                  block
                  height="40"
                  type="submit"
                  color="orange"
                  class="ma-1"
                  text="تایید"
                />
              </v-col>
            </v-row>
            <div>
              <v-btn title="مشاهده و بارگیری" icon @click="open">
                <v-icon size="30"> download </v-icon>
              </v-btn>
              <br />
              <span style="font-size: 11px">فایل نمونه</span>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
let jmoment = require("moment");
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      for_wallet: [],
      insurance: [],
      form: {
        pay_text: "",
        type: "",
        excel: null,
      },
    };
  },
  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
  },
  mounted() {
    this.loadForwallet();
  },
  methods: {
    submit() {
      this.loading = true;
      let formData = new FormData();
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
     
      if (this.form.excel == null) {
        this.loading = false;
        return this.$toast.error("بارگذاری اکسل اجباری می باشد");
      }
      let url = "/wallet/insert-excel";
      this.$reqApi(url, formData)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("عملیات با موفقیت انجام شد")
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadForwallet() {
      this.$reqApi("/setting", { filters: { key: "for_wallet" } })
        .then(async (response) => {
          let items = [];
          if (response.model.data.length > 0) {
            for (let index = 0; index < response.model.data.length; index++) {
              const element = response.model.data[index];
              items.push({
                text: element.value,
                value: element.value,
              });
            }
            this.for_wallet = items;
          }
        })
        .catch((error) => {});
    },
    relod() {
      this.$emit("relod");
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    open() {
      window.open("https://test-api.tantak.ir/example/wallet.xlsx");
    },
  },
};
</script>

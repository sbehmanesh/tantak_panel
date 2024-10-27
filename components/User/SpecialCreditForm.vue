<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-card :disabled="Boolean(modelId)" class="elevation-0">
      <v-row class="ma-2">
        <v-col cols="12" md="3" v-if="!Boolean(this.$route.query.id)">
          <amp-autocomplete
            :disabled="Boolean($route.query.id)"
            :items="users"
            rules="require"
            v-model="form.user_id"
            text=" انتخاب کاربر"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="میزان تومانی اعتبار"
            v-model="form.price"
            rules="require"
            is-price
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-jdate
            text=" تاریخ شروع "
            rules="require"
            v-model="form.start_at"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-jdate
            text="حداکثر مهلت استفاده"
            rules="require"
            :min="now"
            v-model="form.end_at"
          />
        </v-col>
        <v-col cols>
          <amp-textarea :rows="1" text="توضیحات" v-model="form.description" />
        </v-col>
      </v-row>
    </v-card>

    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="برگشت"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        v-if="!modelId"
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
let jmoment = require("moment");
export default {
  props: {
    modelId: {
      require: false,
      default: false,
    },

  },
  data() {
    return {
      valid: true,
      loading: false,
      loading_trans: false,

      insurance: [],
      transactions: [],
      send_info_trasnsaction: {},
      users: [],
      company: [],
      now: "",
      left_over: "",
      total_transaction: "",
      form: {
        price: "",
        end_at: "",
        user_id: "",
        start_at: "",
        company_id: "",
        insurance_id: "",
        description: "",
      },
    };
  },

  mounted() {
    if (Boolean(this.$route.query.id)) {
      this.form.user_id = this.$route.query.id
    }
    this.now = jmoment().format("YYYY-MM-DD");
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
      let url = this.modelId
        ? "/special-amount/update"
        : "/special-amount/insert";
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
      return new Promise((response, rej) => {
        let send_info_trasnsaction = {};
        this.loading = true;
        this.loading_trans = true;
        this.$reqApi("/special-amount/show", { id: this.modelId })
          .then((res) => {
            this.form.price = res.data.price;
            this.form.end_at = res.data.end_at;
            this.form.user_id = res.data.user_id;
            this.form.start_at = res.data.start_at;
            this.form.company_id = res.data.company_id;
            this.form.insurance_id = res.data.insurance_id;
            this.form.description = res.data.description;
            if (res.data.transactions && res.data.transactions.length > 0) {
              let items = [];
              res.data.transactions.forEach((x) => {
                let status = "";
                (status = this.$getItemEnum(
                  this.$store.state.static.type_transaction,
                  x.status
                )),
                  items.push({
                    id: x.id,
                    price: x.price,
                    status: status,
                    text_log: x.text_log ? x.text_log : "--",
                  });
              });

              send_info_trasnsaction["main_price"] = this.form.price;
              send_info_trasnsaction["id"] = this.modelId;
              send_info_trasnsaction["transactions"] = items;
            }
            this.loading = false;

            response(send_info_trasnsaction);
          })
          .catch((err) => {
            this.loading = false;
          });
      })
        .then((response) => {
          this.send_info_trasnsaction = response;
          this.loading_trans = false;
        })
        .catch((rej) => {
          this.loading_trans = false;
          this.loading = false;
        });
    },
    loadUser() {
      this.loading = true;
      this.$reqApi("/user", { row_number: 2000 })
        .then(async (response) => {
          this.users = response.model.data.map((x) => {
            let text = "";
            if (x.first_name) {
              if (x.last_name) {
                text = x.first_name + " " + x.last_name;
              } else {
                text = x.first_name;
              }
            } else {
              if (x.last_name) {
                text = x.last_name;
              } else {
                text = x.username;
              }
            }
            return {
              text: text,
              value: x.id,
            };
          });
          this.loading = false;
          if (this.$route.query.id) {
            this.form.user_id = this.$route.query.id;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadInsurance() {
      this.loading = true;
      this.$reqApi("/insurance", { row_number: 2000 })
        .then(async (response) => {
          this.insurance = response.model.data.map((x) => ({
            text: x.fa_name,
            value: x.id,
          }));
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/special-amount");
      }
    },
  },
};
</script>

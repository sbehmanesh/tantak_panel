<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <UserSelectForm
            rules="require"
            text="کاربر"
            v-model="current_user"
            disabled
            url="user"
            :role-id="[]"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-jdate
            rules="require"
            text="زمان  پرداخت"
            v-model="form.paid_date"
            :is-number="true"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-select
            :items="$store.state.static.wallet_type"
            text="تراکنش"
            rules="require"
            v-model="form.type"
          />
        </v-col>

        <v-col cols="12" md="3">
          <amp-select
            :items="$store.state.static.wallet_kind"
            text="نوع"
            rules="require"
            v-model="form.kind"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            is-price
            text="مقدار ریال/امتیاز"
            rules="require"
            v-model="form.amount"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="بابت"
            :items="for_wallet"
            rules="require"
            v-model="form.pay_text"
          />
        </v-col>
        <v-col cols="12" md="12">
          <amp-textarea text="توضیحات" v-model="form.description" />
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <div class="center-div pa-2">
        <amp-button
          large
          icon="done"
          class="mx-2"
          type="submit"
          color="success"
          :loading="loading"
          :disabled="!valid || loading"
          :text="modelId ? 'ویرایش' : 'ثبت'"
        />
        <amp-button large icon="redo" color="error" text="انصراف" @click="back()" />
      </div>
    </v-container>
  </v-form>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: { UserSelectForm },
  props: { modelId: { default: null } },
  data: () => ({
    valid: false,
    loading: false,
    current_user: [],
    for_wallet: [],

    form: {
      type: "put",
      kind: "",
      user_id: "",
      amount: "",
      pay_text: "",
      paid_date: "",
      description: "",
    },
  }),
  computed: {},
  watch: {},

  mounted() {
    console.log("this.$route.query.id -- > ", this.$route.query.id);
    this.loadForwallet();
    if (this.$route.query.id) {
      this.showUser(this.$route.query.id);
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = "/wallet/insert";
      if (this.modelId) {
        url = "/wallet/update";
        form["id"] = this.modelId;
      } else {
        form["user_id"] = this.current_user[0].id;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.back();
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/");
      }
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
    showUser(user_id) {
      this.loading = true;
      this.$reqApi("/user/show", { id: user_id })
        .then(async (response) => {
          this.current_user = [response.model];

          this.loading = false;
        })
        .catch((error) => {
          this.$router.back();
          this.loading = false;
        });
    },
  },
};
</script>

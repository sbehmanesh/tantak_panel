<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8 mt-15">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="8                    ">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="6" md="3" class="py-0">
                  <UserSelectForm
                    text="انتخاب مدیر"
                    v-model="manager"
                    url="/user/searchByRole"
                    rules="require"
                    :role-id="role_id"
                  />
                </v-col>
                <v-col cols="6" md="3" class="py-0">
                  <amp-input
                    text="سقف درصد کارمز"
                    v-model="form.fee_cap"
                    rules="require,percent"
                    cClass="ltr-item"
                  />
                </v-col>
                <v-col cols="6" md="3" class="py-0">
                  <amp-select
                    :items="$store.state.static.status"
                    text="وضعیت"
                    rules="require"
                    v-model="form.status"
                  />
                </v-col>
                <v-col cols="6" md="3" class="py-0">
                  <amp-autocomplete
                    :disabled="manager.length == 0"
                    text="انتخاب محصول"
                    :items="items_product"
                    v-model="form.product_id"
                  ></amp-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="manager.length > 0" cols="6" class="text-center">
              <v-avatar size="140" v-if="manager.length > 0">
                <v-img :src="$getImage(manager[0].avatar)"></v-img>
              </v-avatar>
              <div v-if="manager.length > 0">
                <b
                  class="font_15"
                  v-if="
                    Boolean(manager[0].first_name) &&
                    Boolean(manager[0].last_name)
                  "
                >
                  {{ manager[0].first_name }} {{ manager[0].last_name }}
                </b>
                <br />
                <b
                  class="font_15 grey--text"
                  v-if="Boolean(manager[0].username)"
                >
                  {{ manager[0].username }}
                </b>
              </div>
            </v-col>
            <v-col v-if="manager.length > 0" cols="6">
              <amp-input
                placeholder="درصد مدیر کالسنتر"
                v-model="form.fee_manager"
                rules="require,percent"
                cClass="ltr-item"
              />
              <amp-input
                placeholder="درصد سرپرست"
                v-model="form.fee_supervisor"
                rules="require,percent"
                cClass="ltr-item"
              />
              <amp-input
                placeholder="درصد فروشنده"
                v-model="form.fee_operator"
                rules="require,percent"
                cClass="ltr-item"
              />
            </v-col>
            <v-col cols="12" v-if="!Boolean(check_percent_fees)">
              <v-alert class="text-center pa-3" color="red" dark prominent>
                <b class="font_15">
                  مجموع درصد های فوق باید برابر با صد باشد
                </b>
              </v-alert>
            </v-col>
          </v-row>
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
            @click="$router.push('/new-call-center/setting-fee')"
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
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    showUrl: "/fee/show",
    settings: [],
    role_id: [],
    manager: [],
    items_product: [],
    selected: {},
    form: {
      manager_id: "",
      fee_cap: "",
      status: "",
      fee_manager: "",
      fee_supervisor: "",
      fee_operator: "",
      product_id: "",
    },
  }),
  computed: {
    check_percent_fees() {
      if (
        Boolean(this.form.fee_manager) &&
        Boolean(this.form.fee_supervisor) &&
        Boolean(this.form.fee_operator)
      ) {
        let sum_percents =
          +this.form.fee_manager +
          +this.form.fee_supervisor +
          +this.form.fee_operator;
        if (sum_percents == 100) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },
  watch: {
    manager: {
      deep: true,
      handler() {
        if (this.manager.length > 0) this.loadProduct();
      },
    },
  },
  beforeMount() {
    this.role_id = [this.$store.state.auth.role.admin_call_center_id];
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      if (this.manager.length > 0) {
        form.manager_id = this.manager[0].id;
      }
      let url = "fee/insert";
      if (Boolean(this.modelId)) {
        url = "/fee/update";
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          this.$router.push("/new-call-center/setting-fee");
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadProduct() {
      this.loading = true;
      let filters = {
        geter_id: {
          op: "=",
          value: this.manager[0].id,
        },
      };
      this.$reqApi("/product-allocation", {
        row_number: 30000,
        filters: filters,
        section_name:'Product'
      })
        .then((res) => {
          res.model.data.map((x) => {
            this.items_product.push({
              text: x.product.name,
              value: x.product.id,
            });
            this.loading = false;
          });
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          const data = response.model;
          console.log("data ==> ", data);
          for (let i in data) {
            this.form[i] = data[i];
          }
          this.manager.push(data.user);
          this.loading = false;
        })
        .catch((error) => {
          this.$router.push("/new-call-center/setting-fee");
          this.loading = false;
        });
    },
  },
};
</script>

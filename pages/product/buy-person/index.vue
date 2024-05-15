<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-stepper v-model="e1">
        <v-row class="d-flex justify-center">
          <v-col cols="8">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1"> انتخاب کاربر </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2"> انتخاب محصول </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> نمایش سبد خرید </v-stepper-step>
              <v-divider></v-divider>

              <v-stepper-step step="4">پرداخت</v-stepper-step>
            </v-stepper-header>
          </v-col>
        </v-row>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="d-flex justify-center mb-8">
              <v-col md="3" cols="8" class="text-center">
                <v-tabs v-model="tab" centered icons-and-text>
                  <v-tab>
                    <h1>
                      انتخاب کاربر
                      <v-icon> person </v-icon>
                    </h1>
                  </v-tab>
                  <v-spacer> </v-spacer>
                  <v-tab>
                    <h1>
                      ایجاد کاربر
                      <v-icon> person_add </v-icon>
                    </h1>
                  </v-tab>
                </v-tabs></v-col
              >
            </v-row>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-row class="d-flex justify-center">
                  <v-col cols="12" md="6">
                    <UserSelectForm
                      text="انتخاب کاربر"
                      v-model="user"
                      url="/user"
                      rules="require"
                      :role-id="[]"
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-form v-model="valid_add_user">
                  <v-row class="d-flex justify-center">
                    <v-col cols="12" md="3">
                      <amp-input text="نام" v-model="first_name" rules="require" />
                    </v-col>
                    <v-col cols="12" md="3">
                      <amp-input
                        text="نام خانوادگی"
                        rules="require"
                        v-model="last_name"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <amp-input
                        class="ltr-item"
                        text=" شماره همراه "
                        rules="phone,require"
                        v-model="username"
                      />
                    </v-col>
                    <v-col cols="12" md="1" class="mt-8">
                      <amp-button
                        icon="add_circle"
                        height="40"
                        @click="addUser(tab, true)"
                        color="primary "
                        text="تایید "
                        :loading="loading"
                        :disabled="
                          tab == 0 ? !user[0] || loading : loading || !valid_add_user
                        "
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-tab-item>
            </v-tabs-items>

            <v-col cols="12" class="text-center mt-10">
              <amp-button
                icon="arrow_circle_left"
                height="40"
                @click="addUser(tab, false)"
                color="info darken-3"
                text="بعدی"
                :loading="loading"
                :disabled="tab == 0 ? !user[0] || loading : loading || !valid_add_user"
              />
            </v-col>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-form v-model="valid_add_user">
              <v-row class="d-flex justify-center mt-10">
                <v-col cols="12" md="7">
                  <v-autocomplete
                    prepend-inner-icon="shopping_basket"
                    v-model="product_varcomb_id"
                    :items="products"
                    outlined
                    dense
                    label="جستو جوی سریع محصول"
                    placeholder="نام محصول مورد نظر را وارد کنید ..."
                  />
                </v-col>
              </v-row>
            </v-form>
            <v-row class="text-center my-10 d-flex justify-center">
              <amp-button
                class="ma-2"
                icon="arrow_circle_right"
                height="40"
                @click="e1 = 1"
                color="red darken-2"
                text="برگشت"
                :loading="loading"
                :disabled="tab == 0 ? !user[0] || loading : loading || !valid_add_user"
              />
              <amp-button
                class="ma-2"
                icon="arrow_circle_left"
                height="40"
                @click="e1 = 2"
                color="info darken-3"
                text="بعدی"
                :loading="loading"
                :disabled="tab == 0 ? !user[0] || loading : loading || !valid_add_user"
              />
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

            <v-btn color="primary" @click="e1 = 4"> Continue </v-btn>

            <v-btn text> Cancel </v-btn>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

            <v-btn color="primary" @click="e1 = 1"> Continue </v-btn>

            <v-btn text> Cancel </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: { BaseTable, UserSelectForm },
  data: () => ({
    e1: 1,
    valid_add_user: true,
    loading: false,
    tab: null,
    user: [],
    products: [],
    first_name: "",
    last_name: "",
    username: "",
    user_id: "",
    product_varcomb_id: "",
    title: "ثبت خرید",
    basket_form: {
      user_id: "",
    },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.loadProduct();
  },

  watch: {
    tab() {
      (this.user = []),
        (this.first_name = ""),
        (this.last_name = ""),
        (this.username = "");
    },
    product_varcomb_id() {
      if (Boolean(this.product_varcomb_id)) {
        this.loadInfoProduct();
      }
    },
  },
  methods: {
    loadProduct() {
      this.loading = true;
      this.$reqApi("/product/list-by-personnel")
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    loadInfoProduct() {
      this.loading = true;
      this.$reqApi("/product/list-by-personnel")
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    addUser(tab, add) {
      this.loading = true;
      console.log(add);
      if (tab == 1 && Boolean(add)) {
        let form = {};
        form["first_name"] = this.first_name;
        form["last_name"] = this.last_name;
        form["phone"] = this.username;
        this.$reqApi("user/insert-customer", form)
          .then((response) => {
            this.user_id = response.id;
            this.$toast.success("کاربر با موفقیت ایجاد شد ");
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
          });
      } else if (tab == 0) {
        this.user_id = this.user[0].id;
      }
      if (!Boolean(add)) {
        this.e1 = 2;
      }
    
      this.loading = false;
      this.basket_form.user_id = this.user_id;
    },
  },
};
</script>

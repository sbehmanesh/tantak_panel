<template>
  <v-dialog persistent v-model="dialog_add.show" :model-id="dialog_add.items" width="600">
    <v-card style="overflow: hidden">
      <v-card-title>
        <span class="font_17"> ایجاد آدرس جدید </span>
        <v-spacer> </v-spacer>

        <v-btn text @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-form class="pa-4" v-model="valid_address">
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="12">
            <amp-autocomplete
              rules="require"
              text="استان"
              v-model="address_form.province_id"
              :items="province"
            />
            <amp-autocomplete
              rules="require"
              text="شهر"
              v-model="address_form.country_division_id"
              :items="citis"
              :loading="loading"
              :disabled="!Boolean(address_form.province_id)"
            />
            <amp-input
              text="کد پستی"
              is-number
              v-model="address_form.postal_code"
              rules="postCode,require"
            ></amp-input>
            <amp-textarea
              rules="require"
              text="آدرس"
              :rows="3"
              v-model="address_form.address"
            />
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-col cols="6">
            <amp-button
              block
              height="40"
              :disabled="!valid_address"
              @click="addAddress()"
              color="orange darken-3 "
              class="ma-1"
              text="تایید"
              :loading="loading"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog_add: {
      require: false,
      default: false,
    },
    user_id: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid_address: true,
    loading: false,
    address_form: {
      province_id: "",
      country_division_id: "",
      address: "",
      postal_code: "",
    },
    province: [],
    citis: [],
  }),
  beforeMount() {
    this.loadState().then((res) => {
      res.filter((x) => {
        this.province.push({
          text: x.name,
          value: x.id,
        });
      });
    });
  },
  watch: {
    "address_form.province_id"() {
      this.loadCitis(this.address_form.province_id);
    },
  },
  methods: {
    addAddress() {
      this.loading = true;
      let url = "/address/insert";
      let form = {};
      form["user_id"] = this.user_id;
      form["postal_code"] = this.address_form.postal_code;
      form["province_id"] = this.address_form.province_id;
      form["country_division_id"] = this.address_form.country_division_id;
      form["address"] = this.address_form.address;

      this.$reqApi(url, form)
        .then((res) => {
    

          this.closeDialog();

          this.$emit("set_address", true);
          this.$toast.success("آدرس با مو فقیت ثبت شد");

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province",
          },
        };
        this.$reqApi("/shop/country-division", {
          filters: filters,
          row_number: 3000000,
        })
          .then((res) => {
            response(res.model.data);
          })
          .catch((err) => {
            return err;
          });
      });
    },
    filterProvince(id) {
      return new Promise((res, rej) => {
        let filter = {
          id: id,
        };
        this.$reqApi("/shop/country-division", { filters: filter })
          .then((res) => {
            if (res.model.data) {
              this.province_id = res.model.data[0].cd2_id;
              setTimeout(() => {
                this.form.country_division_id = res.model.data[0].id;
              }, 500);
            }
          })
          .catch((err) => {
            return err;
          });
      });
    },
    loadCitis(id) {
      this.citis = [];
      let filters = {
        parent_id: {
          op: "=",
          value: id,
        },
      };
      if (id) {
        let data = [];
        this.$reqApi("/shop/country-division", {
          filters: filters,
          row_number: 300000,
        })
          .then((res) => {
            data = res.model.data;
            data.filter((x) => {
              this.citis.push({
                text: x.name,
                value: x.id,
              });
            });
          })
          .catch((err) => {
            return err;
          });
      }
    },

    closeDialog() {
      this.dialog_add.show = false;
      this.dialog_add.items = null;
    },
  },
};
</script>

<style></style>

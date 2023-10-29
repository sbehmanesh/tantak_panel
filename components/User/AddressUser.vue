<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card class="pa-3 ma-5">
        <v-form
          v-model="valid"
          @submit.prevent="submit()"
          :disabled="loader"
          class="rounded-0 pa-2 d-flex flex-column"
        >
          <v-row class="ma-2">
            <v-col cols="12" md="3">
              <amp-input
                text="کد پستی"
                is-number
                v-model="form.postal_code"
                rules="postCode"
              ></amp-input>
            </v-col>
            <v-col cols="12" md="3">
              <amp-autocomplete
                text="استان"
                v-model="form.province_id"
                :items="province"
              />
            </v-col>

            <v-col cols="12" md="3">
              <amp-autocomplete
                text="شهر"
                v-model="form.country_division_id"
                :items="citis"
                :disabled="citis.length > 0 ? false : true"
              />
            </v-col>
            <v-col cols="12" md="12">
              <amp-textarea text="آدرس" v-model="form.address" />
            </v-col>
          </v-row>
          <v-row class="ma-1 d-flex justify-center">
            <amp-button
              text="پاکسازی"
              icon="redo"
              @click="emptyForm"
              color="error"
              class="ma-1"
            ></amp-button>
            <amp-button
              :text="form.id.length > 0 ? 'ویرایش' : 'افزودن'"
              type="submit"
              icon="done"
              class="ma-1"
              :loading="loader"
            ></amp-button>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
    <v-col cols="12" md="12">
      <BaseTable
        url="/address"
        :headers="headers"
        :filters="filters"
        autoDelete="/address/delete"
        :row-click="rowClick"
        :BTNactions="btn_ations"
        ref="addressBaseTable"
      >
      </BaseTable>
    </v-col>
  </v-row>
</template>
<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  props: {
    modelId: { default: null }
  },
  data() {
    return {
      filters: {},
      headers: [],
      btn_ations: [],
      valid: true,
      loader: false,
      province: [],
      citis: [],
      edit_id: "",
      form: {
        user_id: "",
        postal_code: "",
        province_id: "",
        address: "",
        id: "",
        country_division_id: ","
      }
    };
  },
  beforeMount() {
    (this.filters = {
      user_id: {
        op: "=",
        value: this.modelId
      }
    }),
      (this.btn_ations = [
        {
          color: "success",
          icon: "edit",
          fun: body => {
            if (body.id) {
              this.edit_id = body.id;
            }
          }
        }
      ]);
    this.headers = [
      {
        text: "آدرس",
        value: "address"
      },
      {
        text: "کد پستی",
        value: "postal_code"
      }
    ];
  },
  watch: {
    "form.province_id"() {
      this.loadCitis(this.form.province_id);
    },
    edit_id() {
      if (this.edit_id) {
        this.loadData(this.edit_id);
      }
    }
  },
  mounted() {
    this.loadState().then(res => {
      res.filter(x => {
        this.province.push({
          text: x.name,
          value: x.id
        });
      });
    });
  },
  methods: {
    rowClick() {},
    submit() {
      this.loader = true;
      let url = "/address/insert";
      let form = this.form;
      if (this.edit_id) {
        form["id"] = this.edit_id;
        url = "/address/update";
      }
      form["user_id"] = this.$route.params.id;
      this.$reqApi(url, form)
        .then(res => {
          this.emptyForm();
          this.$refs.addressBaseTable.getDataFromApi();
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
          return err;
        });
    },
    loadData(id) {
      if (id) {
        this.loader = true;
        this.$reqApi("/address/show", { id: id })
          .then(res => {
            this.form.postal_code = res.model.postal_code;
            this.form.address = res.model.address;
            this.form.id = res.model.id;
            this.form.user_id = res.model.user_id;
            this.filterProvince(res.model.country_division_id);
            this.loader = false;
          })
          .catch(err => {
            this.loader = false;
            return err;
          });
      }
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province"
          }
        };
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 3000000
        })
          .then(res => {
            response(res.model.data);
          })
          .catch(err => {
            return err;
          });
      });
    },
    filterProvince(id) {
      return new Promise((res, rej) => {
        let filter = {
          id: id
        };
        this.$reqApi("/country-division", { filters: filter })
          .then(res => {
            if (res.model.data) {
              this.form.province_id = res.model.data[0].cd2_id;
              setTimeout(() => {
                this.form.country_division_id = res.model.data[0].id;
              }, 500);
            }
          })
          .catch(err => {
            return err;
          });
      });
    },
    loadCitis(id) {
      this.citis = [];
      let filters = {
        parent_id: {
          op: "=",
          value: id
        }
      };
      if (id) {
        let data = [];
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 300000
        })
          .then(res => {
            data = res.model.data;
            data.filter(x => {
              this.citis.push({
                text: x.name,
                value: x.id
              });
            });
          })
          .catch(err => {
            return err;
          });
      }
    },
    emptyForm() {
      this.form.country_division_id = "";
      this.form.province_id = "";
      this.form.id = "";
      this.form.postal_code = "";
      this.form.address = "";
      this.edit_id = "";
    }
  }
};
</script>

<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row class="justify-center mb-5 align-top">
        <v-col cols="12" md="12">
          <v-card class="elevation-0 pa-5">
            <v-row dense>
              <v-col cols="12" md="3">
                <amp-input text="عنوان" v-model="form.title" rules="require" />
              </v-col>    
               <v-col cols="12" md="3">
                <amp-input text="لینک کامل" v-model="form.link" rules="require" />
              </v-col>   <v-col cols="12" md="3">
                    <amp-upload-file v-model="form.url_img" />

              </v-col>
              <v-col cols="12" md="3">
                <amp-select
                  text=" وضعیت"
                  rules="require"
                  v-model="form.status"
                  :items="$store.state.static.status"
                />
              </v-col>
         

              <v-col cols="12" md="3">
                <amp-jdate
                  text="تاریخ شروع "
                  :is-number="true"
                  rules="require"
                  v-model="form.starts_at"
                  :min="now"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-jdate
                  text="تاریخ پایان"
                  rules="require"
                  :is-number="true"
                  v-model="form.ends_at"
                />
              </v-col>

        
              
       
          
          
            </v-row>
          </v-card>
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
            @click="redirectPage()"
          />

          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
            :disabled="!valid || loading"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
let jmoment = require("moment");

export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    load_product: false,
    createUrl: "/story/insert",
    updateUrl: "/story/update",
    showUrl: "/story/show",
    informations_product: {},
    agencyes: [],
    all_info_products: [],
    products: [],

    now: "",
    discount_in: [],
    form: {
title :"",
url_img :"",
link :"",
starts_at :"",
ends_at:"",
status:"active",
    },
  }),

  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  watch: {
    "form.product_id"() {
      if (Boolean(this.form.product_id)) {
        this.showProduct(this.form.product_id);
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (form.off_sale_all == "yes") {
        form.off_sale_all = true;
        form.off_sale_online = false;
        form.off_sale_call_center = false;
        form.sale_agency_ids = [];
      } else {
        form.off_sale_all = false;
        if (this.discount_in.length > 0) {
          for (let i in this.discount_in) {
            form[this.discount_in[i]] = true;
          }
        }
      }
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
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
            
          let data = response.model;
          for (let key in data) {
            this.form[key] = data[key];
            console.log("resss" , data[key]);

          }
    

          this.loading = false;
        })
        .catch((error) => {
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

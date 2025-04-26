<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="5">
          <amp-input
            text="ساعت مهلت برسی پیام؟"
            v-model="form.value"
            rules="require,number"
            cClass="ltr-item"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col dans class="d-flex justify-center">
          <amp-select
          v-model="form.value_2"
          placeholder="وضعیت را انتخاب کنید"
          :items="value_2"
          @input="update_value2"
          />
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
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import AmpSelect from '../Base/AmpSelect.vue';
export default {
  components: { AmpSelect },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/setting/insert",
    updateUrl: "/setting/update",
    showUrl: "/setting/show",
    settings: [],
    selected: {},
    value_2 : [
      {text : 'روشن' , value : 'on'},
      {text : 'خاموش' , value : 'off'},
    ],
    form: {
      id: "",
      key: "hour_limit_review_message",
      value: "",
      value_2: false,
    },
  }),

  beforeMount() {},
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  computed: {
    value2_formatter() {
      return this.form.value_2 == 'on' ? 'on' : 'off';
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      form.value_2 = this.form.value_2 == 'on' ? 'on' : 'off';
      this.loading = true;
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
          response = response.model;
          this.form["id"] = response.id;
          this.form.key = response.key;
          this.form.value = response.value;
          this.form.value_2 = response.value_2;
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
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
    update_value2(data){
      this.form.value_2 = data
      console.log(this.form.value_2)
    }
  },
};
</script>

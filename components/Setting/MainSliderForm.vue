<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <!-- <v-col cols="12" md="3"> -->
        <!-- <amp-input text="عنوان اسلایدر" v-model="form.value.title" rules="require"  /> -->
        <!-- </v-col> -->

        <v-col cols="12" md="5">
          <amp-input text="لینک" v-model="form.value.link" class="ltr-item" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input text="آلت" v-model="form.value.title" />
        </v-col>
        <v-col cols="12" md="1">
          <amp-input text="ترتیب" v-model="form.value.sort" class="ltr-item" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-alert dense class="mt-10" type="info"
            >سایز پیشنهادی 1520*685 پیکسل</v-alert
          >
          <AmpUploadFile v-model="form.value.image" title="انتخاب تصویر" />
        </v-col>
        <v-col cols="12" md="6" class="center-div">
          <v-img
            class="rounded elevation-10"
            contain
            width="350"
            height="220"
            :src="$getImage(form.value.image)"
          />
        </v-col>
      </v-row>

      <v-row dense class="mt-10">
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
import AmpAutocomplete from "@/components/Base/AmpAutocomplete.vue";
import AmpInput from "@/components/Base/AmpInput";
import AmpUploadFile from "@/components/Base/AmpUploadFile.vue";
export default {
  components: { AmpAutocomplete, AmpInput, AmpUploadFile },
  props: {
    modelId: { default: null }
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/setting/insert",
    updateUrl: "/setting/update",
    showUrl: "/setting/show",
    settings: [],
    selected: {},
    form: {
      id: "",
      key: "main_slider",
      value: {
        image: "",
        title: "",
        link: "",
        sort: 1
      },
      landing_page_needed: 1
    }
  }),

  beforeMount() {
    this.settings = [...this.$store.state.static.setting_keys];
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  watch: {
    "form.key": {
      deep: true,
      handler() {
        this.changeKey();
      }
    }
  },
  methods: {
    submit() {
      let form = { ...this.form };
      if (!form.value.image) {
        this.$toast.error("تصویر مورد نظر را انتخاب کنید");
        return;
      }
      this.loading = true;

      form.value = JSON.stringify(form.value);
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then(response => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async response => {
          response = response.model;
          this.form["id"] = response.id;

          this.form.key = response.key;
          this.form.sort = response.sort;
          this.form.value = JSON.parse(response.value);
          this.form.landing_page_needed = response.landing_page_needed;
          this.loading = false;
        })
        .catch(error => {
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
    }
  }
};
</script>

<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
      
        <v-col cols="12" md="6">
          <amp-select
            text="ارسال برای"
            rules="require"
            v-model="form.section_name"
            :items="$store.state.static.send_for"
          />
        </v-col>
        <v-col cols="12" md="6" v-if="form.section_name == 'User' ">
          <UserSelectForm
            rules="require"
            v-model="users"
            :role-id="[this.$store.state.auth.role.user_id]"
          />
        </v-col>
        <v-col cols="12">
          <v-row>
          <v-col cols="12" md="6">
            <amp-textarea text="متن" rules="require" v-model="form.text"  :rows="4"/>
          </v-col>     
            <v-col cols="12" md="6">
            <amp-textarea class="ltr-item" text="تنظیمات(JSON)" v-model="form.option" :rows="4" />
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
            @click="$router.push('/notification')"
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
import UserSelectForm from "@/components/User/UserSelectForm.vue";
export default {
  components: { UserSelectForm },
  props: { modelId: { default: null } },
  data: () => ({
    valid: false,
    loading: false,
    users: [],
    form: {
      text: "",
      option: "",
      section_id: "",
      type: "notification",
      section_name: "",
    },
  }),
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = "/notification/insert";
      if (this.modelId) {
        url = "/notification/update";
        form["id"] = this.modelId;
      }
      form.section_id = this.users.map((x) => x.id).join("");
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.$router.push("/notification");
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/notification/show", { id: this.modelId })
        .then(async (response) => {
          this.form["id"] = response.model.id;
          this.form.type = response.model.type;
          this.form.text = response.model.text;
          this.form.option = response.model.option;
          this.form.section_id = response.model.section_id;
          this.form.section_name = response.model.section_name;
          if (response.model.user) {
            this.users = [response.model.user];
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$router.push("/notification");
          this.loading = false;
        });
    },
  },
};
</script>

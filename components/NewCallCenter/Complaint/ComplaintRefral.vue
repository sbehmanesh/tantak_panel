<template>
  <div>
    <v-dialog persistent v-model="dialog" width="450">
      <v-card class="pa-3">
        <v-row class="mx-2 mt-1 align-center">
          <h1 class="font_14 mr-2">برسی روند ارجاع شکایت</h1>
          <v-spacer></v-spacer>
          <v-icon class="ml-5"> published_with_changes </v-icon>
          <v-col cols="12 " class="mt-0">
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="submit()">
            <v-row>
              <v-col cols="12" md="12">
                <amp-select
                  text="مرحله ارجاع را انتخاب کنید"
                  v-model="form.step"
                  :items="step_items"
                  rules="require"
                />
                <UserSelectForm
                  v-if="form.step == 'referral_from_complaint_follow_up'"
                  text="انتخاب کاربر"
                  v-model="user"
                  :url="url"
                  :role-id="[roleId]"
                  rules="require"
                />
                <amp-textarea
                  text="توضیحات"
                  v-model="form.message"
                  rules="require"
                />
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="4">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  type="submit"
                  class="ma-1"
                  :loading="loading"
                  :disabled="loading || !valid"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-button
                  text="انصراف"
                  height="38"
                  block
                  color="red darken-2"
                  @click="closeDialog"
                  class="ma-1"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: { UserSelectForm },
  props: {
    dialog: {
      require: false,
      default: false,
    },
    userId: {
      require: false,
      default: false,
    },
    complaintId: {
      require: false,
      default: false,
    },
    roleId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    role_id: "",
    url: "user/searchByRole",
    step_items: [],
    user: [],
    loading: false,
    form: {
      step: "",
      message: "",
      id: "",
    },
  }),

  mounted() {
    if (!Boolean(this.$checkRole(this.$store.state.auth.role.tracking_unit))) {
      this.step_items = this.$store.state.static.complaint_step.filter(
        (x) =>
          x.value != "init" && x.value != "referral_from_complaint_follow_up"
      );
    } else {
      this.step_items = this.$store.state.static.complaint_step.filter(
        (x) => x.value != "init" &&  x.value!='referred_to_complaint_follow_up'
      );
    }

  
  },

  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      if (
        form.step == "referral_from_complaint_follow_up" &&
        this.user.length > 0
      ) {
        form["user_refer_id"] = this.user[0].id;
      }
      if (Boolean(this.complaintId)) {
        form["id"] = this.complaintId;
      }
  
      this.$reqApi('complaint/referral', form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("عملیات با موفقیت انجام  شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("complaint/show", { id: this.modelId })
        .then(async (response) => {
          let items = [];
          for (let key in response.model) {
            this.form[key] = response.model[key];
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadCategory() {
      let filter_role = [];
      this.$store.state.auth.user.roles.map((x) => {
        filter_role.push(x.id);
      });
      let filters = {
        op: "in",
        value: filter_role,
      };
      this.$reqApi("complaint-category", { filters: filters })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            items.push({
              text: x.category,
              value: x.id,
              items: x.subcategory,
            });
          }

          this.category = items;
        })
        .catch((err) => {});
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

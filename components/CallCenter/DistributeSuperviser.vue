<template>
  <div>
    <v-expansion-panels variant="popout" class="my-4 elevation-5">
      <v-expansion-panel>
        <v-expansion-panel-header :expand-icon="icon" class="primary lighten-4">
          {{ title }}
        </v-expansion-panel-header>
        <v-expansion-panel-content class="primary lighten-5">
          <v-row>
            <v-col cols="12" md="12">
              <v-form
                v-model="valid"
                @submit.prevent="submit()"
                :disabled="loading"
                class="rounded-0 pa-2 d-flex flex-column"
              >
                <v-row class="ma-2">
                  <v-col cols="12" md="6">
                    <UserSelectForm
                      text="انتخاب کاربر"
                      v-model="user"
                      :url="userListUrl"
                      rules="require"
                      :role-id="[]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <amp-input
                      cClass="ltr-item"
                      text="تعداد پیام"
                      v-model="form.message_count"
                      rules="require,number"
                    />
                  </v-col>
                </v-row>
                <v-row class="ma-1 d-flex justify-center">
                  <amp-button
                    text="پاک سازی"
                    icon="delete"
                    @click="empty"
                    color="error"
                    class="ma-1"
                  ></amp-button>
                  <amp-button
                    text="تایید"
                    type="submit"
                    icon="done"
                    class="ma-1"
                    :disabled="!valid || loading"
                    :loading="loading"
                  ></amp-button>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: {
    UserSelectForm,
  },
  props: {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    url: {
      type: String,
      require: true,
    },
    userListUrl: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      user: "",
      form: {
        superviser_id: "",
        message_count: "",
      },
    };
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.user) {
        this.form.superviser_id = this.user[0].id;
      }
      this.$reqApi(this.url, this.form)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.clearVModel();
          console.log("submit");
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    empty() {
      this.loading = true;
      setTimeout(() => {
        this.form.superviser_id = "";
        this.form.message_count = "";
        this.loading = false;
      }, 500);
    },

  },
};
</script>

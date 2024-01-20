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
                  <v-col cols="12" md="4">
                    <amp-input text="نام" v-model="form.first_name" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <amp-input text="نام خانوادگی" v-model="form.last_name" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <amp-input
                      text="شماره تماس"
                      class="ltr-item"
                      v-model="form.username"
                      rules="require,phone"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <amp-input
                      text="رمز عبور"
                      class="ltr-item"
                      v-model="form.password"
                      rules="require,password"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <amp-select
                      text="نوع شخص"
                      rules="require"
                      v-model="form.person_type"
                      :items="$store.state.static.person_type"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <amp-select
                      text="وضعیت"
                      rules="require"
                      v-model="form.status"
                      :items="$store.state.static.status"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <amp-jdate
                      text="تاریخ تولد"
                      :is-number="true"
                      v-model="form.birth_date"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <amp-input
                      text="کد ملی"
                      rules="nationalCode"
                      :is-number="true"
                      v-model="form.national_code"
                    />
                  </v-col>
                  <v-col cols="12" md="12">
                    <amp-textarea
                      text="توضیحات"
                      v-model="form.description"
                    ></amp-textarea>
                  </v-col>
                </v-row>
                <v-row class="ma-1 d-flex justify-center">
                  <amp-button
                    text="پاک سازی"
                    icon="redo"
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
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        person_type: "real",
        status: "active",
        birth_date: "",
        description: "",
        national_code: "",
      },
    };
  },
  methods: {
    submit() {
      this.loading = true;
      this.$reqApi(this.url, this.form)
        .then((res) => {
          this.$toast.success("کار بر با موفقیت ثبت شد");
          this.loading = false;
          this.$emit("realodList");
          this.empty();
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    empty() {
      this.loading = true;
      setTimeout(() => {
        this.form.username = "";
        this.form.password = "";
        this.form.first_name = "";
        this.form.last_name = "";
        this.form.person_type = "real";
        this.form.status = "active";
        this.loading = false;
      }, 500);
    },
  },
};
</script>

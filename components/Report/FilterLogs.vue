<template>
  <v-col cols="12">
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-row class="ma-1 d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-card
            :disabled="loading"
            class="pa-5 pt-2 text-center rounded-lg elevation-1"
            outlined
          >
            <v-col cols="12">
              <v-banner>
                <h3>ارسال مجدد لاگ های ناموفق</h3>
              </v-banner>
            </v-col>
            <v-row class="my-3">
              <amp-select
                :items="section_items"
                v-model="form.section_name"
                :disabled="section_items.length == 1"
                class="col-12 pa-0"
              />
              <amp-jdate
                text="تاریخ شروع "
                :is-number="true"
                v-model="form.from_date"
                class="col-6 pa-0"
                rules="require"
              />
              <amp-jdate
                rules="require"
                text="تاریخ پایان"
                :is-number="true"
                v-model="form.to_date"
                class="col-6 pa-0"
              />
            </v-row>
            <v-col cols="12" class="pa-1"     v-if="!Boolean(failed_count)">
              <amp-button
                block
                class="mt-5"
                type="submit"
                text="تایید"
                color="success"
                :disabled="!valid || loading"
                :loading="loading"
              ></amp-button>
            </v-col>
            <v-col cols="12">
              <v-alert
                dark
                class="rounded-lg"
                v-if="Boolean(failed_count)"
                prominent
                icon="circle_notifications"
                color="orange darken-1"
              >
                <v-row class="pa-3 d-flex align-center">
                  <h3 class="font_12">
                    {{ failed_count }}
                    مورد ناموفق یافت شد
                  </h3>
                  <v-spacer></v-spacer>
                  <v-btn v-if="failed_count != '0'" @click="submit(false)" small outlined color="white">
                    <small> ارسال مجدد </small>
                  </v-btn>
                </v-row>
              </v-alert>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <!-- <DetailsLog
      v-if="open_dialog"
      :dialog="open_dialog"
      @closeDialog="open_dialog = false"
      :logs="logs"
    /> -->
  </v-col>
</template>
<script>
// import DetailsLog from "@/components/Report/DetailsLog.vue";
export default {
  //   components: { DetailsLog },
  data: () => ({
    loading: false,
    valid: false,
    open_dialog: false,
    failed_count: null,
    section_items: [{ text: "FINNOTECH - فینوتک", value: "FINNOTECH" }],
    form: {
      section_name: "FINNOTECH",
      from_date: "",
      to_date: "",
      just_check: true,
    },
  }),
  methods: {
    submit(check = true) {
      this.loading = true;
      let form = { ...this.form };
      form.just_check = check;
      this.$reqApi("api-call-log/resend-message", form)
        .then((res) => {
          if (Boolean(form.just_check)) {
            this.failed_count = res.all_failed;
          } else {
            this.$toast.success("ارسال مجدد لاگ ها موفقیت آمیز بود ");
               this.failed_count = null;
            this.form.from_date = "";
            this.form.to_date = "";
            this.form.just_check = true;
            this.$emit("reload");
         
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

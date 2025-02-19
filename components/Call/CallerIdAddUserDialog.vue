<template>
  <v-dialog v-model="value" persistent width="450" class="">
    <v-card class="pa-2">
      <v-card-title>
        <span style="font-size: 19px"> ذخیره اطلاعات مشتری </span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog" color="error"> close </v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
          <v-container fluid >
            <v-row dens>
              <v-col cols="12" md="12">
                <amp-input
                  
                  text="نام"
                  rules="require"
                  v-model="form.first_name"
                />
                <amp-input
                  
                  text="نام خانوادگی"
                  rules="require"
                  v-model="form.last_name"
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
                  icon="done"
                  class="my-1"
                  type="submit"
                  text="تایید"
                  color="success"
                  :loading="loading"
                  :disabled="!valid || loading"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
  },
  data: () => ({
    loading: false,
    valid: false,
    form: {
      first_name: "",
      last_name: "",
      user_id: "",
    },
  }),
  watch: {
    "$store.state.ws.call_info": {
      handler(val) {
        this.closeDialog();
      },
      deep: true,
    },
  },

  methods: {
    submit() {
      this.loading = true;
      let form = this.$copyForm(this.form);
      form.user_id = this.user_id;
      this.$reqApi("/user/profile", form)
        .then((response) => {
        

          if (response) {
            let res = response;
  
            this.$emit("updateName", res.user);
            this.loading = false;
            this.$toast.success("پروفایل مشتری به روز شد");
            this.closeDialog();
          } else {
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

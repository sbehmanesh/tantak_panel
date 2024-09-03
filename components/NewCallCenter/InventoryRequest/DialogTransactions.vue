<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="550">
      <v-card style="overflow: hidden">
        <v-col cols="12">
          <v-alert prominent icon="receipt_long">
            <v-row class="pa-2 alifn-center">
              <strong class="font_20">لیست تراکنش    </strong>
              <v-spacer></v-spacer>
              <v-btn @click="closeDialog" text icon>
                <v-icon size="26"> close </v-icon>
              </v-btn>
            </v-row>
          </v-alert>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" v-for="(item, index) in data" :key="index">
          <v-alert outlined dense color="grey darken-2" text border="left" class="ma-0">
            <strong> {{ index + 1 }} - {{ item.text }}</strong>
            <h1 class="my-1">مبلغ تراکنش: {{ $price(item.price) }}</h1>
            <h1>
              شماره تراکنش :
              {{ item.transaction_number }}
            </h1>
            <h1 class="red--text my-1">
              وضعیت :
              {{
                $getItemEnum(
                  $store.state.static.status_transactions,
                  item.status
                )
              }}
            </h1>
          </v-alert>
        </v-col>

        <v-card-actions> </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: {
    UserSelectForm,
  },
  props: {
    dialog: {
      require: false,
      default: false,
    },

    data: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: true,
    };
  },

  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.id = this.basketId;

      this.$reqApi("product-request/referral", form)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.$emit("reload");
          this.closeDialog();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 16px;
}
</style>

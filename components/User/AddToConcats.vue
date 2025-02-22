<template>
  <div>
    <v-dialog width="450" v-model="dialog">
      <v-card style="overflow: hidden" class="pa-5">
        <div class="mb-5 ">
          <h1 class="font_18">ثبت مخاطب</h1>
        </div>
        <v-form v-model="valid" @submit.prevent="submit()">
          <v-row>
            <v-col cols="12" md="12">
              <UserSelectForm
                text="برای کدام کاربر قصد ثبت مخاطب دارید ؟‌"
                v-model="user"
                url="user"
                rules="require"
                :role-id="[]"
              />

              <UserSelectForm
                text="مخاطبین  مد نظر را انتخاب کنید"
                v-model="concats"
                multi
                url="user"
                rules="require"
                :role-id="[]"
              />
            </v-col>
          </v-row>

          <v-row class="d-flex justify-center">
            <v-col cols="12" md="3">
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
            <v-col cols="12" md="3">
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
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  props: {
    dialog: {
      default: false,
      require: false,
    },
  },
  data: () => ({ valid: true, loading: false, user: [], concats: [] }),
  methods: {
    submit() {
      this.loading = true;
      let user_ids = [];
      for (let i = 0; i < this.concats.length; i++) {
        const x = this.concats[i];
        user_ids.push(x.id);
      }
      let form = {
        user_id: this.user[0].id,
        user_ids: user_ids,
      };
      this.$reqApi("user/insert-contact", form)
        .then((res) => {
          let name =
            this.user[0]?.first_name && this.user[0]?.last_name
              ? `${this.user[0].first_name} ${this.user[0].last_name}`
              : this.user[0].username;

          this.$toast.success(`
          مخاطبین با موفقیت برای 
          ${name}
          ثبت شدند
              `);
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

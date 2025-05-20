<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="380">
      <v-card class="elevation-0 pa-4" style="overflow: hidden !important">
        <v-row class="mx-2 mt-1 align-center mb-4">
          <h1 class="font_15 mr-2">ارسال لینک نظر سنجی</h1>
          <v-spacer></v-spacer>

          <v-col cols="12">
            <v-divider v-for="i in 3" :key="i"></v-divider>
          </v-col>
          <v-col cols="12" class="my-3">
            <UserSelectForm
              text="انتخاب کاربر"
              v-model="user"
              multi
              url="user"
              rules="require"
            />
          </v-col>
          <v-row class="d-flex justify-center">
            <v-col cols="6" md="3">
              <amp-button
                text="تایید"
                height="38"
                block
                color="teal darken-2"
                @click="submit"
                class="ma-1"
                :loading="loading"
                :disabled="loading || user.length == 0"
              />
            </v-col>
            <v-col cols="6" md="3">
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
        </v-row>
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
      default: false,
      type: Boolean,
    },
    modelId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      user: [],
      items: [],
    };
  },

  methods: {
    submit() {
      this.loading = true;
      let form = {
        category_id: this.modelId,
        user_ids: this.user.map((x) => x.id),
      };
      this.$reqApi("comment-category/send-link", form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("لینک فرم نظر سنجی با موفقیت برای کاربران ارسال شد");
          this.$emit("closeDialog");
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

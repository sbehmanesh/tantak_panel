<template>
  <v-dialog v-model="UserDialog" persistent class="white pa-4" max-width="430">
    <v-card class="white pa-2">
      <v-card-title v-if="title">
        <span style="font-size: 15px">
          <amp-help :text="description" />
          {{ title }}
        </span>

        <v-spacer></v-spacer>
        <v-btn x-small icon @click="close">
          <v-icon size="20"> close </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-4">
        <span> </span>
        <amp-select
          text="انتخاب کاربر"
          :items="user_items"
          v-model="user"
        ></amp-select>
        <v-row class="d-flex justify-center">
          <v-btn class="success my-3" width="100 " @click="submit"
            >تایید
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    UserDialog: {
      type: Boolean,
      default: false,
    },
    listUrl: {
      type: String,
    },
    url_auto: {
      type: String,
    },
    title: {
      type: String,
    },
    helper_text: {
      type: String,
    },
  },
  data() {
    return {
      user_items: [],
      user: "",
      description:
        "   پیام ها به اوپراتوری تخصیص داده میشوند که سرپرست مرکز تماس آنها انتخاب شده باشد",
    };
  },
  mounted() {
    if (this.listUrl) {
      this.loadItems();
    }
  },
  methods: {
    loadItems() {
      this.$reqApi(this.listUrl)
        .then((res) => {
          res.model.data.map((x) => {
            this.user_items.push({
              text: x.first_name + " " + x.last_name,
              value: x.id,
            });
          });
          this.user_items;
        })
        .catch((err) => {
          return err;
        });
    },
    submit() {
      if (this.user) {
        this.$emit("selectUser", [this.user, this.url_auto]);
        this.refresh();
        this.clearVModel();

        this.close();
        this.$toast.success("با موفقیت تایید شد");
      } else {
        this.$toast.error("کاربری انتخاب نشده است");
      }
    },
    refresh() {
      console.log("matin");
      this.$emit("reload");
    },
    close() {
      this.$emit("close");
    },
    clearVModel() {
      console.log("methods");
      this.$emit("clearVModel");
    },
  },
};
</script>

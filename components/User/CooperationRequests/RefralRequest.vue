<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card style="overflow: hidden">
        <v-col cols="12" class="pa-0 ma-0">
          <v-alert dense prominent icon="event_repeat" class="grey lighten-2">
            <h1 class="font_17">‌برسی روند ارجاع</h1>
          </v-alert>
        </v-col>
        <v-form v-model="valid" class="pa-3">
          <v-col cols="12" class="pa-0 ma-0">
            <amp-select
              text="تعیین مرحله"
              rules="require"
              :items="set_step_items"
              v-model="form.step"
            />
            <UserSelectForm
              v-if="show_select_user"
              :text="select_user_title"
              v-model="user"
              url="user/list-employee"
              rules="require"
            />
            <amp-autocomplete
              v-if="form.step == 'human_resources_supervisor_to_expert'"
              text="واحد مرتبط"
              rules="require"
              v-model="relevant_role_id"
              :items="$store.state.setting.roles"
            />
            <amp-textarea
              text=" توضیحات"
              rules="require"
              v-model="form.message"
              :rows="2"
            />
          </v-col>
        </v-form>
        <v-card-actions>
          <v-row class="d-flex justify-center pa-1 mb-4">
            <amp-button
              text="انصراف"
              @click="closeDialog"
              color="red"
              height="38"
              class="ma-2"
            />
            <amp-button
              text="تایید"
              height="38"
              @click="submit"
              color="success darken-1"
              class="ma-2"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-row>
        </v-card-actions>
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

    modelId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      user: [],
      role: "",
      relevant_role_id: "",
      valid: true,
      loading: false,
      show_select_user: false,
      select_user_title: "",
      form: {
        step: "",
        message: "",
        id: "",
      },
    };
  },

  watch: {
    "form.step"() {
      switch (this.form.step) {
        case "human_resources_manager_to_supervisor":
          this.select_user_title =
            "سرپرست منابع انسانی  مورد نظر را انتخاب کنید";
          this.show_select_user = true;

          break;
        case "human_resources_supervisor_to_expert":
          this.select_user_title = "کارشناس استخدام را انتخاب کنید";
          this.$store.dispatch("setting/getRoleServer");
          this.show_select_user = true;

          break;
      }
    },
  },
  computed: {
    set_step_items() {
      let items = [...this.$store.state.static.cooperation_req];
      if (
        this.$checkRole(this.$store.state.auth.role.human_resources_manager)
      ) {
        return items.filter(
          (x) =>
            x.value == "human_resources_manager_to_supervisor" ||
            x.value == "reject"
        );
      }
      // ---------------------SUPERVISOR-----------------------------------
      else if (
        this.$checkRole(this.$store.state.auth.role.human_resources_supervisor)
      ) {
        return items.filter(
          (x) =>
            x.value == "human_resources_supervisor_to_manager" ||
            x.value == "human_resources_supervisor_to_expert"
        );
      }
      // -------------------EXPERT-------------------------------------
      else if (
        this.$checkRole(this.$store.state.auth.role.human_resources_expert)
      ) {
        return items.filter(
          (x) =>
            x.value == "human_resources_expert_to_supervisor" ||
            x.value == "human_resources_expert_to_interviewer"
        );
      }
      // -------------------interviewer-------------------------------------
      else if (
        this.$checkRole(this.$store.state.auth.role.interviewer)
      ) {
        return items.filter(
          (x) =>
            x.value == "interviewer_to_human_resources_expert" ||
            x.value == "done"
        );
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.id = this.modelId;
      if (
        this.form.step == "human_resources_supervisor_to_expert" ||
        this.form.step == "human_resources_manager_to_supervisor"
      ) {
        form["user_refer_id"] = this.user[0].id;
      }
      if (this.form.step == "human_resources_supervisor_to_expert") {
        form["relevant_role_id"] = this.relevant_role_id;
      }
      this.$reqApi("employment-form/referral", form)
        .then((res) => {
          if (
            this.form.step == "sale_manager_to_supervisor" &&
            this.user.length > 0
          ) {
            let name = Boolean(
              this.user[0]?.first_name && this.user[0]?.last_name
            )
              ? this.user[0]?.first_name + " " + this.user[0]?.last_name
              : this.user[0].username;
            this.$toast.success(
              `درخواست نمایندگی با موفقیت به ${name} ارجاع داده شد`
            );
          } else {
            this.$toast.success("عملیات با موفقیت انجام شد");
          }
          this.$emit("refresh");
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

<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="600">
      <v-card :disabled="disabled" class="elevation-0 pa-3">
        <div class="card-style pa-1" elevation="2">
          <v-banner class="mb-5" v-if="step == 1">
            <v-row class="pa-3 d-flex align-center">
              <h1 class="grey--text font_16">مدیریت همکاری</h1>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog"> <v-icon>close</v-icon></v-btn>
            </v-row>
          </v-banner>
          <div
            v-if="step == 2 && Boolean(selected)"
            class="d-flex align-center"
          ></div>
          <v-col v-if="step == 2" cols="12">
            <v-alert text color="blue-grey" class="text-center">
              <v-icon size="45" color="blue-grey" class="icon-class">{{
                selected.icon
              }}</v-icon>
              <h1>
                {{ selected.text }}
              </h1>
            </v-alert>
          </v-col>
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-col cols="12" v-for="(x, i) in actions_user" :key="i">
                <v-card
                  style="border-radius: 10px !important"
                  @click="handelerClick(x)"
                  class="py-2 my-2 pr-3 elevation-5 card-style2"
                >
                  <v-row class="d-flex align-center py-4 pr-3">
                    <div
                      style="border-radius: 100%"
                      class="pa-3 d-flex align-center justify-center blue-grey lighten-2 ml-3 div-icon"
                    >
                      <v-icon size="30" color="white" class="icon-class">{{
                        x.icon
                      }}</v-icon>
                    </div>
                    <v-col
                      cols="9"
                      style="border-right: 0.06cm dashed #afbec585"
                    >
                      <h1 class="font_18">
                        {{ x.text }}
                      </h1>
                      <h1>
                        <small class="grey--text des-style">
                          {{ x.des }}
                        </small>
                      </h1>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-window-item>

            <v-window-item :value="2">
              <v-form v-model="valid">
                <v-col v-if="step == 2" cols="12" class="pa-0">
                  <CreateUserForm
                    @backStep="step--"
                    :role-id="this.$store.state.auth.role.admin_call_center_id"
                    v-if="Boolean(selected) && selected.value == 'insert_user'"
                  />
                </v-col>
                <v-row
                  class="justify-center"
                  v-if="Boolean(selected) && selected.value != 'insert_user'"
                >
                  <v-col cols="12" md="12" v-if="step == 2">
                    <amp-autocomplete
                      v-if="
                        this.$checkRole(
                          this.$store.state.auth.role.admin_call_center_id
                        ) && selected.value == 'transfer_message'
                      "
                      text="روند انتقال"
                      v-model="transfer"
                      :items="transfer_items"
                    />
                  </v-col>
                  <v-col cols="12" md="12" v-if="transfer =='me'">
                    <UserSelectForm
                      text="کاربر فعلی"
                      v-model="from_personnel_id"
                      :url="url_list"
                      rules="require"
                      :role-id="filter_role"
                    />
                  </v-col>
                  <!-- <v-col
                    cols="12"
                    md="6"
                    v-if="
                      transfer == 'other' || selected.value == 'termination'
                    "
                  >
                    <UserSelectForm
                      text="کاربر جدید"
                      v-model="to_personnel_id"
                      :url="url_list"
                      rules="require"
                      :role-id="filter_role"
                    />
                  </v-col> -->
                </v-row>
                <v-col cols="12" v-if="step == 2">
                  <Subordinates
                    v-if="
                      Boolean(selected) &&
                      selected.value == 'transfer_message' &&
                      Boolean(transfer) &&
                      transfer == 'other'
                    "
                  />
                </v-col>
                <v-row
                  v-if="Boolean(selected) && selected.value != 'insert_user'"
                  class="align-center pa-2 justify-center my-2"
                >
                  <amp-button
                    text="تایید"
                    height="38"
                    class="ma-2"
                    :loading="loading"
                    color="blue-grey"
                    @click="submit('message/data-transfer-manager')"
                    :disabled="!valid || loading"
                  />
                  <amp-button
                    text="انصراف"
                    height="38"
                    class="ma-2"
                    color="red"
                    @click="closeDialog"
                    :disabled="loading"
                  />
                </v-row>
              </v-form>
            </v-window-item>
          </v-window>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";
import CreateUserForm from "@/components/NewCallCenter/CreateUserForm.vue";
import Subordinates from "@/components/NewCallCenter/Subordinates.vue";

export default {
  components: {
    UserSelectForm,
    CreateUserForm,
    Subordinates,
  },
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: false,
      disabled: false,
      valid: true,
      selected: null,
      step: 1,
      url_list: "user/searchByRole",
      filter_role: [],
      transfer: "me",
      transfer_items: [
        { text: " به خودم", value: "me" },
        { text: "انتقال به شخصی دیگر", value: "other" },
      ],
      user: [],
      roles: [],
      from_personnel_id: "",
      to_personnel_id: "",
      form: {
        from_personnel_id: "",
        to_personnel_id: "",
      },
      actions_user: [
        {
          text: "ایجاد مدیر پیام دریافتی",
          value: "insert_user",
          icon: "person_add",
          des: "شما میتوانید با کلیک بر  روی این بخش یک کاربر جدید با نقش  مدیر پیام های دریافتی ایجاد کنید ",
        },
        {
          text: "قطع همکاری",
          value: "termination",
          icon: "group_remove",
          des: "در صورت نیاز به قطع همکاری  با مدیر پیام های دریافتی روی این بخش کلیک کنید و سپس مدیر مورد نظر را انتخاب کنید توجه داشته باشید افراد زیر مجموعه این شخص به همراه پیام های  در دست این افراد به مدیر جدیدی که انتخاب میکنید انتقال داده خواهد شد ",
        },
        {
          text: "انتقال پیام ها",
          value: "transfer_message",
          icon: "forward_to_inbox",
          des: "شما میتوانید در این بخش با اننخاب کاربر مورد نظر و انتخاب شخص گیرنده پیام ها را به شخص مورد نظر انتقال دهید",
        },
      ],
    };
  },

  beforeMount() {
    if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.filter_role = [this.$store.state.auth.role.admin_call_center_id];
    }
    if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.url_list = "user/list-employee";
      this.actions_user = [
        {
          text: "قطع همکاری",
          value: "termination",
          icon: "group_remove",
          des: "در صورت نیاز به قطع همکاری  با مدیر پیام های دریافتی روی این بخش کلیک کنید و سپس مدیر مورد نظر را انتخاب کنید توجه داشته باشید افراد زیر مجموعه این شخص به همراه پیام های  در دست این افراد به مدیر جدیدی که انتخاب میکنید انتقال داده خواهد شد ",
        },
        {
          text: "انتقال پیام ها",
          value: "transfer_message",
          icon: "forward_to_inbox",
          des: "شما میتوانید در این بخش با اننخاب کاربر مورد نظر و انتخاب شخص گیرنده پیام ها را به شخص مورد نظر انتقال دهید",
        },
      ];
    }
  },

  methods: {
    handelerClick(item) {
      this.step++;
      this.selected = item;
    },
    submit(url) {
      this.loading = true;
      let form = { ...this.form };
      form.from_personnel_id = this.from_personnel_id[0].id;
      form.to_personnel_id = this.to_personnel_id[0].id;
      if (Boolean(this.selected)) {
        form["stop_cooperation"] =
          this.selected.value == "transfer_message" ? false : true;
      }
      if (
        this.$checkRole(this.$store.state.auth.role.admin_call_center_id) &&
        this.transfer == "me"
      ) {
        form.to_personnel_id = this.$store.state.auth.user.id;
      }
      this.$reqApi(url, form)
        .then((res) => {
          this.closeDialog();
          this.loading = false;
          this.$toast.success(
            `عملیات ${this.selected.text} با موفقیت انجام شد`
          );
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      if (this.step == 2) {
        this.step--;
      } else {
        this.$emit("closeDialog");
      }
    },
  },
};
</script>
<style scoped>
.card-style {
  overflow: hidden !important;
}
.card-style2 {
  background-color: #ffffff !important;
  box-shadow: 3px 3px 1px 1px #0c0c0c36 !important;
  transition: all 0.2s ease !important;
}
.card-style2:hover {
  box-shadow: 9px 10px 7px 4px #0c0c0c3a !important;
  transform: scale3d(1.02, 1.02, 1.02) !important;
}
.icon-class {
  transition: all 1.1s ease !important;
}
.card-style2:hover .icon-class {
  transform: rotate(365deg) !important;
  transition: all 1.1s ease !important;
}
.card-style2:hover .des-style {
  color: #8298a3 !important;
  transition: all 0.5s ease !important;
}
</style>

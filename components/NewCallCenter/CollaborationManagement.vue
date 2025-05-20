<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="550">
      <v-card :disabled="disabled" class="elevation-0 pa-3">
        <div class="card-style pa-1" elevation="2">
          <v-banner  class="mb-5">
            <v-row class="pa-3 d-flex align-center">
              <h1 class="grey--text font_16">مدیریت همکاری</h1>
              <v-spacer></v-spacer>
              <v-btn icon> <v-icon>close</v-icon></v-btn>
            </v-row>
          </v-banner>

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
                    <v-col cols="9" style="border-right: 2px solid #607d8b">
                      <h1 class="font_15">
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
              <v-col v-if="Boolean(selected)" cols="12" class="text-center">
                <v-icon size="65">{{ selected.icon }}</v-icon>
                <h1>{{ selected.text }}</h1>
                <v-btn @click="step--" text>
                  <v-icon class="mx-1 grey--text"> arrow_circle_right</v-icon>
                  برگشت
                </v-btn>
              </v-col>
              <v-form v-model="valid">
                <v-row class="justify-center">
                  <v-col cols="12" md="12">
                    <amp-select
                      text="نقش"
                      :items="roles"
                      rules="require"
                      v-model="form.type_report"
                    />
                    <UserSelectForm
                      v-if="Boolean(check_show_list)"
                      text="انتخاب کاربر"
                      v-model="user"
                      :url="url_list"
                      :rules="Boolean(form.type_report) ? 'require' : ''"
                      :role-id="filter_role"
                    />
                    <amp-select
                      :disabled="!Boolean(form.type_report)"
                      text="مرحله را انتخاب کنید"
                      :items="step_items"
                      rules="require"
                      v-model="form.step"
                    />

                    <amp-jdate
                      text="تاریخ شروع"
                      :is-number="true"
                      rules="require"
                      v-model="form.start_at"
                    />
                    <amp-jdate
                      class="mt-3"
                      rules="require"
                      text="تاریخ پایان"
                      :is-number="true"
                      v-model="form.end_at"
                    />
                  </v-col>
                  <v-row class="align-center pa-2 justify-center my-2">
                    <amp-button
                      text="تایید"
                      height="38"
                      class="ma-2"
                      :loading="loading"
                      color="blue-grey"
                      @click="getLogsRefral"
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

export default {
  components: {
    UserSelectForm,
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
      user: [],
      roles: [],
      form: {
        type_report: "",
        end_at: "",
        start_at: "",
        user_id: "",
      },
      actions_user: [
        {
          text: "ایجاد مدیر پیام دریافتی",
          value: "",
          icon: "person_add",
          des: "شما میتوانید با کلیک بر  روی این بخش یک کاربر جدید با نقش  مدیر پیام های دریافتی ایجاد کنید ",
        },
        {
          text: "قطع همکاری",
          value: "",
          icon: "group_remove",
          des: "در صورت نیاز به قطع همکاری  با مدیر پیام های دریافتی روی این بخش کلیک کنید و سپس مدیر مورد نظر را انتخاب کنید توجه داشته باشید افراد زیر مجموعه این شخص به همراه پیام های  در دست این افراد به مدیر جدیدی که انتخاب میکنید انتقال داده خواهد شد ",
        },
        {
          text: "انتقال پیام ها",
          value: "",
          icon: "mark_email_unread",
          des: "شما میتوانید در این بخش با اننخاب کاربر مورد نظر و انتخاب شخص گیرنده پیام ها را به شخص مورد نظر انتقال دهید",
        },
      ],
      set_filters: {},
      excel_hed: [
        { text: "زمان ثبت پیام", value: "created_at" },
        { text: "شناسه پیام", value: "message_id" },
        { text: "نام صاحب پیام", value: "customer_name" },
        { text: "شماره همراه صاحب پیام", value: "customer_phone" },
        {
          text: "آخرین وضعیت پیام",
          value: "status",
        },
        {
          text: "مرحله ارجاع ",
          value: "step",
        },
        {
          text: "نوع ارجاع پیام",
          value: "type_send",
        },
        { text: "شماره همراه ارجاع دهنده", value: "sender_phone" },

        {
          text: "تعداد پیام ارجاع داده شده",
          value: "count",
        },
        { text: "گیرنده", value: "geter" },
        { text: "شماره همراه  گیرنده", value: "geter_phone" },
        { text: "توضیحات", value: "description" },
      ],
    };
  },

  beforeMount() {
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.url_list = "user/list-employee";
      this.roles = [
        {
          text: "خودم",
          value: "supervisor",
          role_id: this.$store.state.auth.role.superviser_id,
        },
        {
          text: "فروشنده",
          value: "operator",
          role_id: this.$store.state.auth.role.oprator_id,
        },
      ];
    } else {
      this.roles = [
        {
          text: "مدیر مرکز تماس",
          value: "manager",
          role_id: this.$store.state.auth.role.admin_call_center_id,
        },
        {
          text: "سرپرست",
          value: "supervisor",
          role_id: this.$store.state.auth.role.superviser_id,
        },
        {
          text: "فروشنده",
          value: "operator",
          role_id: this.$store.state.auth.role.oprator_id,
        },
      ];
    }
  },

  computed: {
    check_show_list() {
      if (
        Boolean(this.$checkRole(this.$store.state.auth.role.superviser_id)) &&
        this.form.type_report == "supervisor"
      ) {
        return false;
      } else if (!Boolean(this.form.type_report)) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    handelerClick(item) {
      console.log("item ==> ", item);
      console.log("item ==> ", item);
      console.log("item ==> ", item);
      console.log("item ==> ", item);

      this.step++;
      this.selected = item;
    },
    closeDialog() {
      this.$emit("closeDialog");
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
  box-shadow: 9px 1px 12px 0px #0c0c0c46 !important;
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

<template>
  <v-row>
    <v-col cols="12" md="12" v-if="is_super_admin">
      <v-col cols="12" md="6" v-if="$store.state.auth.role.is_admin">
        <v-card class="elevation-10 pa-5">
          لطفا سرپرست و اپراتور مد نظر را انتخاب کنید
          <v-card-text class="d-flex justify-space-around align-center pa-3">
            <v-card width="400" class="elevation-0">
              <UserSelectForm
                text="انتخاب سرپرست"
                v-model="selected_superviser_id"
                :url="superviser_list"
                rules="require"
                :role-id="[$store.state.auth.role.superviser_id]"
              />
            </v-card>
            <v-card width="400" class="elevation-0">
              <UserSelectForm
                text="انتخاب اپراتور"
                v-model="selected_operator_id"
                :url="operator_list"
                rules="require"
                :role-id="[$store.state.auth.role.oprator_id]"
              />
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-card :disabled="checkSelectedUserForSuperAdmin" class="elevation-0">
        <v-tabs v-model="tab" class="ma-3 center-div" color="white">
          <v-tab v-for="(item, index) in items_tab" :key="item" color="white">
            <v-chip
              dark
              color="primary"
              class="white--text"
              :outlined="tab != index"
            >
              {{ item }}
            </v-chip>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item class="">
            <v-card v-if="selected_superviser_id.length > 0">
              <BaseTable
                :headers="headers"
                :url="superviser_url"
                :rootBody="{ superviser_id: selected_superviser_id }"
              />
            </v-card>
          </v-tab-item>
          <v-tab-item class="">
            <v-card v-if="selected_operator_id.length > 0">
              <BaseTable
                :headers="headers"
                :rootBody="{ operator_id: selected_operator_id }"
                :url="operator_url"
              />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
    <v-col cols="12" md="12">
      <v-row class="d-flx justify-center">
        <v-col cols="12" md="5" v-if="is_admin" class="mt-2">
          <DistributeOperator
            :url="superviser_distribute"
            title="توضیح دستی پیام"
            :userListUrl="superviser_list"
            icon="send"
          />
        </v-col>
        <!-- <v-col cols="12" md="6" v-if="is_admin" class="mt-2">
          <UserCreate
            :url="insert_superviser"
            title="ایجاد سوپروایزر"
            icon="account_circle"
          />
        </v-col> -->
        <v-col cols="12" md="5" v-if="is_superviser">
          <v-row class="pa-5">
            <v-col cols="12" md="3" class="ma-2">
              <v-btn class="primary" @click="autoDistribute">
                <span>تخصیص خودکار</span>
                <v-icon class="mx-2">storage</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" class="ma-2">
              <v-btn class="success" @click="manualDistribute">
                <span>تخصیص دستی</span>
                <v-icon class="mx-2">checklist_rtl</v-icon>
              </v-btn>
              <DialogUserSelect
                :UserDialog="dialog_user_manual"
                title="انتخاب اپراتور"
                :listUrl="operator_list"
                @selectUser="setManualDistribute"
                @close="dialog_user_manual = false"
              />
            </v-col>
            <v-col cols="12" md="4" class="ma-2">
              <v-btn class="blue" dark @click="percentDistribute">
                <span> تخصیص بر اساس سابقه فروش</span>
                <v-icon class="mx-2">storefront</v-icon>
              </v-btn>
              <DialogUserSelect
                :UserDialog="dialog_serperviser"
                title="انتخاب سوپروایزر"
                :listUrl="superviser_list"
                @selectUser="setPrcentDistrubute"
                @close="dialog_serperviser = false"
              />
            </v-col>
          </v-row>
        </v-col>
        <!-- <v-col cols="12" md="6" v-if="is_superviser" class="mt-2">
          <UserCreate
            :url="insert_operator"
            title="ایجاد اپراتور"
            icon="account_circle"
          />
        </v-col> -->
      </v-row>
    </v-col>
    <v-col cols="12" md="12" v-if="url && !is_super_admin">
      <BaseTable :headers="headers" :url="url" v-model="selected_item" />
    </v-col>
  </v-row>
</template>
<script>
import DistributeOperator from "@/components/CallCenter/DistributeSuperviser.vue";
import DialogUserSelect from "~/components/CallCenter/DialogUserSelect.vue";
import UserCreate from "~/components/CallCenter/UserCreate.vue";
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: {
    DistributeOperator,
    DialogUserSelect,
    UserCreate,
    UserSelectForm,
  },
  data() {
    return {
      title: "پیام های دریافتی",
      url: "",
      tab: null,
      dialog_user_manual: false,
      dialog_serperviser: false,
      is_super_admin: false,
      is_superviser: false,
      is_admin: false,
      selected_item: [],
      is_operator: false,
      items_tab: ["پیام های دریافتی  سرپرست", "پیام های دریافتی اپراتور"],
      headers: [],
      superviser_url: "/call-center/superviser-messages",
      operator_url: "/call-center/operators-messages",
      superviser_distribute: "/call-center/distribute-superviser",
      operator_distribute: "/call-center/distribute-operator ",
      operator_distribute_manul: "/call-center/distribute-operator-manual ",
      operator_distrubute_by_sell_percent:
        "/call-center/distribute-by-sell-percent ",
      selected_operator_id: "",
      selected_superviser_id: "",
      superviser_list: "/call-center/superviser-list",
      operator_list: "/call-center/operator-list ",
      insert_operator: "/call-center/insert-operator",
      insert_superviser: "/call-center/insert-superviser",
    };
  },
  beforeMount() {
    this.headers = [
      {
        text: "تاریخ ثبت",
        filterType: "date",
        filterCol: "created_at",
        parentClass: "ltr-item text-center",
        value: (body) => {
          console.log(body);
          this.$toJalali(body.created_at)},
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.is_superviser = true;
      this.headers.unshift({
        text: "",
        width: "30px",
        type: "checkbox",
        disableSort: true,
        filterable: false,
      });
      this.url = this.superviser_url;
    } else if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      this.is_operator = true;
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.is_super_admin = true;
    } else if (
      this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {
      this.url = this.superviser_url;
      this.is_admin = true;
    }
  },
  computed: {
    checkSelectedUserForSuperAdmin() {
      if (
        this.selected_operator_id.length > 0 &&
        this.selected_superviser_id.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    manualDistribute() {
      if (this.selected_item) {
        this.$toast.error("موردی انتخاب نشده است");
        return;
      }
      this.dialog_user_manual = true;
    },
    setManualDistribute(event) {
      if (!event) {
        this.$toast.error("اپراتور فروش انتخاب نشده است");
        return;
      }
      let form = {
        operator_id: event,
        message_id: this.selected_item,
      };
      this.$refs("/call-center/distribute-operator-manual", form)
        .then((res) => {})
        .catch((err) => {
          return err;
        });
    },
    autoDistribute() {
      this.$reqApi("/call-center/distribute-operator")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    percentDistribute() {
      this.dialog_serperviser = true;
    },
    setPrcentDistrubute(event) {
      if (event) {
        console.log(event);
        let form = {
          superviser_id: event,
        };
        this.$reqApi("/call-center/distribute-by-sell-percent", form)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
    },
  },
};
</script>

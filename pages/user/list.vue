<template>
  <div>
    <CatgoryUsers
      @filterRole="filterRole($event)"
      :user-count="user_count"
      :user-list="user_list"
    />

    <BaseTable
      url="/user/searchByRole"
      :headers="headers"
      autoDelete="/user/delete"
      autoUpdate="/user"
      createUrl="/user/insert"
      :extraBtn="extraBtn"
      :root-body="role_id"
      ref="walletExcel"
    />
    <Excel
      v-if="dialog.show"
      :dialog="dialog"
      @closeDialog="closeDialog"
      @relod="relod"
    />
    <InsertUserExcel
      v-if="create_user"
      :dialog="create_user"
      @closeDialog="create_user = false"
      @reload="relod"
    />
    <AddToConcats
      v-if="add_concat"
      :dialog="add_concat"
      @closeDialog="add_concat = false"
    />
  </div>
</template>

<script>
import CatgoryUsers from "@/components/User/CatgoryUsers.vue";
import InsertUserExcel from "@/components/User/InsertUserExcel.vue";
import Excel from "@/components/User/Excel.vue";
import AddToConcats from "@/components/User/AddToConcats.vue";
export default {
  components: { CatgoryUsers, Excel, InsertUserExcel, AddToConcats },
  data: () => ({
    headers: [],
    extraBtn: [],
    role_id: "",
    show_cards: false,
    create_user: false,
    add_concat: false,
    personal_count: "",
    user_count: "",
    catgory_users: [],
    user_list: [],
    dialog: { items: null, show: false },
    title: "همه کاربران",
  }),
  beforeMount() {
    this.role_id = {
      role_id: [this.$store.state.auth.role.user_id],
    };

    this.extraBtn = [
      {
        icon: "add_card",
        color: "info",
        text: "شارژ کیف پول",
        fun: () => {
          this.dialog.items = null;
          this.dialog.show = true;
        },
      },

      {
        icon: "post_add",
        color: "teal",
        text: "ایجاد با اکسل",
        fun: () => {
          this.create_user = true;
        },
      },
      {
        icon: "contact_phone",
        color: "blue-grey",
        text: "افزودن به مخاطبین",
        fun: () => {
          this.add_concat = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    this.$store.dispatch("setting/getRoleServer");
    this.headers = [
      {
        text: "تصویر",
        value: "avatar",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
      {
        text: "منشا ورود",
        value: "login_source",
        filterType: "select",
        items: this.$store.state.static.origin_of_entry,
      },
      {
        text: "وضعبت فعالیت",
        value: "status_work",
        filterType: "select",
        items: this.$store.state.static.status_work,
      },
      { text: "کد ملی", filterCol: "national_code", value: "national_code" },
      {
        text: "کد پرسنلی",
        filterCol: "personnel_code",
        value: "personnel_code",
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ تولد",
        value: (body) => {
          if (body.birth_date) {
            return this.$toJalali(
              body.birth_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        },
      },
      {
        text: "نقش",
        filterCol: "name",
        value: (body) => {
          if (Array.isArray(body.roles)) {
            return body.roles.map((x) => x.name).join(" | ");
          }
          return "";
        },
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },

      {
        text: "کیف پول",
        filterCol: "wallet",
        value: (body) => {
          let items = [];
          items.push(
            `<span class="green--text font_10">کیف پول نقدی : ${body.cash_wallt.toLocaleString()} ریال</span>`
          );
          items.push(
            `<span class="primary--text font_10">کیف پول اعتباری  : ${body.credit_wallt.toLocaleString()} ریال</span>`
          );
          items.push(
            `<span class="blue--text font_10">کیف پول امتیازی : ${body.score_wallt.toLocaleString()} امتیاز</span>`
          );
          return items.join("<br>");
        },
      },
    ];
  },
  methods: {
    relod() {
      this.$refs.walletExcel.getDataFromApi();
    },

    closeDialog() {
      this.dialog.show = false;
      this.dialog.items = null;
    },

    filterRole(key) {
      if (key == "users") {
        this.role_id["condition"] = "in";
      } else {
        this.role_id["condition"] = "not_in";
      }
      this.relod();
    },
  },
};
</script>
<style scoped>
.icon-calss {
  border-radius: 100%;
  background: linear-gradient(
    to top,
    #e25b2581,
    rgb(255, 102, 0),
    #ca3d05
  ) !important;
}
.main-card {
  border-radius: 10px !important;
  background-color: #e2e2e234;
}
.main-card:hover {
  cursor: pointer !important;
  box-shadow: 0px 5px 0px 0px #0c0c0c46 !important;
  transition: all 0.5s ease !important;
}
</style>

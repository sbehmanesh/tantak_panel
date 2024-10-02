<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="12">
        <v-card max-width="380" class="elevation-0">
          <div>واحد مالی</div>
          <div class="my-1">به تن تاک خوش اومدی!</div>
          <div class="d-flex align-center">
            <v-icon size="18" color="green">circle</v-icon>
            <span class="mr-1">آنلاین</span>
            <v-icon size="20">edit</v-icon>
          </div>
          <v-divider color="#fd5800" class="mt-3"></v-divider>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        :class="$vuetify.breakpoint.mdAndUp ? '' : 'd-flex'"
      >
        <!-- کاردهای کناری داشبورد -->
        <SideCard v-for="(card, i) in sides" :key="i" :card="card" />
      </v-col>
      <v-col cols="12" md="6">
        <v-sheet
          :class="[
            'd-flex align-center gray py-1 px-4 border5',
            $vuetify.breakpoint.mdAndUp ? 'width-800' : '',
          ]"
        >
          <div>همکاران من:</div>
          <div class="mr-3">
            <!-- <img src="/image/default-user.jpg" width="30" class="mt-2" /> -->
            <!-- <h5>
                {{ firstname_employee }} {{ lastname_employee }} /
                {{ username_employee }}
              </h5> -->
            <v-tooltip bottom v-if="employee_flag">
              <template v-slot:activator="{ on }">
                <v-btn
                  small
                  v-on="on"
                  @click="show_employee()"
                  icon
                  color="blue"
                >
                  <v-avatar color="primary" size="30" small>
                    <span class="white--text text-h7">
                      {{ firstname_employee[0] }}
                      {{ lastname_employee[0] }}</span
                    ></v-avatar
                  >
                </v-btn>
              </template>
              <span
                >{{ username_employee }} / {{ firstname_employee }}
                {{ lastname_employee }}</span
              >
            </v-tooltip>
          </div>
        </v-sheet>
        <!-- جدول کارتابل -->
        <MainTable :getData="get_data" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import MainTable from "@/components/dashboard/MainCard";
import SideCard from "@/components/dashboard/SideCard";
export default {
  components: { MainTable, SideCard },
  data: () => ({
    title: "کارتابل",
    // set_filter: true,
    roles: [],
    get_data: [],
    username_employee: "",
    firstname_employee: "",
    lastname_employee: "",
    employee_flag: false,
    // count_works: [],
    sides: [
      {
        icon: "/image/dashboard/todolist.svg",
        title: "کارهای امروز من",
        // backgroundColor: '#8BE014',
        color: "#80CC16B2",
        // textcolor: '#fff',
        count: 0,
        route: "/basket/referral-list?filter=my_today_work",
      },
      {
        icon: "/image/dashboard/works2.svg",
        title: "کارهای دارای تاخیر",
        // backgroundColor: '#FFA04DB2',
        color: "#FF7700B2",
        // textcolor: '#fff',
        count: 0,
        route: "/basket/referral-list?filter=my_late_work",
      },
      // {
      //   icon: "/image/dashboard/works3.svg",
      //   title: "کارهای قابل پیگیری",
      //   // backgroundColor: '#7EC5FF',
      //   color: "#118EF3B2",
      //   // textcolor: '#fff',
      //   count: "0",
      //   route: "/basket/referral-list?filter=all",
      // },
      {
        icon: "/image/dashboard/Chat.svg",
        title: "پیام های شخصی من",
        backgroundColor: "#EDA6FF",
        color: "#E476FFB2",
        textcolor: "#fff",
        count: 0,
        route: "messages",
      },
    ],
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.getApi();
  },
  methods: {
    getApi() {
      if (this.$checkAccess("access_cartable/cartable_fiscal")) {
        this.$reqApi("user-cartable/fiscal")
          .then((res) => {
            this.get_data = res;

            this.sides[0].count = res.work_today;
            this.sides[1].count = res.work_late;
            this.sides[2].count = res.my_message;
            // this.sides[3].count = res.my_message;

            if (res.list_employee == true) {
              (this.employee_flag = true),
                this.$reqApi("user/list-employee")
                  .then((response) => {
                    this.firstname_employee = response.model.data[0].first_name;
                    this.lastname_employee = response.model.data[0].last_name;
                    this.username_employee = response.model.data[0].username;
                  })
                  .catch((error) => {
                    console.log(error);
                  });
            }
            ////////////////////////////////// this function maybe add in the future
            // if (res.count_work > 0) {
            //   let items = [];
            //   for (let index = 0; index < res.array_work.length; index++) {
            //     const element = this.res.array_work[index];
            //     console.log(333333333333);

            //     items.push(element);
            //   }
            //   this.count_works = items;
            //   console.log(this.count_works);
            // }
          })

          .catch((error) => {
            console.log(error);
          });
      }
    },
    show_employee() {
      this.$router.push("/new-call-center/my-staff");
    },
  },
};
</script>

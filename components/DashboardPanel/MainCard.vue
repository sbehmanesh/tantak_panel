<template>
  <table
    border="1"
    :class="['my-6 border5', $vuetify.breakpoint.mdAndUp ? 'width-800' : '']"
  >
    <tr v-for="(row, i) in rows" :key="i">
      <td>
        <div class="d-flex align-center pa-3">
          <!-- <v-icon :color="row.color">{{ row.icon1 }}</v-icon> -->
          <img :src="row.icon1" />
          <span
            :class="row.color + '--text'"
            class="mr-2"
            >{{ row.title }}</span
          >
        </div>
      </td>
      <td class="pb-0 pa-3">
        <div
          v-for="(menu, i) in row.menus"
          :key="i"
          class="d-flex align-center justify-space-between mb-3"
        >
          <div @click="sendRoute(menu.route)" >
            <img v-if="menu.img" :src="menu.img" />
            <v-icon v-else :color="menu.color">{{ menu.icon }}</v-icon>
            <span class="pointer">{{ menu.title }}</span>
          </div>
          <div :class="['px-2 white--text', menu.color]">{{ menu.count }}</div>
        </div>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  props: {
    getData: {
      default: false,
      Required: false,
    },  
    keyRoute: {
      default: false,
      required: false,
    },
  },
  data: () => ({
    rows: [
      {
        icon1: "/image/dashboard/sales.svg",
        title: "فروش",
        color: "primary",
        menus: [
          {
            img: "/image/dashboard/message.svg",
            title: "کارهای جدید",
            color: "primary",
            count: "",
            route: "",
          },
        ],
      },
      // {
      //   icon1: "/image/dashboard/Project.svg",
      //   title: "پروژه ها",
      //   color: "blue",
      //   menus: [
      //     {
      //       img: "/image/dashboard/message2.svg",
      //       title: "پیام های جدید",
      //       color: "blue",
      //       count: "به زودی",
      //     },
      //   ],
      // },
      {
        icon1: "/image/dashboard/duties.svg",
        title: "وظایف شما",
        color: "green",
        menus: [
          {
            icon: "radio_button_checked",
            title: "وظایف امروز",
            color: "green",
            count: "",
            route: "/tasks?filter=task_today",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف دارای تاخیر",
            color: "red",
            count: "",
            route: "/tasks?filter=task_late",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف دارای زمان",
            color: "blue",
            count: "",
            route: "/tasks?filter=task_time",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف بدون زمان",
            color: "gray",
            count: "",
            route: "/tasks?filter=task_untime",
          },
        ],
      },
      {
        icon1: "/image/dashboard/Email.svg",
        title: "نامه ها",
        color: "black",
        menus: [
          {
            icon: "mail",
            title: "پیام های جدید",
            count: "",
          },
        ],
      },
    ],
  }),
  mounted(){
    
    this.rows[0].menus[0].route = this.keyRoute

  },
  watch: {
    getData() {
      this.rows[0].menus[0].count = this.getData.work_all;
      this.rows[1].menus[0].count = this.getData.task_today;
      this.rows[1].menus[1].count = this.getData.task_late;
      this.rows[1].menus[2].count = this.getData.task_time;
      this.rows[1].menus[3].count = this.getData.task_untime;
    },
  },
  
  methods: {
    sendRoute(path) {
      if (path != null) {
        this.$router.push(path);
      }

      if (path == "basket") {
        this.$router.push("/basket/referral-list");
      }
    },
  },
};
</script>

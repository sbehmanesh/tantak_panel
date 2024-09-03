<template>
  <table border="1" class="my-6 dashboard-table">
    <tr v-for="(row, i) in rows" :key="i">
      <td>
        <v-icon :color="row.color">{{ row.icon1 }}</v-icon>
        <span class="primary--text">{{ row.title }}</span>
      </td>
      <td class="pb-0">
        <div
          v-for="(menu, i) in row.menus"
          :key="i"
          class="d-flex align-center justify-space-between mb-3"
        >
          <div>
            <v-icon :color="menu.color">{{ menu.icon }}</v-icon>
            <span>{{ menu.title }}</span>
          </div>
          <div :class="['px-2 white--text', menu.color]">{{row.count}}</div>
        </div>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  data: () => ({
    rows: [
      {
        icon1: "bar_chart",
        title: "فروش",
        color: "primary",
        menus: [
          {
            icon: "mode_comment",
            title: "پیام های جدید",
            color: "primary",
          },
        ],
        count: "2",
      },
      {
        icon1: "style",
        title: "پروژه ها",
        color: "blue",
        menus: [
          {
            icon: "mode_comment",
            title: "پیام های جدید",
            color: "blue",
          },
        ],
        count: "2",
      },
      {
        icon1: "task_alt",
        title: "وظایف شما",
        color: "green",
        menus: [
          {
            icon: "radio_button_checked",
            title: "وظایف امروز",
            color: "green",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف دارای تاخیر",
            color: "red",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف دارای زمان",
            color: "blue",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف بدون زمان",
            color: "gray",
          },
        ],
        count: "2",
      },
      {
        icon1: "style",
        title: "نامه ها",
        color: "black",
        menus: [
          {
            icon: "mail",
            title: "پیام های جدید",
          },
        ],
        count: "2",
      },
    ],
  }),
};
</script>

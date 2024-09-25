<template>
  <div>
    <v-col>
      <v-row cols="12" class="center-div mt-5">
        <v-chip
          dark
          label
          class="ma-2 px-3"
          color="teal"
          v-for="item in items"
          :key="item.key"
          @click="tab = item.key"
          :outlined="tab != item.key"
        >
          {{ item.text }}
        </v-chip>
      </v-row>
    </v-col>
    <v-col v-if="tab == 'task_today'">
      <v-row cols="12" class="center-div mt-5">
        <v-chip
          dark
          label
          class="ma-2 px-3"
          color="green"
          v-for="item2 in items2"
          :key="item2.key"
          @click="tab2 = item2.key"
          :outlined="tab2 != item2.key"
        >
          {{ item2.text }}
        </v-chip>
      </v-row>
    </v-col>
    <BaseTable
      url="/task"
      :BTNactions="btn_actions"
      createUrl="/tasks/insert"
      :actionsList="actions_list"
      :filters="filter"
      :headers="headers"
      ref="TaskList"
    />
    <Dialog :dialogTask="dialog_task" :task="task" v-if="dialog_task.show" />
    <AmpDelete
      :id="body_id"
      deleteUrl="/task/delete"
      :value="value"
      @deleteItem="refresh"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import Dialog from "~/components/Tsaks/Dialog.vue";
import AmpDelete from "~/components/Base/AmpDelete.vue";
let jmoment = require("moment");
export default {
  components: { BaseTable, Dialog, AmpDelete },
  data: () => ({
    headers: [],
    actions_list: [],
    filter: {},
    task: {},
    dialog_task: { items: null, show: false },
    update_url: "",
    body_id: "",
    title: " لیست  وظایف",
    value: false,
    tab: "all",
    tab2: "today_task",
    items: [
      { text: "همه", key: "all" },
      { text: "وظایف امروز", key: "task_today" },
      { text: "وظایف دارای تاخیر", key: "task_late" },
      { text: "وظایف دارای زمان", key: "task_time" },
      { text: "وظایف بدون زمان", key: "task_untime" },
    ],
    items2: [
      { text: "امروز", key: "today_task" },
      { text: "پایانی", key: "last_task" },
    ],
  }),
  watch: {
    tab() {
      switch (this.tab) {
        case "all":
          if (!Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))) {
            this.filter = {
              start_task: {
                op: "<=",
                value: jmoment().format("YYYY-MM-DD"),
              },
            };
          } else {
            this.filter = {};
          }
          break;
        case "task_today":
          this.filter = {
            start_task: {
              op: "=",
              value: (this.now = jmoment().format("YYYY-MM-DD")),
            },
          };
          break;
        case "task_late":
          this.filter = {
            end_task: {
              op: "<",
              value: jmoment(this.now).add(-1, "days").format("YYYY-MM-DD"),
            },
          };
          break;
        case "task_time":
          if (!Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))) {
            this.filter = {
              start_task: {
                op: "<=",
                value: jmoment().format("YYYY-MM-DD"),
              },
            };
            this.filter["end_task"] = {
              op: "!=",
              value: null,
            };
          } else {
            this.filter = {
              start_task: {
                op: "!=",
                value: null,
              },
            };
            this.filter = {
              end_task: {
                op: "!=",
                value: null,
              },
            };
          }

          break;
        case "task_untime":
          this.filter = {
            end_task: {
              op: "=",
              value: null,
            },
            start_task: {
              op: "=",
              value: null,
            },
          };
          break;
      }
    },
    tab2() {
      switch (this.tab2) {
        case "today_task":
          this.filter = {
            start_task: {
              op: "=",
              value: (this.now = jmoment().format("YYYY-MM-DD")),
            },
          };
          break;
        case "last_task":
          this.filter = {
            end_task: {
              op: "=",
              value: jmoment().format("YYYY-MM-DD"),
            },
          };
      }
    },
  },
  beforeMount() {
    if (!Boolean(this.$checkRole(this.$store.state.auth.role.admin_id))) {
      this.filter = {
        start_task: {
          op: "<=",
          value: jmoment().format("YYYY-MM-DD"),
        },
      };
    }
    this.$store.dispatch("setPageTitle", this.title);
    if (this.$route.query.filter == "task_today") {
      this.tab = "task_today";
    }
    if (this.$route.query.filter == "task_late") {
      this.tab = "task_late";
    }
    if (this.$route.query.filter == "all") {
      this.tab = "all";
    }
    if (this.$route.query.filter == "task_time") {
      this.tab = "task_time";
    }
    if (this.$route.query.filter == "task_untime") {
      this.tab = "task_untime";
    }

    this.headers = [
      {
        filterable: false,
        disableSort: true,
        text: "رنگ ",
        value: (body) => {
          if (body.color) {
            return `<i aria-hidden="true"  color="red" class="v-icon notranslate  material-icons" style="font-size: 20px; color: ${body.color}">fiber_manual_record</i>`;
          } else {
            return `<i aria-hidden="true"  color="red" class="v-icon notranslate  material-icons" style="font-size: 20px; color: grey">fiber_manual_record</i>`;
          }
        },
      },
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      { text: "عنوان", value: "title" },
      {
        filterable: false,
        disableSort: true,
        text: "نام ایجاد کننده",
        value: (body) => {
          if (body.user_creator) {
            if (body.user_creator) {
              if (body.user_creator.first_name) {
                return body.user_creator.first_name;
              } else {
                return body.user_creator.username;
              }
            }
          }
        },
      },
      {
        text: "نام خانوادگی ایجاد کننده",
        filterable: false,
        disableSort: true,
        value: (body) => {
          if (body.user_creator) {
            if (body.user_creator.last_name) {
              return body.user_creator.last_name;
            }
          }
        },
      },
      {
        text: "ارجاع شده به",
        filterable: false,
        disableSort: true,
        value: (body) => {
          if (body.roles.length > 0) {
            return body.roles.map((x) => x.name).join(" | ");
          } else if (body.user_get) {
            if (body.user_get) {
              if (body.user_get.first_name) {
                return body.user_get.first_name + " " + body.user_get.last_name;
              } else {
                return body.user_get.username;
              }
            }
          }
        },
      },
      {
        text: "نوع ایجاد",
        filterType: "select",
        value: "type",
        items: [
          { text: "دستی", value: "manual" },
          { text: "سیستمی", value: "system" },
        ],
      },
    ];
    this.btn_actions = [
      {
        icon: "visibility",
        color: "teal darken-2",
        text: "مشاهده وظیفه",
        fun: (body) => {
          this.dialog_task.show = true;
          this.task = body;
        },
      },
    ];
    this.actions_list = [
      {
        text: "ویرایش",
        fun: (body) => {
          this.$router.push(`/tasks/${body.id}`);
        },
        show_fun: (body) => {
          if (this.$store.state.auth.user.id) {
            let user_id = this.$store.state.auth.user.id;
            if (body.user_creator_id == user_id) {
              return true;
            } else {
              return false;
            }
          }
        },
      },
      {
        text: "حذف",
        fun: (body) => {
          this.value = true;
          this.body_id = body.id;
        },
        show_fun: (body) => {
          let user_id = this.$store.state.auth.user.id;
          if (body.user_creator_id == user_id) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  methods: {
    refresh() {
      this.$refs.TaskList.getDataFromApi();
      this.value = false;
    },
    closeDialog() {
      this.value = false;
    },
  },
};
</script>

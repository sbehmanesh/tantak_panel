<template>
  <div>
    <BaseTable
      url="/task"
      :BTNactions="btn_actions"
      createUrl="/tasks/insert"
      :actionsList="actions_list"
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
export default {
  components: { BaseTable, Dialog, AmpDelete },
  data: () => ({
    headers: [],
    actions_list: [],
    task: {},
    dialog_task: { items: null, show: false },
    update_url: "",
    body_id: "",
    title: " لیست  وظایف",
    value: false,
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

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
          let user_id = this.$store.state.auth.user.id;
          if (body.user_creator_id == user_id) {
            return true;
          } else {
            return false;
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

<template>
  <div>
    <v-col cols="12">
      <BaseTable
        url="user-comment"
        :extraBtn="extraBtn"
        :rootBody="{ user_id: this.modelId }"
        :headers="headers"
      />
    </v-col>
    <CommentForm v-if="comment_dialog.show" :commentDialog="comment_dialog" />
  </div>
</template>

<script>
import CommentForm from "@/components/User/CommentForm.vue";
export default {
  props: {
    modelId: { default: null },
  },
  components: { CommentForm },
  data: () => ({
    headers: [],
    extraBtn: [],
    comment_dialog: {
      items: null,
      show: false,
    },
  }),
  beforeMount() {
    this.headers = [
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
      {
        text: "ثبت کننده",
        value: (body) => {
          if (body.personnel.first_name && body.personnel.last_name) {
            return body.personnel.first_name + " " + body.personnel.last_name;
          } else {
            return body.personnel.username;
          }
        },
      },
      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "توضیحات",
        filterCol: "comment",
        type: "tooltip",
        function: (body) => {
          if (body.comment) {
            return body.comment;
          }
        },
        value: (body) => {
          if (typeof body.comment == "string") {
            if (body.comment.length < 25) {
              return body.comment;
            }
            return body.comment.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.extraBtn = [
      {
        text: "افزودن نظر",
        icon: "add",
        fun: () => {
          this.comment_dialog.show = true;
        },
      },
    ];
  },
  mounted() {
    this.btn_actions = [
      {
        text: "مشاهده پیام  ها ",
        icon: "contact_mail",
        color: "info",
        fun: (body) => {
          this.dialog_file.show = true;
          this.oprator_id = body.id;
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.dialog_oprator_list.show = false;
      this.dialog_oprator_list.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>

<template>
  <div>
    <BaseTable url="/comment-category" :headers="headers" :BTNactions="btns" />
    <SendCommentForm
      v-if="comment_form"
      :dialog="comment_form"
      :model-id="category_id"
      @closeDialog="comment_form = false"
    />
  </div>
</template>

<script>
import SendCommentForm from "@/components/User/SendCommentForm.vue";
export default {
  components: { SendCommentForm },
  data: () => ({
    headers: [],
    btns: [],
    title: "ارسال فرم نظر سنجی",
    comment_form: false,
    category_id: null,
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btns = [
      {
        text: "ارسال لینک نظر سنجی",
        icon: "outgoing_mail",
        color: "blue-grey",
        fun: (body) => {
          this.comment_form = true;
          this.category_id = body.id;
        },
      },

      {
        text: "مشاهده سوالات مربوطه",
        icon: "help",
        color: "teal",
        fun: (body) => {
          let title = body.title;
          let id = body.id;
          this.$router.push({
            path: "/user/comment-form/questions-form",
            query: { title: title, id: id },
          });
        },
      },
    ];
    this.headers = [{ text: "دسته بندی سوالات ", value: "title" }];
  },
};
</script>

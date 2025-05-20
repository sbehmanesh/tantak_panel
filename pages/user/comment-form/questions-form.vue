<template>
  <div>
    <BaseTable
      url="/comment-question"
      :headers="headers"
      :filters="filters"
      autoDelete="/comment-question/delete"
      autoUpdate="/setting/comment-questions"
      :createUrl="create_url"
      :extraBtn="extra_btn"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    extra_btn: [],
    filters: {},
    title: " لیست سوالات",
    create_url: null,
  }),
  beforeMount() {
    if (Boolean(this.$route.query.id)) {
      this.create_url = `/setting/comment-questions/insert?id=${this.$route.query.id}`;
      this.filters = {
        category_id: {
          op: "=",
          value: this.$route.query.id,
        },
      };
    }
    if (Boolean(this.$route.query.title)) {
      this.$store.dispatch(
        "setPageTitle",
        this.title + " - " + "دسته بندی " + this.$route.query.title
      );
    } else {
      this.$store.dispatch("setPageTitle", this.title);
    }
    this.extra_btn = [
      {
        text: "برگشت",
        color: "primary",
        icon: "redo",
        fun: () => {
          this.$router.back();
        },
      },
    ];
    this.headers = [
      { text: "عنوان سوال", value: "question" },
      {
        text: "گزینه ها",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          let answers_items = [];
          if (body.answers.length > 0) {
            answers_items = body.answers
              .map((x) => x.answer)
              .join(`  <br/>  -`);
          }
          if (answers_items.length > 0) {
            return answers_items;
          }
          if (answers_items.length == 0) {
            return "--";
          }
        },
        value: (body) => {
          if (body.answers.length > 0) {
            let answers_items = body.answers
              .map((x) => x.answer)
              .join(`<br/> <br/> <hr />`);
          }
          if (body.answers_items && typeof body.answers_items == "string") {
            if (body.answers_items.length < 25) {
              return body.answers_items;
            }
            return body.answers_items.slice(0, 25) + "...";
          } else {
            return `؟ `;
          }
        },
      },
    ];
  },
};
</script>

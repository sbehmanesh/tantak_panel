<template>
  <div>
    <BaseTable
      url="/comment-question"
      :headers="headers"
      autoDelete="/comment-question/delete"
      autoUpdate="/setting/comment-questions"
      createUrl="/setting/comment-questions/insert"
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
    title: " لیست سوالات",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "عنوان سوال", value: "question" },
      {
        text: "گزینه ها",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          let answers_items = [];
          if (body.answers.length > 0) {
            answers_items = body.answers.map((x) => x.answer).join(`  <br/>  -`);
          }
          if (answers_items) {
            return answers_items;
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

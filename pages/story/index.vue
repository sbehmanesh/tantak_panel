<template>
  <div>
    <BaseTable
      url="/story"
      :headers="headers"
      autoDelete="/story/delete"
      autoUpdate="/story"
      createUrl="/story/insert"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "لیست داستان ها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [   
            {
        text: "تصویر",
        value: "url_img",
        type: "image",
        disableSort: "true",
        filterable: false,
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
      },{ text: "عنوان ", value: "title" } ,     {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },];
  },
};
</script>

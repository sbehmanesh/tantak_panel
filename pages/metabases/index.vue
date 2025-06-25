<template>
  <div>
    <BaseTable
      url="/metabase"
      :headers="headers"
      autoUpdate="/metabases"
      createUrl="/metabases/insert"
      autoDelete="/metabases/delete"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "گزارشات متابیس",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "عنوان ", value: "title" },

      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },
      {
        text: "نوع",
        value: "type",
        filterType: "select",
        items: this.$store.state.static.metabase_type,
      },
      { text: "شناسه داشبورد ", value: "metabase_id" },
      {
        text: "نقش های مرتبت ",
        value: (body) => {
      
            return body.roles.map((x) => x.name).join(" | ");
        },
      },
    ];
  },
};
</script>

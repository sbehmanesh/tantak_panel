<template>
  <div>
    <BaseTable
      url="/user"
      :headers="headers"
      autoDelete="/user/delete"
      autoUpdate="/user"
      createUrl="/user/insert"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    title: "همه کاربران"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.$store.dispatch('setting/getRoleServer')
    this.headers = [
      {
        text: "تصویر",
        value: "avatar",
        type: "image",
        disableSort: "true",
        filterable: false
      },
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
      { text: "کد ملی", filterCol: "national_code", value: "national_code" },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ تولد",
        value: body => {
          if (body.birth_date) {
            return this.$toJalali(
              body.birth_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
          }
          return "";
        }
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: body => {
          if (body.description) {
            return body.description;
          }
        },
        value: body => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        }
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.user_status
      }
    ];
  }
};
</script>

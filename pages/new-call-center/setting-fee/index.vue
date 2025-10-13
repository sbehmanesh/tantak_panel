<template>
  <div>
    <BaseTable
      url="/fee"
      :headers="headers"
      autoDelete="/fee/delete"
      autoUpdate="/new-call-center/setting-fee"
      createUrl="/new-call-center/setting-fee/insert"
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
    title: "کارمزد ها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

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
        text: "نام مدیر",
        value: (body) => {
          if (Boolean(body.user)) {
            let name = body.user.first_name;
            if (Boolean(name)) {
              return name;
            } else {
              return "--";
            }
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (Boolean(body.user)) {
            let name = body.user.last_name;
            if (Boolean(name)) {
              return name;
            } else {
              return "--";
            }
          }
        },
      },  {
        text: "شماره همراه",
        value: (body) => {
          if (Boolean(body.user)) {
            let name = body.user.username;
            if (Boolean(name)) {
              return name;
            } else {
              return "--";
            }
          }
        },
      },
      { text: "سقف درصد", value: "fee_cap" },
      { text: "درصد کارمزد مدیر ", value: "fee_manager" },
      { text: "درصد کارمزد سرپرست  ", value: "fee_supervisor" },
      { text: "درصد کارمزد فروشنده  ", value: "fee_operator" },
    ];
  },
};
</script>

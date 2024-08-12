<template>
  <div>
    <BaseTable
      :headers="headers"
      :actionsList="actions_list"
      url="/user/internal-personnel"
    >
    </BaseTable>

    <InternalPersonnelDialog
      v-if="internal_personnel_dialog.show"
      :personnelDialog="internal_personnel_dialog"
      :user_id="id"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import InternalPersonnelDialog from "~/components/User/InternalPersonnelDialog.vue";
export default {
  components: { BaseTable, InternalPersonnelDialog },
  data: () => ({
    headers: [],
    id: "",
    actions_list: [],
    title: "لیست کارکنان",
    internal_personnel_dialog: {
      items: null,
      show: false,
    },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.actions_list = [
      {
        text: "ویرایش",
        fun: (body) => {
          this.internal_personnel_dialog.show = true;
          this.id = body.id;

          // this.$router.push(`/user/internal-personnel/${body.id}`);
        },
      },
    ];

    this.headers = [
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
      {
        text: "نقش",
        disableSort: "true",
        filterable: false,
        filterCol: "roles",
        value: (body) => {
          if (body.roles) {
            return body.roles.map((x) => x.name).join(" | ");
          }
        },
      },
      {
        filterable: false,
        text: "نام سرور",
        value: (body) => {
          if (Boolean(body.internal)) {
            return body.internal.server_name;
          }
        },
      },
      {
        text: "شماره پورت داخلی",
        value: "internal_port",
      },
    ];
  },
};
</script>

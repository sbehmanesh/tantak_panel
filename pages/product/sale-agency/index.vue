<template>
  <div>
    <BaseTable
      url="/sale-agency"
      autoDelete="/sale-agency/delete"
      :headers="headers"
      autoUpdate="/product/sale-agency"
      :createUrl="create_url"
      :BTNactions="btn_actions"
    >
    </BaseTable>
    <Dialog
      :branchId="id"
      :dialog="show_dialog"
      v-if="show_dialog"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import Dialog from "@/components/Product/Representative/Dialog.vue";
export default {
  components: { Dialog  ,BaseTable},
  data: () => ({
    headers: [],
    btn_actions: [],
    id: "",
    title: "لیست نمایندگی های فروش",
    show_dialog: false,
    create_url: "",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.headers = [
      {
        text: "نام نمابندگی",
        value: "name",
      },
      {
        text: "کد نمابندگی",
        value: "code",
      },
      {
        text: "مدیر نمایندگی",
        filterable: false,
        filtercol: "manager.first_name",
        value: (body) => {
          if (body.manager) {
            let user =
              body.manager.first_name && body.manager.last_name
                ? body.manager.first_name + " " + body.manager.last_name
                : body.manager.username;
            return user;
          }
        },
      },
      {
        text: "شهر",
        filterable: false,
        value: (body) => {
          if (body.country_division) {
            return body.country_division.name;
          }
        },
      },
      {
        text: "ناحیه",
        filterable: false,
        value: (body) => {
          if (body.region) {
            return body.region.fa_name;
          }
        },
      },
      {
        text: "شعبه اصلی",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.agency_main) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.branch_status,
      },
      {
        text: "فروش تلفنی",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.sale_phone) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "فروش حضوری",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.sale_person) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "فروش آنلاین",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.sale_online) {
            return true;
          } else {
            return false;
          }
        },
      },
      { text: "امتیاز", value: "score" },
      {
        text: "آدرس",
        filterCol: "address",
        type: "tooltip",
        function: (body) => {
          if (body.address) {
            return body.address;
          }
        },
        value: (body) => {
          if (typeof body.address == "string") {
            if (body.address.length < 25) {
              return body.address;
            }
            return body.address.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "موجودی انبار",
        icon: "storefront",
        color: "primary",
        fun: (body) => {
          this.id = body.id;
          this.show_dialog = true;
        },
      },
    ];
    if (this.$store.state.auth.action.indexOf("sale_agencies/root")) {
      this.create_url = "/product/sale-agency/insert";
    }
  },
  methods: {
    closeDialog() {
      this.show_dialog = false;
    },
  },
};
</script>

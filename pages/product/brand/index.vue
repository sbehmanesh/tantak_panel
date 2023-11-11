<template>
    <v-row>
      <v-col cols="12" md="12">
        <BaseTable
          url="/brand"
          :headers="headers"
          :filters="filters"
          ref='tableWholesale'
          :BTNactions="btn_actions"
          :autoDelete="deleteUrl"
          :autoUpdate="updateUrl"
          :createUrl="createUrl"
        />
      </v-col>
    </v-row>
  </template>
  
  <script>
  import BaseTable from "@/components/DataTable/BaseTable";
  export default {
    components: { BaseTable },
    data: () => ({
      createUrl: "/product/brand/insert",
      deleteUrl: "/brand/delete",
      updateUrl: "/product/brand",
      headers: [],
      filters: {},
      items: [],
      btn_actions: [],
      items_chip: [
        {
          text: "بررسی شده",
          value: "reviewed",
          outline: false
        },
        {
          text: "در حال انتظار",
          value: "pending",
          outline: true
        }
      ],
      // dialogShowItem: { show: false, item: null },
      title: "برند ها"
    }),
    beforeMount() {
      this.$store.dispatch("setPageTitle", this.title);
    },
    mounted() {
      this.btn_actions = [
        {
          color: "success",
          text: "محصولات",
          fun: body => {
            if (body.id) {
                this.$router.push("/product/brand/product/"+body.id+"?name="+body.name)
            }
          },
        }
      ];
      this.headers = [
        {
          text: "زمان ثبت",
          filterType: "date",
          filterCol: "created_at",
          value: body => {
            if (body.created_at) {
              return this.$toJalali(body.created_at);
            }
            return "";
          }
        },
        { text: "نام", value: "name" },
        { text:'تعداد محصول', value:'products_count'}
      ];
    },
    methods: {
      reviewContact(data) {
        data.status = "reviewed";
        this.$reqApi("/contact-us-form/update", data)
          .then(res => {
            this.dialogShowItem.show = false;
            this.$refs.tableContactUs.getDataFromApi();
          })
          .catch(err => {
            return err;
          });
      }
    }
  };
  </script>
  
  <style></style>
  
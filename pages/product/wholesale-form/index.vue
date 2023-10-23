<template>
  <v-row>
    <v-col cols="12" md="12" class="center-div" >
      <v-chip
        dark
        class="ma-2"
        color="primary"
        v-for="(item, index) in items_chip"
        :key="index"
        @click="setFilters(item.value)"
        :outlined="item.outline"
      >
        {{ item.text }}
      </v-chip>
    </v-col>
    <v-col cols="12" md="12">
      <BaseTable
        url="/wholesale-form"
        :headers="headers"
        :filters='filters'
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
    createUrl: "/product/wholesale-form/insert",
    deleteUrl: "/wholesale-form/delete",
    updateUrl: "/product/wholesale-form",
    headers: [],
    filters:{
      status:{
        op:'=',
        value:'reviewed'
      }
    },
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
    title: "فروش عمده"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {
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
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      {
        text: "شماره تماس",
        value: "phone_number"
      },
      {
        text: "وضعیت",
        filterType: "select",
        value: "status",
        items: this.$store.state.static.status_contact_form
      }
    ];
  },
  methods: {
    setFilters(data) {
      this.items_chip.forEach(element => {
        if (element.value == data) {
          element.outline = false;
        } else {
          element.outline = true;
        }
      });
      if (data) {
        this.filters = {
          status: {
            op: "=",
            value: data
          }
        };
      } else {
        this.filters = {};
      }
    }
  }
};
</script>

<style></style>

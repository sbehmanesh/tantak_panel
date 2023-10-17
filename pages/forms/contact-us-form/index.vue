<template>
  <div>
    <v-dialog v-model="dialogShowItem.show" max-width="700">
      <v-card v-if="dialogShowItem.item" class="pa-4">
        <v-card-title class="d-flex justify-space-around flex-wrap">
          <span dir="ltr">
            تاریخ ارسال : {{ $toJalali(dialogShowItem.item.created_at) }}
          </span>
          <span class="font_24">
            {{ dialogShowItem.item.first_name }}
            {{ dialogShowItem.item.last_name }}
          </span>
          <span> شماره تماس : {{ dialogShowItem.item.phone_number }} </span>
        </v-card-title>
        <v-card-text>
          <v-divider class="mb-2"></v-divider>
          <v-row>
            <v-col cols="12" md="12" class="mt-3 mx-3 " > {{dialogShowItem.item.subject}} : </v-col>
            <v-col cols="12" md="12" class="mx-3" >{{dialogShowItem.item.text}}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <BaseTable
      url="/contact-us-form"
      :headers="headers"
      :BTNactions="btn_actions"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    createUrl: "/forms/contact-us-form/insert",
    deleteUrl: "/contact-us-form/delete",
    updateUrl: "/forms/contact-us-form",
    headers: [],
    items: [],
    btn_actions: [],
    dialogShowItem: { show: false, item: null },
    title: "تماس با ما"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      {
        color: "primary",
        icon: "edit",
        text: "",
        fun: body => {
          if (body.id) {
            this.dialogShowItem.show = true;
            this.dialogShowItem.item = body;
          }
        }
      }
    ];
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
      { text: "نام", value: "last_name" },
      {
        text: "شماره تماس",
        value: "phone_number"
      },
      {
        text: "موضوع",
        value: "subject"
      },
      {
        text: "وضعیت",
        filterType: "select",
        value: "status",
        items: this.$store.state.static.status_contact_form
      }
    ];
  }
};
</script>

<style></style>

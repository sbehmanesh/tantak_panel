<template>
          <div>
            <!-- <v-dialog v-model="dialogShowItem.show" max-width="700">
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
            </v-dialog> -->
            <BaseTable
          url="/complaint/referral-history-all/complaints/logs"
          :headers="headers"
          :root-body="{  section_name: 'Complaint' }"
        />
          </div>
        </template>
        
        <script>
        import BaseTable from "@/components/DataTable/BaseTable";
        export default {
          components: { BaseTable },
          data: () => ({

            headers: [],
            title: "تاریخچه کلی ارجاعات شکایت"
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
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "از",
        value: (body) => {
          if (body.send_user_first_name && body.send_user_last_name) {
            return body.send_user_first_name
              ? body.send_user_first_name +
                  " " +
                  body.send_user_last_name
              : "--";
          }
        },
      },
      {text:"فرستنده", value:"send_user_username"},
  
      {
        text: "به",
        value: (body) => {
          if (body.get_user_first_name) {
            return body.get_user_first_name
              ? body.get_user_first_name + " " + body.get_user_last_name
              : "--";
          } else {
            return "--";
          }
        },
      },
      {text:"گیرنده"  ,value:"get_user_username"},


      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.complaint_step,
      },      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.complaint_status,
      },

    ];
          }
        };
        </script>
        
        <style></style>
        
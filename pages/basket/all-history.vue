<template>
  <div>
    <v-col>
      <v-row class="mt-5 justify-center">
        <v-col cols="12" md="4">
          <v-expansion-panels v-model="panel" class="elevation-3">
            <v-expansion-panel class="card-style">
              <v-expansion-panel-header expand-icon="search">
                <v-banner single-line>
                  <span class="font_17">جستوجوی پیشرفته</span>
                </v-banner>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <SearchHistoryBasket
                  :total-data="totalData"
                  @setFilters="setFiltersBySearch($event)"
                  @cleareAll="tab == all"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-col>
    <ChatDialog
      :dialog="chat_dilog"
      v-if="chat_dilog"
      @closeDialog="chat_dilog = false"
      :data="totalData"
      url="/basket/my-referral-history"
  
    />
    <BaseTable
      url="/basket/my-referral-history"
      @getData="getTotalData($event)"
      :filters="filters"
      :extraBtn="extra_btn"
      :headers="headers"
      :BTNactions="btn_actions"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import SearchHistoryBasket from "@/components/Product/SearchHistoryBasket.vue";
import ChatDialog from "@/components/NewCallCenter/ChatDialog.vue";

export default {
  components: { BaseTable, SearchHistoryBasket, ChatDialog },
  data: () => ({
    tab: "all",
    items: [
      { text: "همه", key: "all" },
      { text: "فعالیت های من", key: "my_logs" },
    ],
    headers: [],
    chat_dilog: false,
    btn_actions: [],
    extra_btn: [],
    totalData: [],
    user_login_id: "",
    panel: "",
    filters: {},
    title: "تاریخچه سبد های خرید",
  }),
  watch: {},

  beforeMount() {
    this.extra_btn = [
      {
        text: "پیام ها",
        icon: "chat",
        color: "info darken-1",
        fun: () => {
          this.chat_dilog = true;
        },
      },
    ];
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
        filterable: false,
        disableSort: true,
        text: "شماره فاکتور",
        value: "factor_number",
      },

      {
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.$store.state.static.step_status_baskets,
      },
      {
        filterable: false,
        disableSort: true,
        value: "factor_numbser",
      },
   
      {
        filterable: false,
        disableSort: true,
        text: " روند ارجاع ",
        value: (body) => {
          let sender = "";
          if (
            Boolean(body.sender_first_name) &&
            Boolean(body.sender_last_name)
          ) {
            sender = body.sender_first_name + " " + body.sender_last_name;
          } else {
            sender = body.sender_username;
          }
          let geter = "";

          if (Boolean(body.geter_first_name) && Boolean(body.geter_last_name)) {
            geter = body.geter_first_name + " " + body.geter_last_name;
          } else if (Boolean(body.geter_username)) {
            geter = body.geter_username;
          } else {
            geter = "ندارد";
          }

          return `
          <h1 class="my-2">
            <small class="vlack--text"> ارجاع دهنده :${sender} </small>
            <br/>
            <small class="grey--text"> گیرنده  :‌  ${geter}</small>
            </h1>
            `;
        },
      },
    ];
    this.btn_actions = [
      {
        text: "مشاهده فایل",
        icon: "attach_file",
        color: "info darken-2",
        fun: (body) => {
          window.open(this.$getImage(body.file));
        },
        show_fun: (body) => {
          if (body.file) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  methods: {
    getTotalData(data) {
      if (this.totalData.length < 1) {
        this.totalData = data.model.data;
      }
    },
    setFiltersBySearch(filters) {
      this.filters = { ...filters };
    },
  },
};
</script>
<style scoped>
.card-style {
  border: 1px solid #0000003d;
  border-radius: 7px;
}
</style>

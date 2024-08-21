<template>
  <v-dialog v-model="dialogFile" persistent class="white pa-4" max-width="1200">
    <v-card class="white pa-2">
      <v-card-title>
        <span class="d-flex flex-column" style="font-size: 21px">
          لیست انبارک
        </span>

        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-4">
        <BaseTable
          url="/small-stock/history"
          :headers="header_history"
          :rootBody="root_body_history"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialogFile: {
      default: false,
      require: false,
    },
    stokeId: {
      default: false,
      require: false,
    },
  },
  data() {
    return {
      header_history: [],
      show_history: false,
      root_body_history: {},
    };
  },
  beforeMount() {
    this.root_body_history = {
      small_stock_id: this.stokeId,
    };
  },
  mounted() {
    this.header_history = [
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
        text: "کاربر",
        value: (body) => {
          if (body.user) {
            return body.user.username;
          }
        },
      },
      {
        text: "تعداد",
        value: (body) => {
          if (body.number) {
            return body.number;
          }
        },
      },
      {
        text: "نوع",
        value: "type",
        filterType: "select",
        items: this.$store.state.static.status_type,
      },
      {
        text: "توضیحات",
        filterCol: "description",
        value: (body) => {
          if (body.text_log) {
            return body.text_log;
          }
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.$emit("cloaseDialog");
    },
  },
};
</script>

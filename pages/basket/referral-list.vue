<template>
  <div>
    <BaseTable
      url="/basket/referral-list"
      :headers="headers"
      :actions="actions"
      :BTNactions="btn_actions"
      :rootBody="rootBody"
      :actionsList="actionsList"
    />
    <v-dialog v-model="dialog_itesm.show">
      <v-card class="white pa-3">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>تاریخچه پرداخت ها</span>
          <v-btn icon color="error" @click="dialog_itesm.show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text clsas="pa-5">
          <v-row>
            <v-col cols="12" md="12">
            </v-col>
            <v-col cols="12" md="12" class="pa-8" >
              <template>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">مبلغ</th>
                        <th class="text-center">نوع پرداخت</th>
                        <th class="text-center">تاریخ پرداخت</th>
                        <th class="text-center">وضعیت</th>
                        <th class="text-center">توضیحات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in dialog_itesm.item"
                        :key="index"
                      >
                        <td dir="ltr">{{ $toJalali(item.created_at) }}</td>
                        <td><small>ریال</small>{{ $price(item.price) }} </td>
                        <td>{{ setKind(item.kind_set) }}</td>
                        <td>{{ setStatus(item.status) }}</td>
                        <td>{{ item.text }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  props: {
    rootBody: { default: () => ({}) },
    filters: { default: () => ({}) },
    btnActions: { type: Array, default: () => [] },
    actionsList: { type: Array, default: () => [] },
  },
  data: () => ({
    headers: [],
    items: [],
    actions: [],
    kind_set_item: [
      { text: "کارت به کارت", value: "cardToCard" },
      { text: "ارسال لینک", value: "send_pay_link" },
    ],
    status_items: [
      {
        text: "پرداخت شده",
        value: "payed",
      },
      {
        text: "باز ",
        value: "open",
      },
      {
        text: "در انتظار",
        value: "waiting",
      },

      {
        text: "تکمیل شده ",
        value: "completed",
      },
      {
        text: "کنسل شده",
        value: "canceled",
      },
      {
        text: "ترکیبی ",
        value: "mixture",
      },
    ],
    title: "سبد های خرید",
    dialog_itesm: {
      show: false,
      item: null,
    },
    btn_actions: [],
    form: {
      fa_name: "",
      en_name: "",
      code: "",
    },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      {
        text: "تاریخچه پرداخت",
        icon: "list",
        color: "info darken-2",
        fun: (body) => {
          if (body.payments.length > 0) {
            this.dialog_itesm.show = true;
            this.dialog_itesm.item = body.payments;
          }
        },
      },
    ];
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
        disableSort: "true",
        filterable: false,
        text: "نام",
        value: (body) => {
          if (body.user) {
            return body.user.first_name;
          }
        },
      },
      {
        disableSort: "true",
        filterable: false,
        text: "نام خانوادگی",
        value: (body) => {
          if (body.user) {
            return body.user.last_name;
          }
        },
      },
      {
        disableSort: "true",
        filterable: false,
        text: "شماره تماس",
        value: (body) => {
          if (body.user) {
            return body.user.username;
          }
        },
      },
      {
        text: "شماره فاکتور",
        value: "factor_number",
      },
      {
        text: "مبلغ",
        filterCol: "price",
        value: (body) => {
          if (body.price) {
            return `${this.$price(body.price)} ریال`;
          } else {
            return "__";
          }
        },
      },
      {
        text: "محصول",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.items) {
            let items = [];
            body.items.map((x) => {
              items.push(`${x.product.name} | ${x.information}`);
            });
            return items.join(" , ");
          } else {
            return "-";
          }
        },
      },
      {
        text: "وزن",
        value: "total_weight",
      },
    ];
  },
  methods: {
    setKind(value) {
      let text = "-";
      this.kind_set_item.map((x) => {
        if (x.value == value) {
          text = x.text;
        }
      });
      return text;
    },
    setStatus(value) {
      let text = "-";
      this.status_items.map((x) => {
        if (x.value == value) {
          text = x.text;
        }
      });
      return text;
    },
  },
};
</script>

<style>
.counter_col {
  border: 1px solid gray;
  margin: 5px 0px;
}
</style>

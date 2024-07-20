<template>
  <div>
    <v-col cols="12">
      <BaseTable
        url="/payment"
        :filters="filters"
        :headers="headers"
        ref="confimationManul"
        :BTNactions="btn_actions"
      />
      <v-overlay v-if="overlay">
        <v-card min-width="600" class="pa-6 primary lighten-1">
          <v-form v-model="valid">
            <amp-select
              text="تغییر وضعیت"
              v-model="change_staus"
              :items="items_staus"
              rules="require"
            >
            </amp-select>
            <amp-jdate
              text="تاریخ پرداخت"
              v-model="form.paid_date"
              rules="require"
              v-if="change_staus == 'payed'"
            />
            <amp-upload-file
              title="رسید پرداخت"
              v-model="form.receipt_img"
              rules="require"
              class="my-3"
              Cclass="success"
              v-if="change_staus == 'payed'"
            />
            <amp-textarea
              text="توضیحات"
              v-model="form.description"
              rules="require"
              v-if="change_staus == 'payed'"
            />
            <v-card-actions class="center-div">
              <amp-button
                text="تایید"
                color="success"
                @click="changeStatus"
                :disabled="!valid"
                :loading="loading_for_change_stauts"
              />
              <amp-button
                text="انصراف"
                color="error"
                @click="overlay = false"
              />
            </v-card-actions>
          </v-form>
        </v-card>
      </v-overlay>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
    userChangeStatus: {
      type: Boolean,
      default: false,
    },
    overlay: false,
  },
  components: {},
  data: () => ({
    headers: [],
    filters: {},
    btn_actions: [],
    valid: false,
    extraBtn: [],
    body: {},
    items_staus: [
      { text: "پرداخت شده", value: "payed" },
      { text: "کنسل شده", value: "cancled" },
    ],
    loading_for_change_stauts: false,
    change_staus: "",
    form: {
      status: "",
      description: "",
      paid_date: "",
      receipt_img: "",
    },
  }),
  watch: {
    overlay() {
      if (this.overlay == false) {
        this.body = {};
        this.form = {
          status: "",
          description: "",
          paid_date: "",
          receipt_img: "",
        };
      }
    },
  },
  beforeMount() {
    this.filters = { user_id: this.modelId };
    if (this.userChangeStatus) {
      this.btn_actions = [
        {
          color: "success",
          icon: "change_circle",
          text: "تغییر وضعیت",
          fun: (body) => {
            if (body.id) {
              this.overlay = true;
              this.body = body;
              this.change_staus = body.status;
            }
          },
          show_fun: (body) => {
            if (body.status == "wait" && body.kind_set == "cardToCard") {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          color: "primary",
          icon: "image",
          text: "فایل",
          fun: (body) => {
            if (body.receipt_img) {
              window.open(`${this.$store.state.file_url}/${body.receipt_img}`);
            }
          },
          show_fun: (body) => {
            if (Boolean(body.receipt_img)) {
              return true;
            } else {
              return false;
            }
          },
        },
      ];
    }
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
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: [
          { text: "منتظر پرداخت", value: "wait" },
          { text: "پرداخت شده", value: "payed" },
          { text: " پرداخت نشده", value: "unpayed" },
          { text: "برگشت ", value: "reject" },
          { text: "کنسل شده", value: "cancled" },
        ],
      },
      {
        text: "نوع پرداخت",
        value: "kind_set",
        filterType: "select",

        items: [
          { text: " بانکی", value: "bank" },
          { text: " دستی", value: "manual" },
          { text: "  کارت به کارت ", value: "cardToCard" },
          { text: "نقدی ", value: "naghd" },
          { text: " چک", value: "check" },
          { text: "ارسال لینک پرداخت", value: "send_pay_link" },
          { text: "   کارت خوان", value: "pos" },
          { text: " پرداخت درب منزل", value: "post" },
        ],
      },
      {
        text: "شماره تراکنش بانکی",
        value: "transaction_number",
      },

      { text: "مقدار پرداختی (ریال)", type: "price", value: "price" },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.text) {
            return body.text;
          }
        },
        value: (body) => {
          if (typeof body.text == "string") {
            if (body.text.length < 25) {
              return body.text;
            }
            return body.text.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ پرداخت",
        value: (body) => {
          if (body.paid_date) {
            return this.$toJalali(
              body.paid_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
          }
          return "پرداخت نشده";
        },
      },
    ];
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.dialog_oprator_list.show = false;
      this.dialog_oprator_list.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    changeStatus() {
      if (this.change_staus) {
        this.loading_for_change_stauts = true;
        let form = {
          status: this.change_staus,
          id: this.body.id,
          description: this.form.description,
          paid_date: this.form.paid_date,
          receipt_img: this.form.receipt_img,
        };
        this.$reqApi("/payment/confirmation-manual", form)
          .then((res) => {
            this.overlay = false;
            this.$refs.confimationManul.getDataFromApi();
            this.loading_for_change_stauts = false;
          })
          .catch((err) => {
            this.loading_for_change_stauts = false;

            return err;
          });
      }
    },
  },
};
</script>

<style></style>

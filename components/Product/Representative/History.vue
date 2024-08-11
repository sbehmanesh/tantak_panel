<template>
  <v-row justify="center">
    <v-card>
        
            <v-row class="align-center d-flex justify-center mt-2" > 
                <v-icon size="80">
                    shopping_basket
                </v-icon>
                <v-col cols="12" class="text-center">
                    <h1 class="font_13">
                    {{ productVarInfo }}
                </h1>
                <v-btn text color="teal darken-3" @click="backStep">
                    <v-icon size="18">
                        arrow_circle_right
                    </v-icon>
                    <span>
                        برگشت

                    </span>
                </v-btn>
                </v-col>
     
            </v-row>
      <BaseTable
        url="/sale-agency-stock/history"
        :headers="headers"
        :filters="filters"
        :root-body="root_body"
      />
    </v-card>
  </v-row>
</template>
<script>
export default {
  props: {
    branchId: {
      require: false,
      default: false,
    },
    productVarId: {
      require: false,
      default: false,
    },    productVarInfo: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      panel: 1,
      continue_form: false,
      loading: false,
      filters: {},
      response: [],
      headers: [],
      product: { product_id: "" },
      root_body: "",
      url: "",
      product_var_info: "",
      valid: true,
      update: false,
      form: {
        skock: "",
        description: "",
        save_skock: "",
        sale_agency_id: "",
        product_var_id: "",
      },
    };
  },

  mounted() {
    this.filters = {
      varcomb_id: {
        op: "=",
        value: this.productVarId,
      },
    };
    this.root_body = { sale_agency_id: this.branchId };
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
        text: "نام کاربر",
        filtrabel: false,
        value: (body) => {
          if (body.user.first_name) {
            return body.user.first_name;
          } else {
            return body.user.username;
          }
        },
      },  
        {
        text: "نام خانوادگی",
        filtrabel: false,
        value: (body) => {
          if (body.user.last_name) {
            return body.user.last_name;
          } else {
            return "--";
          }
        },
      },

      {
        text: "موجودی",
        filterable: false,
        value: (body) => {
          let items = [];
          items.push(
            `<span class="teal--text font_11"> موجودی قبلی : ${body.befor_change_stock.toLocaleString()} </span>`
          )
          items.push(
            `<span class="primary--text font_11">موجودی جدید:   ${body.after_change_stock.toLocaleString()} </span>`
          );
          items.push(
            `<span class="teal--text font_11">موجودی قبلی انبار : ${body.befor_change_saved_stock.toLocaleString()} </span>`
          );       items.push(
            `<span class="primary--text font_11">موجودی جدید انبار   : ${body.after_change_saved_stock.toLocaleString()} </span>`
          );
          return items.join("<br>");
        },
      },
      {
          text: "پیام",
          filterable: false,
          type: "tooltip",
        function: (body) => {
          if (body.text_log) {
            return body.text_log;
          }
        },
        value: (body) => {
          if (typeof body.text_log == "string") {
            if (body.text_log.length < 25) {
              return body.text_log;
            }
            return body.text_log.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
  },
  methods: {
    backStep() {
      this.$emit("backStep");
    },
  },
};
</script>

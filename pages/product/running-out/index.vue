<template>
  <div>
    <BaseTable
      excel
      url="/reduce-product"
      :headers="headers"
      :rowColor="rowColor"
      :BTNactions="btn_actions"
    >
    </BaseTable>
    <RunningOut
      v-if="show_product"
      :dialog="show_product"
      :product-id="product_id"
      @closeDialog="show_product = false"
    />
  </div>
</template>

<script>
import RunningOut from "@/components/Product/RunningOut.vue";
export default {
  components: {
    RunningOut,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    removeDialog: false,
    show_product: false,
    loading: false,
    time: 3,
    timeInterval: null,
    extraBtn: [],
    title: " محصولات رو به اتمام",
    product_id: "",
  }),
  beforeMount() {
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
        text: " ",
        filterable: false,
        value: (body) => {
          let text =
            body.section_name == "agency" ? "نمایندگی فروش" : "انبار مرکزی";
          return text;
        },
      },

      {
        text: "کد",
        filterable: false,
        value: (body) => {
          if (Boolean(body.agency)) {
            return body.agency.code;
          } else if (Boolean(body.center)) {
            return body.center.code;
          }
        },
      },

      {
        text: "توضیحات",
        filterCol: "text",
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
        text: " وضعیت محصول ",
        filterable: false,
        value: (body) => {
          if (Boolean(body.valid)) {
            return "محصول  در خطر  اتمام  موجودی است";
          } else {
            return "--";
          }
        },
      },
    ];

    this.btn_actions = [
      {
        color: "red",
        text: "مشاهده محصول",
        fun: (body) => {
          this.show_product = true;
          this.product_id = body.product_variation_combination.id;
        },
        show_fun: (body) => {
          if (Boolean(body.product_variation_combination)) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },

  methods: {
    rowColor(body) {
      if (Boolean(body.item.valid)) {
        return "red lighten-4";
      }
    },
  },
};
</script>

<template>
  <v-col cols="12" class="mt-5">
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="7">
        <SearchByCatgory
          @productId="setFilter($event, 'id')"
          @type="setFilter($event, 'type')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-col cols="12" md="4">
          <v-banner single-line>
            <v-row class="align-center pa-4">
              <h1>مورد انتخاب شده {{ selected_item.length }}</h1>
              <v-spacer></v-spacer>
              <v-col cols="3" md="2" class="ma-2">
                <amp-button
                  text="تایید"
                  height="38"
                  block
                  color="teal darken-2"
                  @click="sendEmit"
                  :disabled="selected_item.length == 0"
                />
              </v-col>
            </v-row>
          </v-banner>
        </v-col>

        <BaseTable
          ref="ReloadList"
          v-model="selected_item"
          url="/sale-agency-stock/manager-list"
          :headers="headers"
          @getData="totalData($event)"
          :filters="filters"
          :root-body="root_body"
          :BTNactions="btn_actions"
        />
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import SearchByCatgory from "@/components/Product/Representative/SearchByCatgory.vue";
export default {
  components: {
    SearchByCatgory,
  },
  props: {
    branchId: {
      require: false,
      default: false,
    },
    dialog: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      tab: "products",
      items: [
        { text: "محصول", key: "products", icon: "local_mall" },
        { text: "پکیج ", key: "packages", icon: "bento" },
      ],
      skock: "",
      continue_form: false,
      show_history: false,
      varcome_excel: false,
      rotation: false,
      loading: false,
      actions_list: [],
      total_data: [],
      extra_btn: [],
      headers: [],
      slected_product: {},
      products_list: [],
      selected_list: [],
      selected_item: [],
      btn_actions: [],
      overlay: false,
      product: { product_id: "" },
      root_body: "",
      product_var_id: "",
      valid: true,
      update: false,
      form: {
        sale_agency_id: "",
        array_section: [],
      },
      filters: {},
      selected_var: {},
    };
  },
  computed: {},
  watch: {
    selected_item: {
      deep: true,
      handler() {
        let selected = this.total_data.find(
          (x) => x.id == this.selected_item[this.selected_item.length - 1]
        );
        if (Boolean(selected)) {
          selected["count"] = "1";
          this.selected_var = selected;
        }
      },
    },

    tab() {
      this.continue_form = false;
    },
  },
  beforeMount() {
    this.root_body = {
      sale_agency_id: this.$store.state.auth.user.sale_agenciy_id,
    };
    this.url_list = "/sale-agency-stock/manager-list";
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        text: "نوع ",
        disableSort: true,
        filterable: false,
        value: (body) => {
          if (body.section_name == "ProductVariationCombination") {
            return "محصول";
          } else {
            return "پکیج";
          }
        },
      },
      {
        text: "اطلاعات",
        disableSort: true,
        filterable: false,
        value: (body) => {
          let text = "";
          let product_name = "";
          let var_1 = "";
          let var_2 = "";
          let var_3 = "";

          if (body.section_name == "ProductVariationCombination") {
            if (body.product_var && body.product_var.product) {
              product_name = body.product_var.product.name;
            }
            if (body.product_var.variation1) {
              var_1 = Boolean(body.product_var.variation1.colors)
                ? body.product_var.variation1.colors
                : body.product_var.variation1.value;
            }
            if (body.product_var.variation2) {
              var_2 = body.product_var.variation2.value;
            }
            if (body.product_var.variation3) {
              var_3 = body.product_var.variation3.value;
            }
            text = `${product_name}  ( ${var_1} - ${var_2} - ${var_3} )`;
            return text;
          } else if (body.section_name == "Package") {
            return body.package.name;
          }
          {
          }
        },
      },
      { text: "", value: "", disableSort: true, filterable: false },

      {
        text: "",
        width: "10px",
        type: "checkbox",
        disableSort: true,
        filterable: false,
        fun: (body) => {
          console.log("dddd ===  B", body);
        },
      },
      { text: "", value: "", disableSort: true, filterable: false },
    ];
  },
  methods: {
    sendEmit() {
      this.$emit("selected_data", {
        list: this.total_data,
        selected_item: this.selected_item,
      });
    },
    totalData(event) {
      this.total_data = event.model.data;
      console.log("this.total_data >>> ", this.total_data);
    },
    //     submit() {
    //       this.loading = true;
    //       let items = [];
    //       for (let i = 0; i < this.products_list.length; i++) {
    //         const x = this.products_list[i];
    //         items.push({
    //           section_id: x.section_id,
    //           section_name: x.section_name,
    //           skock: x.skock,
    //         });
    //       }
    //       let form = { ...this.form };
    //       form.sale_agency_id = this.$store.state.auth.user.sale_agenciy_id;
    //       form.array_section = items;
    //       let url = this.update
    //         ? "sale-agency-stock/update"
    //         : "sale-agency-stock/insert-manager";
    //       this.$reqApi(url, form)
    //         .then((response) => {
    //           this.step == 1;
    //           this.$toast.success(
    //             "عملیات با موفقیت انجام شده و درخواست شما با موفقیت ثبت شد"
    //           );
    //           this.loading = false;
    //           this.update = false;
    //           this.$refs.Refresh.getDataFromApi();
    //           this.canceld();
    //           this.products_list = [];
    //         })
    //         .catch((err) => {
    //           this.loading = false;
    //           this.update = false;
    //           this.canceld();
    //           this.continue_form = false;
    //         });
    //     },
    refresh() {
      this.$refs.ReloadList.getDataFromApi();
    },
    setFilter(event, key) {
      if (key == "id") {
        this.root_body["parent_id"] = event;
        this.refresh();
      } else if (key == "type") {
        if (event == "all") {
          this.filters = {};
        } else {
          this.filters = {
            section_name: { op: "=", value: event },
          };
        }
      }
    },
    setlist() {
      this.selected_list.push(this.selected_var);
      console.log("this.selected_list >. ", this.selected_list);
      this.overlay = false;
    },
  },
};
</script>
<style>
.card-style {
  border: 2px solid #00000031;
  border-radius: 7px;
}
</style>

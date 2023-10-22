<template>
  <div>
    <BaseTable
      url="/product-variation-combination"
      :headers="headers"
      :BTNactions="btn_actions"
    >
    </BaseTable>

    <v-dialog
      v-model="updateeDiaolog"
      :width="$vuetify.breakpoint.mdAndUp ? 1000 : 1000"
    >
      <v-card class="pa-5">
        <span class="mb-2 font_xxxl font_bold">ویژگی انتخابی حذف شود؟</span>
        <v-form v-model="valid" @submit.prevent="submit()">
          <v-row class="pa-3">
            <v-col cols="4">
              <amp-input
                is-price
                text="قیمت تومان"
                v-model="form.price"
                rules="require"
              />
            </v-col>
            <v-col cols="4">
              <amp-input
                is-number
                text="وزن بسته کیلوگرم"
                v-model="form.weight"
                rules="require"
              />
            </v-col>
            <v-col cols="4" v-if="form.type == 'single_sell'">
              <amp-input
                text="موجودی"
                is-number
                v-model="form.max"
                rules="require"
              />
            </v-col>
            <v-col cols="6">
              <amp-button
                text="به روزرسانی"
                class="w-max"
                color="success"
                type="submit"
                :loading="loading"
                :disabled="!valid || loading"
              />
            </v-col>
            <v-col cols="6">
              <amp-button
                text="منصرف شدم"
                color="accent"
                class="w-max"
                @click="showUpdateDialog(false)"
                :disabled="loading"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog width="800" v-model="history_dialog.show">
      <v-card v-if="history_dialog.show" class="pa-5">
        <StockHistory
          @closeDialog="closeDialog"
          v-model="history_dialog.item.id"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import StockHistory from "~/components/Product/StockHistory";

export default {
  components: { BaseTable, StockHistory },
  data: () => ({
    loading: false,
    valid: false,
    updateeDiaolog: false,
    history_dialog: { show: false, item: null },

    headers: [],
    btn_actions: [],
    title: "فهرست محصولات",
    form: {
      id: "",
      price: "",
      weight: "",
      max: ""
    }
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      // { text: ' ', value: 'product_picture_path', type: 'image', disableSort: 'true', filterable: false, size: 'small' },
      { text: "محصول", value: "product_name" },
      {
        text: "مشخصات",
        value: body => {
          let name = "";
          if (body.variation1_info) {
            name +=
              body.variation1_info.variation_type.value +
              " " +
              body.variation1_info.value;
          }
          if (body.variation2_info) {
            name +=
              " - " +
              body.variation2_info.variation_type.value +
              " " +
              body.variation2_info.value;
          }
          if (body.variation3_info) {
            name +=
              " - " +
              body.variation3_info.variation_type.value +
              " " +
              body.variation3_info.value;
          }
          return name;
        },
        disableSort: "true",
        filterable: false
      },
      {
        text: "نوع فروش",
        value: "sell_type",
        filterType: "select",
        items: this.$store.state.static.sell_status
      },
      { text: "قیمت", value: "price", type: "price" },
      // { text: 'وزن', value: 'weight', type: 'price' },
      {
        text: "حداقل",
        value: "minimum"
      },
      {
        text: "حداکثر",
        value: "maximum"
      },
      {
        text: "بارکد کامل",
        value: "full_barcode"
      },
      {
        text: "بار کد",
        value: "barcode"
      },
      {
        text: "موجودی",
        value: body => {
          if (body.type == "single_sell") {
            return body.stock;
          }
          return "-";
        }
      }
    ];

    this.btn_actions = [
      {
        color: "success",
        text: "به روزسانی",
        fun: body => {
          console.log(body)
          this.showUpdateDialog(true, body);
        }
      },
      {
        color: "success",
        text: "تغییرات موجودی",
        fun: body => {
          this.history_dialog.item = body;
          this.history_dialog.show = true;
        },
        show_fun(body) {
          if (body.type != "whole_sell") {
            return true;
          }
          return false;
        }
      }
    ];
  },

  methods: {
    showUpdateDialog(
      flag,
      item = {
        price: "",
        weight: ""
      }
    ) {
      this.form = item;
      this.updateeDiaolog = flag;
    },

    submit() {
      let form = {
        id: this.form.id,
        price: this.form.price,
        weight: this.form.weight,
        stock: this.form.max
      };
      this.loading = true;
      this.$reqApi("/product-variation-combination/limited-update", form)
        .then(response => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.showUpdateDialog(false);
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.history_dialog.item = {};
      this.history_dialog.show = false;
    }
  }
};
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="550">
      <v-card style="overflow: hidden">
        <v-col cols="12">
          <v-alert prominent icon="receipt_long">
            <v-row class="pa-2 alifn-center">
              <strong class="font_20">لیست تراکنش </strong>
              <v-spacer></v-spacer>
              <v-btn @click="closeDialog" text icon>
                <v-icon size="26"> close </v-icon>
              </v-btn>
            </v-row>
          </v-alert>
        </v-col>

        <v-col cols="12" v-for="(item, index) in items" :key="index">
          <v-alert
            outlined
            dense
            color="grey darken-2"
            text
            border="left"
            class="ma-0"
          >
            <h1>{{ index + 1 }} - {{ item.text }}</h1>
            <h1 class="my-1 font_11">مبلغ تراکنش: {{ $price(item.price) }}</h1>

            <h1 class="font_11">
              شماره تراکنش :
              {{ item.transaction_number }}
            </h1>
            <h1 class="my-1 font_11" v-if="item.new_date">
              تاریخ :
              {{
                $toJalali(
                  item.new_date,
                  "YYYY-MM-DDTHH:mm:ss.SSSZ",
                  "jYYYY/jMM/jDD"
                )
              }}
            </h1>
            <h1 class="red--text my-1 font_11">
              وضعیت :
              {{
                $getItemEnum(
                  $store.state.static.status_transactions,
                  item.status
                )
              }}
            </h1>

            <amp-button
              v-if="
                $checkRole($store.state.auth.role.sales_expert) &&
                !Boolean(item.show) &&
                item.kind_set == 'demand_note' &&
                data.step == 'supervisor_to_employee_sale' &&
                data.user_refer_id != null &&
                data.status_payment == 'wait'
              "
              text="تغییر تاریخ
            چک"
              width="100px"
              height="25px"
              @click="changeTime(item)"
              color="blue"
              :loading="loading"
              :disabled="!valid || loading"
            />
            <!-- <amp-button
              v-if="
                !Boolean(item.show) &&
                item.kind_set == 'demand_note' &&
                item.status == 'wait' &&
                data.step == 'accept_employee_sale' &&
                data.status == 'wait' &&
                data.status_payment == 'wait'
              "
              text="آپلود چک"
              width="100px"
              height="25px"
              @click="uploadCheck(item)"
              color="blue"
              :loading="loading"
              :disabled="!valid || loading"
            /> -->
            <!-- <UploadReceipt
              :overlay="overlay"
              :getData="get_data"
              :getItem="get_item"
            /> -->
            <v-row
              no-gutters
              class="align-end d-flex justify-center"
              v-if="
                $checkRole($store.state.auth.role.seal_manager) &&
                item.kind_set == 'demand_note' &&
                item.status == 'wait' &&
                data.step == 'accept_employee_sale' &&
                data.status == 'wait' &&
                data.status_payment == 'wait' &&
                !Boolean(item.show_img)
              "
            >
              <v-col cols="9">
                <AmpUploadFileNew v-model="item.receipt_img" />
              </v-col>
              <v-col cols="3">
                <amp-button
                
                  text="تایید"
                  height="40"
                  color="success"
                  :disabled="!valid || loading"
                  width="70"
                  @click="uploadImg(item)"
                />
              </v-col>
            </v-row>
            <amp-button
              v-if="item.status == 'payed' && Boolean(item.receipt_img) && Boolean(item.show_img)"
              text="نمایش چک"
              height="40"
              color="blue"
              :disabled="!valid || loading"
              width="70"
              @click="showImg(item)"
            />

            <v-row no-gutters v-if="Boolean(item.show)">
              <v-col cols="8">
                <amp-jdate v-model="item.new_date"></amp-jdate>
              </v-col>
              <!-- <v-col cols="1"></v-col> -->
              <v-col cols="2">
                <amp-button
                  text="برگشت"
                  color="error"
                  :disabled="!valid || loading"
                  height="40"
                  width="70"
                  @click="back(item)"
                />
              </v-col>
              <v-col cols="2">
                <amp-button
                  text="تایید"
                  height="40"
                  color="success"
                  :disabled="!valid || loading"
                  width="70"
                  @click="changed(item)"
                />
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import AmpButton from "../../Base/AmpButton";
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: {
    AmpButton,
    UserSelectForm,
  },
  props: {
    dialog: {
      require: false,
      default: false,
    },

    data: {
      require: false,
      default: [],
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      set_item: true,
      items: [],
      show_date: null,
      overlay: false,
      get_data: null,
      get_item: null,
      change: false,
    };
  },
  mounted() {
    this.newData();
    setTimeout(() => {
      this.change = false;
    }, 500);
  },
  methods: {
    uploadCheck(item) {
      this.loading = true;
      this.overlay = true;
      item.show = true;
      this.get_data = this.data;
      this.get_item = item;
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    changeTime(item) {
      this.loading = true;
      item.show = true;
      this.loading = false;
    },
    back(item) {
      this.loading = true;
      item.show = false;
      this.loading = false;
    },
    changed(item) {
      this.loading = true;
      this.$reqApi("product-request/change-date", {
        id: this.data.id,
        payment_id: item.id,
        new_date: item.new_date,
      })
        .then((response) => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.$emit("reload");
          item.show = false;
          this.dialog = true;
          this.loading = false;
          // this.closeDialog();
        })
        .catch((error) => {
          this.loading = false;
          item.show = true;
        });
    },
    uploadImg(item) {
      this.loading = true;
      this.$reqApi("product-request/upload-receipt", {
        id: this.data.id,
        payment_id: item.id,
        receipt: item.receipt_img,
      })
        .then((response) => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.$emit("reload");
          this.dialog = true;
          this.loading = false;
          item.show_img = true
          // this.closeDialog();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    showImg(item) {
      let path = this.$getImage(item.receipt_img);
      window.open(path);
    },
    newData() {
      if (this.data.payments) {
        let items = [];
        for (let index = 0; index < this.data.payments.length; index++) {
          const element = this.data.payments[index];
          element["show"] = false;
          element["new_date"] = element.receipt_date;
          element["show_img"] = element.receipt_img ? true : false;
          element["get_reciept"] = "";
          items.push(element);
        }
        this.items = items;

        this.set_item = false;
      }
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 16px;
}
</style>

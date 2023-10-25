<template>
  <div>
    <BaseTable
      ref="baseTable"
      url="/category"
      :headers="headers"
      v-model="selected_item"
      :extraBtn="extraBtn"
      :BTNactions="btn_actions"
      autoDelete="/category/delete"
      autoUpdate="/product/category"
      createUrl="/product/category/insert"
    >
    </BaseTable>

    <v-dialog persistent v-model="removeDialog" width="400">
      <v-card class="pa-4" v-if="removeDialog">
        <v-card-text>
          <div class="font_18 error--text">
            آیا از حذف {{ selected_item.length }} مورد اطمینان دارید ؟
          </div>
          <div class="center-div py-2" v-if="time != 0">
            فعال سازی بعد از {{ time }} ثانیه
          </div>
        </v-card-text>
        <v-card-actions class="d-block">
          <amp-button
            block
            class="mb-2"
            color="error"
            :loading="loading"
            text="بله، حذف شود"
            @click="removeRecords()"
            :disabled="time != 0 || loading"
          />
          <amp-button
            block
            class="ma-0"
            text="بستن"
            @click="closeDeleteAllDialog()"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "دسته بندی محصولات",
    selected_item: [],
    removeDialog: false,
    loading: false,
    time: 3,
    timeInterval: null,
    extraBtn: []
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        text: "",
        width: "30px",
        type: "checkbox",
        disableSort: true,
        filterable: false
      },
      {
        text: "تاریخ ایجاد",
        filterType: "date",
        filterCol: "created_at",
        parentClass: "ltr-item text-center",
        value: body => this.$toJalali(body.created_at)
      },
      {
        text: "نام دسته بندی",
        value: "name",
        disableSort: "true",
        filterable: false
      },
      {
        text: "سطح",
        value: "level"
      },
      {
        text: "بارکد",
        value: "barcode"
      },
      // {
      //   text: "والد",
      //   value: "sort",
      //   disableSort: "true",
      //   filterable: false,
      //   value: body => {
      //     if (body.parent_cateogry) {
      //       return body.parent_cateogry.title;
      //     }
      //     return "-";
      //   }
      // },
      {
        text: "تعداد محصولات",
        value: "products_count",
        disableSort: "true",
        filterable: false
      },
      {
        text: "ترتیب نمایش",
        value: "sort",
        disableSort: "true",
        filterable: false
      }
    ];

    this.btn_actions = [
      {
        color: "primary",
        text: "مشاهده محصولات",
        fun: body => {
          this.$router.push(
            "/product/category/products/" + body.id + "?name=" + body.name
          );
        }
      },
      {
        color: "success",
        text: "ویژگی ها",
        fun: body => {
          this.$router.push("/product/category/variation/" + body.id);
        }
      }
    ];

    this.extraBtn = [
      {
        id: 1,
        text: "حذف موارد",
        color: "error",
        icon: "delete",
        fun: body => {
          if (this.selected_item.length == 0) {
            this.$toast.error("موردی انتخاب نشده");
            return;
          }

          this.time = 3;
          this.removeDialog = true;
          this.timeInterval = setInterval(() => {
            if (this.time > 0) {
              this.time -= 1;
            } else {
              clearInterval(this.timeInterval);
            }
          }, 1000);
        }
      }
    ];
  },

  methods: {
    removeRecords() {
      this.loading = true;
      for (let i = 0; i < this.selected_item.length; i++) {
        this.$reqApi("/category/delete", { id: this.selected_item[i] })
          .then(async response => {
            if (i == this.selected_item.length - 1) {
              this.loading = false;
              this.$refs.baseTable.getDataFromApi();
              this.selected_item = [];
              this.closeDeleteAllDialog();
              this.$toast.success("حذف موارد انجام شد");
            }
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    closeDeleteAllDialog() {
      this.removeDialog = false;
    }
  }
};
</script>

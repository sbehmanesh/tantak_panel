<template>
  <div>
    <BaseTable
      excel
      url="/product"
      v-model="selected_item"
      :extraBtn="extraBtn"
      :headers="headers"
      :BTNactions="btn_actions"
      autoDelete="/product/delete"
      autoUpdate="/product"
      ref="baseTable"
      createUrl="/product/insert"
    >
    </BaseTable>

    <v-dialog persistent v-model="removeDialog" width="400">
      <v-card class="pa-4" v-if="removeDialog">
        <v-card-text>
          <div class="font_18 error--text">آیا از حذف {{ selected_item.length }} مورد اطمینان دارید ؟</div>
          <div class="center-div py-2" v-if="time != 0">فعال سازی بعد از {{ time }} ثانیه</div>
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
          <amp-button block class="ma-0" text="بستن" @click="closeDeleteAllDialog()" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable'
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    selected_item: [],
    removeDialog: false,
    loading: false,
    time: 3,
    timeInterval: null,
    extraBtn: [],
    title: 'فهرست محصولات',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [
      {
        text: '',
        width: '30px',
        type: 'checkbox',
        disableSort: true,
        filterable: false,
      },
      { title: ' ', value: 'main_image', type: 'image', disableSort: 'true', filterable: false, size: 'small' },
      { text: 'نام محصول', value: 'name' },
      { text: 'ترتیب نمایش', value: 'sort', disableSort: 'true', filterable: false },
      // {
      //   text: 'فروش تکی',
      //   value: 'has_single_sell',
      //   filterType: 'select',
      //   items: this.$store.state.static.bool_num_enum,
      // },
      // {
      //   text: 'فروش فله/عمده',
      //   value: 'has_whole_sell',
      //   filterType: 'select',
      //   items: this.$store.state.static.bool_num_enum,
      // },
      // {
      //   text: 'دمنوش ساز',
      //   value: 'mixturable',
      //   filterType: 'select',
      //   items: this.$store.state.static.bool_num_enum,
      // },
      { text:'بارکد', value:'barcode'},
      { text:'قیمت پایه' , value:'base_price'},
      { text:'قیمت پایه فروش عمده',value:'base_wholesale_price'},
      { text: 'بازدید', value: 'view', disableSort: 'true', filterable: false },
      { text: 'لایک', value: 'like', disableSort: 'true', filterable: false },
      { text: 'ستاره', value: 'star', disableSort: 'true', filterable: false },

      {
        text: 'وضعیت',
        value: 'publish_status',
        filterType: 'select',
        items: this.$store.state.static.product_status,
      },
    ]

    this.extraBtn = [
      {
        id: 1,
        text: 'حذف موارد',
        color: 'error',
        icon: 'delete',
        fun: (body) => {
          if (this.selected_item.length == 0) {
            this.$toast.error('موردی انتخاب نشده')
            return
          }

          this.time = 3
          this.removeDialog = true
          this.timeInterval = setInterval(() => {
            if (this.time > 0) {
              this.time -= 1
            } else {
              clearInterval(this.timeInterval)
            }
          }, 1000)
        },
      },
    ]
  },

  methods: {
    removeRecords() {
      this.loading = true
      for (let i = 0; i < this.selected_item.length; i++) {
        this.$reqApi('/product/delete', { id: this.selected_item[i] })
          .then(async (response) => {
            if (i == this.selected_item.length - 1) {
              this.loading = false
              this.$refs.baseTable.getDataFromApi()
              this.selected_item = []
              this.closeDeleteAllDialog()
              this.$toast.success('حذف موارد انجام شد')
            }
          })
          .catch((error) => {
            this.loading = false
          })
      }
    },
    closeDeleteAllDialog() {
      this.removeDialog = false
    },
  },
}
</script>

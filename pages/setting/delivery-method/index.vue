<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      autoUpdate="/setting/delivery-method"
      createUrl="/setting/delivery-method/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable'
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: 'delivery_method' },
    title: 'روش  های ارسال',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [
      {
        text: 'نام روش ارسال',
        value: (body) => {
          let val = JSON.parse(body.value)
          return val.title
        },
        disableSort: 'true',
        filterable: false,
      },
      {
        text: 'قیمت پایه',
        value: (body) => {
          let val = JSON.parse(body.value)
          return val.base
        },
        disableSort: 'true',
        type: 'price',
        filterable: false,
      },
      {
        text: 'هزینه اضافه هر کیلو',
        value: (body) => {
          let val = JSON.parse(body.value)
          return val.ratio
        },
        disableSort: 'true',
        type: 'price',
        filterable: false,
      },
      {
        text: 'پرداخت در محل',
        filterType: 'select',
        value: (body) => {
          let val = JSON.parse(body.value)
          if (val.pay_at_delivery == '1') {
            return 'بله'
          } else {
            return 'خیر'
          }
        },
        items: this.$store.state.static.bool_number_enum,
      },
      {
        text: 'حداقل سفارش برای ارسال رایگان',
        filterType: 'select',
        value: (body) => {
          let val = JSON.parse(body.value)
          return val.send_free_threshold
        },
        disableSort: 'true',
        type: 'price',
        filterable: false,
      },
    ]
  },
}
</script>

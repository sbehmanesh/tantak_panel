<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/delete-basket"
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
    filters: { key: 'day_delete_basket' },
    title: 'بازه زمانی حذف سبد خرید',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [

      {
        disableSort: 'true',
        filterable: false,
        text:"حذف سبد خرید بعد از " , value:(body)=>{
          return body.value +  " روز  "
        }
      },   

    ]
  },
}
</script>

<template>
  <div>
    <BaseTable
      url="/product"
      :headers="headers"
      autoDelete="/product/delete"
      createUrl="/product/insert"
      :rootBody="{ with_category: true }"
      :BTNactions="btn_actions"
      :filters="{ categories_id: [this.categories_id] }"
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
    title: 'محصولات',
    categories_id: '',
    btn_actions: [],
  }),
  beforeMount() {
    this.categories_id = this.$route.params.id
    let name = this.$route.query.name
    if (name) {
      this.title = 'محصولات ' + name
    }
    this.headers = [
      { title: ' ', value: 'main_image', type: 'image', disableSort: 'true', filterable: false },
      { text: 'نام محصول', value: 'name' },
      { text:'واحد فروش عمده',value:"wholesale_unit"},
      { text: 'ترتیب نمایش', value: 'sort', disableSort: 'true', filterable: false },
      // {
      //   text: 'فروش تکی',
      //   value: 'has_single_sell',
      //   filterType: 'select',
      //   items: this.$store.state.static.bool_num_enum,
      // },
      {
        text:'قیمت پایه',
        value:'base_price'
      },
      {
        text:'قیمت پایه عمده فروشی',
        value:'base_wholesale_price'
      },
      // {
      //   text: 'فروش فله/عمده',
      //   value: 'has_whole_sell',
      //   filterType: 'select',
      //   items: this.$store.state.static.bool_num_enum,
      // },
      {
        text: 'بارکد',
        value: 'barcode',
      },
      {
        text:'ستاره',
        value:'star'
      },
      {
        text:'تعداد بازدید',
        value:'view'
      },
      {
        text:'لایک',
        value:'like'
      },
      {
        text: 'وضعیت',
        value: 'publish_status',
        filterType: 'select',
        items: this.$store.state.static.product_status,
      },
    ]

    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>

<template>
  <div>
    <BaseTable
      url="/setting"
      :headers="headers"
      :filters='filters'
      autoDelete="/setting/delete"
      autoUpdate="/setting/slider"
      createUrl="/setting/slider/insert"
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
    filters: { key: 'main_slider' },
    title: 'اسلایدر اصلی',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)
    this.headers = [
      {
        title: ' ',
        type: 'image',
        disableSort: 'true',
        filterable: false,
        sizs: 'small',
        value: (body) => {
           let val = JSON.parse(body.value)
           return val.image
        },
      },
    ]
  },
}
</script>

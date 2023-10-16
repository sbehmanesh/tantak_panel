<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      autoUpdate="/setting/variation-type"
      createUrl="/setting/variation-type/insert"
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
    filters: { key: 'variation_type' },
    title: 'ویژگی های محصولات',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [
    { text: 'ویژگی', value: 'value' },

    ]
  },
}
</script>

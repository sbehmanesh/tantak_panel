<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      autoUpdate="/setting/units"
      createUrl="/setting/units/insert"
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
    filters: { key: 'units' },
    title: 'واحد ها',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [
    { text: 'واحد', value: 'value' },

    ]
  },
}
</script>

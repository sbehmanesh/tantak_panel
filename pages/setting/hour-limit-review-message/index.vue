<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/hour-limit-review-message"
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
    filters: { key: 'hour_limit_review_message' },
    title: ' تعداد ساعات مهلت برسی پیام',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)

    this.headers = [

      {
        disableSort: 'true',
        filterable: false,
        text:"تعداد ساعات مهلت برسی پیام " , value:(body)=>{
          return body.value +  " ساعت "
        }
      },   
      {
        text: "وضعیت فعال بودن",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.value_2 != 'off') {
            return true;
          } else {
            return false;
          }
        },
      },

    ] 
  },
}
</script>

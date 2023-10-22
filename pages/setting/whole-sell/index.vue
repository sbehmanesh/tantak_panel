<template>
  <div>
    <div class="text-center">
      <h2>
        در این بخش می توانید نقش هایی که قادر به مشاهده قسمت فروش عمده هستند را مشخص نمایید.
        <br />
        در صورتی که لازم است فروش عمده برای کلیه کاربران نمایش داده شود این بخش را خالی بگذارید
      </h2>
    </div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      createUrl="/setting/whole-sell/insert"
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
    filters: { key: 'wholesell_role' },
    title: 'کاربران دارای دسترسی به فروش عمده',
  }),

  computed: {
    roles() {
      return this.$store.state.setting.roles
    },
  },

  beforeMount() {
    this.$store.dispatch('setting/getRoleServer')
  },

  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
    this.headers = [
      {
        text: 'نام نقش',
        value: (body) => {
          if (body.value) {
            let roles = this.$store.state.setting.roles
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].value == body.value) {
                return roles[i].text
              }
            }
            return body.value
          }
        },
        disableSort: 'true',
        filterable: false,
      },
    ]
  },
}
</script>

<template>
  <div>
    <template v-if="roles.length > 0">
      <div class="text-center">
        <v-chip
          dark
          :key="index"
          class="ma-2"
          color="orange"
          @click="selectRole(item.value)"
          v-for="(item, index) in role_list"
          :outlined="roles_id != item.value"
        >
          {{ item.text }}
        </v-chip>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: { require: false },
  },
  data: () => ({
    roles: [],
    roles_id: '',
    categories: [],
    category_id: '',
  }),
  computed: {
    role_list() {
      return this.roles.filter((x) => !Boolean(this.category_id) || x.category_id == this.category_id)
    },
  },
  watch: {
    '$store.state.setting.roles'() {
      this.loadData()
    },
  },
  beforeMount() {
    this.$store.dispatch('setting/getRoleServer')
    this.loadData()
    this.roles_id = this.value
  },
  methods: {
    loadData() {
      let roles = []
      let categories = {}
      for (let index = 0; index < this.$store.state.setting.roles.length; index++) {
        const element = this.$store.state.setting.roles[index]
        roles.push({ ...element })
      }
      this.roles = roles
      this.categories = [{ value: '', text: 'همه' }, ...Object.values(categories)]
    },
    selectCategory(value) {
      this.category_id = value
      let category = this.categories.find((x) => x.value == value)
      if (category && category.roles && category.roles.length > 0) {
        this.selectRole(category.roles[0])
      }
    },
    selectRole(value) {
      this.roles_id = value
      this.$emit('selectRole', value)
    },
  },
}
</script>

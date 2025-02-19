<template>
  <v-dialog v-model="value" width="95%">
    <v-card class="pa-1">
      <v-card-title>
        <span style="font-size: 19px"> انتخاب کاربر </span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog()"> close </v-icon>
      </v-card-title>
      <div>
        <div class="text-center">
          <v-chip
            dark
            :key="index"
            class="ma-2"
            color="primary"
            v-for="(item, index) in categories"
            @click="selectCategory(item.value)"
            :outlined="category_id != item.value"
          >
            {{ item.text }}
          </v-chip>
        </div>
        <div class="text-center">
          <v-chip
            dark
            :key="index"
            class="ma-2"
            color="green"
            @click="selectRole(item.value)"
            v-for="(item, index) in role_list"
            :outlined="root_body.role_id != item.value"
          >
            {{ item.text }}
          </v-chip>
        </div>
        <BaseTable
          :filters="filters"
          :headers="headers"
          :url="users_url"
          v-model="selected"
          :rootBody="root_body"
          :extraBtn="extra_btn"
          @getData="getDataTable"
        />
      </div>
      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center py-3">
          <amp-button large icon="redo" class="my-1" color="error" text="انصراف" @click="closeDialog()" />
          <amp-button large icon="done" class="my-1 mr-3" color="success" :loading="loading" :disabled="loading" text="ثبت" @click="submit()" />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable.vue'

export default {
  components: { BaseTable },
  props: {
    items: {
      type: Array,
      require: false,
    },
    value: {
      type: Boolean,
      require: true,
    },
  },
  data: () => ({
    loading: false,
    users_url: '/user/searchByRole',
    update_url: '/role/update-voip-group',
    insert_url: '/role/insert-voip-group',
    headers: [],
    filters: {},
    selected: [],
    roles: [],
    categories: [],
    category_id: '',
    root_body: { role_id: [] },
    extra_btn: [],
    total_items: [],
    all_selected: false,
  }),
  watch: {
    items() {
      setTimeout(() => {
        this.selected = this.items
      }, 1000)
    },
    '$store.state.setting.roles'() {
      this.loadCategories()
    },
  },
  computed: {
    role_list() {
      return this.roles.filter((x) => !Boolean(this.category_id) || x.category_id == this.category_id)
    },
  },
  beforeMount() {
    this.loadCategories()

    this.headers = [
      {
        text: '',
        width: '30px',
        type: 'checkbox',
        disableSort: true,
        filterable: false,
      },
      { text: 'تصویر', value: 'avatar', type: 'image', disableSort: 'true', filterable: false },
      { text: 'نام', value: 'first_name' },
      { text: 'نام خانوادگی', value: 'last_name' },
      { text: 'نام کاربری', filterCol: 'username', value: 'username', type: 'phone' },
      { text: 'کدملی', value: 'national_code' },
      {
        text: 'داخلی',
        filterCol: 'issabel_server_rang',
        value: (body) => {
          if (body.user_profile && body.user_profile.issabel_server_rang) {
            return body.user_profile.issabel_server_rang.toString()
          } else {
            return '-'
          }
        },
      },
      { text: 'وضعیت', value: 'status', filterType: 'select', items: this.$store.state.static.status },
    ]

    this.extra_btn = [
      {
        text: 'انتخاب همه',
        color: 'info',
        icon: 'check',
        fun: () => {
          this.selectAll()
        },
      },
    ]
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false)
    },
    loadCategories() {
      let roles = []
      let categories = {
        all: {
          roles: [],
          value: 'all',
          text: 'همه',
        },
      }
      for (let index = 0; index < this.$store.state.setting.roles.length; index++) {
        const element = this.$store.state.setting.roles[index]
        roles.push({ ...element })
        if (Boolean(element.category_id)) {
          if (!categories[element.category_id]) {
            categories[element.category_id] = {
              roles: [],
              value: element.category_id,
              text: element.category_name,
            }
          }
          categories[element.category_id].roles.push(element.id)
        }
      }
      this.roles = roles
      this.categories = Object.values(categories)
      if (this.categories.length > 0) {
        this.selectCategory(this.categories[0].value)
      }
    },
    selectCategory(value) {
      this.category_id = value
      let category = this.categories.find((x) => x.value == value)
      if (category && category.roles && category.roles.length > 0) {
        this.selectRole(category.roles[0])
      } else {
        this.selectRoleAll()
      }
    },
    selectRole(value) {
      this.root_body.role_id = [value]
    },
    selectRoleAll() {
      this.root_body.not_in = true
      this.root_body.role_id = [this.$store.state.auth.role.user_id, this.$store.state.auth.role.insurer_id, this.$store.state.auth.role.insured_id]
    },
    submit() {
      this.$emit('selectUser', this.selected)
    },
    selectAll() {
      this.total_items.forEach((item) => {
        if (!this.selected.includes(item)) {
          this.selected.push(item)
        }
      })
    },
    getDataTable(data) {
      if (data.model.data) {
        this.total_items = []
        data.model.data.forEach((element) => {
          this.total_items.push(element.id)
        })
      }
    },
    selectCategoryAll() {},
  },
}
</script>

<style scoped>
.hod-list {
  max-height: 450px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>

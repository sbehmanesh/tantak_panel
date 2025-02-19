<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading" class="rounded-0 pa-2 d-flex flex-column">
    <v-row class="ma-2">
      <v-row no-gutters>
        <v-col cols="12" md="2">
          <amp-input text="نام گروه" rules="require" v-model="form.name" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="سرور Voip"
            :placeholder="issabel_items == null ? 'در حال بارگذاری ...' : 'انتخاب کنید'"
            v-model="form.issabel_server_id"
            :items="issabel_items"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="5">
          <UserSelectInlineForm
            tableKey="responsible"
            rules="require"
            v-model="form.with_access_user_id_list"
            :not-in="true"
            text="لیست کاربران دارای دسترسی"
            :category-id="$store.state.auth.role.c_customer_category"
            multi
          />
        </v-col>
        <v-col cols="12" md="12">
          <BaseTable
            :headers="headers"
            :extraBtn="extra_btn"
            localData
            :dataArray="group_users"
            no_refresh
            compressor
            :BTNactions="btn_action"
            v-model="remove_list"
          />

          <!-- <UserSelectInlineForm
            tableKey="responsible"
            rules="require"
            v-model="form.user_id_list"
            :not-in="true"
            text="لیست اعضای گروه"
            :category-id="$store.state.auth.role.c_customer_category"
            multi
          /> -->
        </v-col>
      </v-row>
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button text="انصراف" icon="redo" @click="back" color="error" class="ma-1"></amp-button>
      <amp-button
        :text="modelId ? 'ویرایش' : 'افزودن'"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loading"
        :loading="loading"
      ></amp-button>
    </v-row>
    <VoipGroupUserDialog :value="user_dialog.show" :items="user_dialog.items" @selectUser="addUser" @closeDialog="closeUserDialog" />
  </v-form>
</template>

<script>
import UserSelectInlineForm from '~/components/User/UserSelectInlineForm.vue'
import VoipGroupUserDialog from '~/components/Call/VoipGroupUserDialog.vue'
import BaseTable from '~/components/DataTable/BaseTable.vue'

export default {
  components: { UserSelectInlineForm, BaseTable, VoipGroupUserDialog },
  props: {
    modelId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      show_url: '/role/show-voip-group',
      update_url: '/role/update-voip-group',
      insert_url: '/role/insert-voip-group',
      form: {
        name: '',
        issabel_server: '',
        user_id_list: [],
        with_access_user_id_list: [],
      },
      group_users: [],
      headers: [],
      extra_btn: [],
      btn_action: [],
      user_dialog: { show: false, item: null },
      issabel_items: null,
      remove_list: [],
    }
  },
  watch: {
    '$store.state.setting.issabel_item': {
      deep: true,
      handler() {
        this.setIssabelItems()
      },
    },
  },
  mounted() {
    if (this.modelId) {
      this.loadData()
    }
    this.setIssabelItems()
  },
  beforeMount() {
    this.headers = [
      {
        text: '',
        width: '30px',
        type: 'checkbox',
        disableSort: true,
        filterable: false,
      },
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
        icon: 'add',
        color: 'primary',
        text: `${this.modelId ? 'ویرایش اعضا' : 'افزودن اعضا'}`,
        fun: () => {
          this.user_dialog.show = true
          this.user_dialog.items = this.form.user_id_list
        },
      },
      {
        icon: 'remove',
        color: 'error',
        text: 'حذف',
        disabled: true,
        fun: () => {
          if (this.remove_list.length > 0) {
            this.removeUser()
          } else {
            this.$toast.error('موردی انتخاب نشده است')
          }
        },
      },
    ]
  },
  methods: {
    loadData() {
      this.loading = true
      this.$reqApi(this.show_url, { id: this.modelId })
        .then((response) => {
          this.form['id'] = this.modelId
          this.form.name = response.model.name
          let users = []
          if (Array.isArray(response.model.users_with_profile)) {
            response.model.users_with_profile.forEach((user) => {
              users.push(user.id)
            })
            this.form.user_id_list = users
            this.group_users = response.model.users_with_profile
          }

          let access_users = []
          if (Array.isArray(response.model.with_access_users)) {
            response.model.with_access_users.forEach((user) => {
              access_users.push(user.id)
            })
          }
          this.form.with_access_user_id_list = access_users
          if (response.model.issabel_server_id) {
            this.form.issabel_server_id = response.model.issabel_server_id
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    submit(dialog) {
      this.loading = true
      const url = this.modelId ? this.update_url : this.insert_url
      this.$reqApi(url, this.form)
        .then(() => {
          this.$toast.success(this.modelId ? 'گروه ویرایش شد' : 'گروه ایجاد شد')
          if (!dialog) {
            this.back()
          } else {
            if (this.modelId) {
              this.loadData()
            } else {
              this.back()
            }
          }
          this.remove_list = []
        })
        .catch(() => {
          this.loading = false
        })
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push('/roles/voip-groups')
      }
    },
    closeUserDialog() {
      this.user_dialog = {
        show: false,
        item: null,
      }
    },
    addUser(idList) {
      this.user_dialog.show = false
      this.form.user_id_list = idList
      this.submit(true)
    },
    removeUser() {
      this.form.user_id_list = this.form.user_id_list.filter((item) => !this.remove_list.includes(item))
      this.submit(true)
    },
    setIssabelItems() {
      const issable_items = this.$store.state.setting.issabel_item
      let converted = []
      if (issable_items && Array.isArray(issable_items) && issable_items.length > 0) {
        for (let i = 0; i < issable_items.length; i++) {
          const element = issable_items[i]
          converted.push({ text: element.text, value: element.value[0] })
        }
        this.issabel_items = converted
      } else {
        this.$toast.error('ندارید voip شما دسترسی به سرور های')
        this.$router.back()
      }
    },
  },
}
</script>

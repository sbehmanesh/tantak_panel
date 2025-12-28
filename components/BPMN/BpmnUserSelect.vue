<template>
  <div>
    <amp-input
      readonly
      :text="text"
      :rules="rules"
      :c-class="readonly ? '' : 'pointer'"
      :append-icon="appendIcon"
      :active-input-click="!readonly"
      v-model="inputValue"
      @click:append="handleOpenDialog"
    />
    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog"
    >
      <v-toolbar dark color="secondary">
        <v-btn icon dark @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ text }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card class="pa-7">
        <UserSelect
          :multi="false"
          :show-url="normalizedUrl"
          v-model="selectionItems"
          :rootBody="rootBody"
          @closeDialog="closeDialog"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserSelect from '~/components/User/UserSelect'

export default {
  name: 'BpmnUserSelect',
  components: { UserSelect },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    rules: {
      type: [String, Array, Function],
      default: '',
    },
    text: {
      type: String,
      default: 'انتخاب کاربر',
    },
    url: {
      type: String,
      default: 'user',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    roleId: {
      type: Array,
      default: () => [],
    },
    notIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      selectionItems: [],
      inputValue: '',
      fetching: false,
      lastRequestedId: null,
    }
  },
  computed: {
    normalizedUrl() {
      if (!this.url) {
        return '/user'
      }
      return this.url.startsWith('/') ? this.url : `/${this.url}`
    },
    appendIcon() {
      if (this.readonly) {
        return ''
      }
      return this.fetching ? 'autorenew' : 'edit'
    },
    rootBody() {
      if (Array.isArray(this.roleId) && this.roleId.length > 0) {
        const payload = { role_id: this.roleId }
        if (this.notIn) {
          payload.not_in = true
        }
        return payload
      }
      return null
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newId) {
        if (this.isEmptyValue(newId)) {
          this.selectionItems = []
          return
        }
        if (
          Array.isArray(this.selectionItems) &&
          this.selectionItems.length > 0 &&
          this.isSameValue(this.selectionItems[0].id, newId)
        ) {
          return
        }
        this.fetchUser(newId)
      },
    },
    selectionItems: {
      deep: true,
      handler(items) {
        const user = Array.isArray(items) && items.length > 0 ? items[0] : null
        const selectedId = user ? user.id : null
        this.inputValue = this.formatDisplay(user)
        if (!this.isSameValue(selectedId, this.value)) {
          this.$emit('input', selectedId)
        }
      },
    },
  },
  methods: {
    handleOpenDialog() {
      if (this.readonly) {
        return
      }
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    isEmptyValue(value) {
      return value === undefined || value === null || value === ''
    },
    isSameValue(first, second) {
      const firstEmpty = this.isEmptyValue(first)
      const secondEmpty = this.isEmptyValue(second)
      if (firstEmpty && secondEmpty) {
        return true
      }
      if (firstEmpty || secondEmpty) {
        return false
      }
      return String(first) === String(second)
    },
    formatDisplay(user) {
      if (!user) {
        return ''
      }
      const parts = []
      const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(' ')
        .trim()
      if (fullName) {
        parts.push(fullName)
      }
      if (user.phone) {
        parts.push(user.phone)
      }
      if (user.national_code) {
        parts.push(user.national_code)
      }
      return parts.join(' | ')
    },
    async fetchUser(userId) {
      this.fetching = true
      const requestKey = String(userId)
      this.lastRequestedId = requestKey
      try {
        const response = await this.$reqApi(this.normalizedUrl, {
          row_number: 1,
          filters: {
            id: {
              op: '=',
              value: userId,
            },
          },
        })
        if (this.lastRequestedId !== requestKey) {
          return
        }
        const user = Array.isArray(response?.model?.data)
          ? response.model.data[0]
          : null
        this.selectionItems = user ? [user] : []
      } catch (error) {
        this.selectionItems = []
      } finally {
        this.fetching = false
      }
    },
  },
}
</script>

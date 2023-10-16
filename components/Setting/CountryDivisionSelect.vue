<template>
  <div>
    <v-card class="pa-6 mx-6" v-if="multi">
      <div>
        <v-chip
          close
          label
          outlined
          class="ma-2"
          color="orange"
          v-for="(item, index) in items"
          :key="index"
          @click:close="removeItem(item)"
        >
          {{ item[itemText] }}
        </v-chip>
      </div>
      <div>
        <amp-button text="ثبت" @click="sendData()" />
      </div>
    </v-card>
    <BaseTable
      row-pointer
      :headers="headers"
      :filters="filters"
      :row-click="rowClick"
      url="/country_division"
    />
  </div>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable'
export default {
  components: { BaseTable },
  props: {
    value: { require: false },
    multi: { type: Boolean, default: false },
    itemText: { require: false, default: 'name' },
    filters: { type: Object, default: () => ({}) },
  },
  data: () => ({
    items: [],
    headers: [],
  }),
  watch: {
    value() {
      this.items = [...this.value]
    },
  },
  mounted() {
    this.items = [...this.value]
    this.headers = [
      { text: 'نام', value: 'name' },
      { text: 'استان', value: 'cd2_name' },
    ]
  },
  methods: {
    sendData() {
      this.$emit('input', this.items)
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog', true)
    },
    removeItem(item) {
      this.items = [...this.items].filter((x) => x.id != item.id)
    },
    selectItem(body) {
      if (this.multi) {
        let items = [...this.items].filter((x) => x.id != body.id)
        items.push(body)
        this.items = items
      } else {
        this.items = [body]
        this.sendData()
      }
    },
    rowClick(row) {
      this.selectItem(row)
    },
  },
}
</script>

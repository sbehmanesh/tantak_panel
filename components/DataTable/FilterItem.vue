<template>
  <thead class="">
    <tr class="base_table-header" v-if="headers" test-tag="header">
      <th v-if="!no_refresh " class="text-center" width="50px">
        <v-btn dark small @click="removeFilter()" elevation="0" color="bg_filter">
          <v-icon dark> refresh </v-icon>
        </v-btn>
      </th>
      <th v-else class="text-center" width="50px">
      </th>

      <th
        scope="col"
        :class="header.width ? '' : 'table_input'"
        v-for="(header, header_item) in tableHeader"
        :key="header_item"
        :width="header.width ? header.width : '200px'"
      >
        <v-form @submit.prevent="getData()" class="pointer d-flex justify-center" :class="[header.center ? 'center-div' : 'center-div-align']">
          <span v-if="header.filterable == false && header.disableSort" class="font_l font_bold white--text">
            <!-- lightcolor--text -->
            {{ header.text }}
          </span>
          <span v-else>
            <span v-if="header != {}">
              <v-row v-if="header.filterType == 'integer'">
                <v-col cols="12" class="mb-n6">
                  <v-text-field
                    dark
                    :placeholder="header.text"
                    class="filter-item small-input-icon"
                    v-model="filter_items[header.filterCol]"
                    :prepend-icon="header.sortIcon"
                    @click:prepend="changeSort(header.filterCol, header.filterType, header.disableSort)"
                    dense
                    outlined
                    type="text"
                  >
                    <template v-slot:append-outer>
                      <v-menu v-model="opMenu[header.filterCol]" offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn small icon v-bind="attrs" v-on="on">
                            <v-icon> search </v-icon>
                          </v-btn>
                        </template>
                        <v-card :width="$vuetify.breakpoint.xl ? '300px' : '190px'">
                          <v-list dense>
                            <v-list-item-group>
                              <v-list-item v-for="im in integer_menu" :key="im.text" @click="operatorsCall(header, im.fun)">
                                <v-list-item-icon class="filter-form">
                                  <v-icon> {{ im.icon }} </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  {{ im.text }}
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="header.filterType == 'string'">
                <v-col cols="12" class="mt-1 mb-n6">
                  <v-text-field
                    dark
                    :placeholder="header.text"
                    class="filter-item small-input-icon"
                    v-model="filter_items[header.filterCol]"
                    :prepend-icon="header.sortIcon"
                    @click:prepend="changeSort(header.filterCol, header.filterType, header.disableSort)"
                    dense
                    outlined
                    type="text"
                  >
                    <template v-slot:append-outer>
                      <v-menu v-model="opMenu[header.filterCol]" offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn small icon v-bind="attrs" v-on="on">
                            <v-icon> search </v-icon>
                          </v-btn>
                        </template>
                        <v-card :width="$vuetify.breakpoint.xl ? '300px' : '190px'">
                          <v-list dense>
                            <v-list-item-group class="filter-form">
                              <v-list-item v-for="sm in string_menu" :key="sm.text" @click="operatorsCall(header, sm.fun)">
                                <v-list-item-icon c>
                                  <v-icon> {{ sm.icon }} </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  {{ sm.text }}
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-layout no-gutters v-if="header.filterType == 'date'">
                <v-flex lg10 md10 sm10 xs10>
                  <span v-if="between[header.filterCol] == true">
                    <amp-jdate
                      :clear="false"
                      backcolor="#0000"
                      cClass="filter-item"
                      class="pb-1"
                      v-model="first_b[header.filterCol]"
                      innerIcon="edit_calendar"
                      placeholder="شروع"
                    />
                    <amp-jdate
                      :clear="false"
                      backcolor="#0000"
                      cClass="filter-item"
                      class="pb-1 small-input-icon"
                      v-model="second_b[header.filterCol]"
                      innerIcon="edit_calendar"
                      placeholder="پایان"
                    />
                  </span>
                  <span v-else class="pb-2">
                    <!-- :innerIcon="header.icon" -->
                    <amp-jdate
                      :clear="false"
                      cClass="filter-item"
                      :placeholder="header.text"
                      v-model="filter_items[header.filterCol]"
                      backcolor="#0000"
                      :prependIcon="header.sortIcon"
                      @click:prepend="changeSort(header.filterCol, header.filterType, header.disableSort)"
                    />
                  </span>
                </v-flex>
                <v-flex lg2 md2 sm2 xs2>
                  <v-menu v-model="opMenu[header.filterCol]" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-icon dark icon v-on="on" class="mt-3"> search </v-icon>
                    </template>
                    <v-card :width="$vuetify.breakpoint.xl ? '300px' : '200px'">
                      <v-list dense>
                        <v-list-item-group>
                          <v-list-item v-for="dm in date_menu" :key="dm.text" @click="operatorsCall(header, dm.fun)">
                            <v-list-item-icon>
                              <v-icon> {{ dm.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              {{ dm.text }}
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="operatorsCall(header, 'between')">
                            <v-list-item-icon>
                              <v-icon class="ml-n1">search</v-icon>
                              <v-icon>radio_button_checked</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content> بین </v-list-item-content>
                          </v-list-item>
                          <v-list-item @click="operatorsCall(header, 'ignore')">
                            <v-list-item-icon>
                              <v-icon>close</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content> حذف فیلتر </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card>
                  </v-menu>
                </v-flex>
              </v-layout>
            </span>
            <v-row v-if="header.filterType == 'select'">
              <v-col cols="12" md="11" class="mb-n6 select">
                <v-select
                  dark
                  dense
                  outlined
                  :clearable="true"
                  @click:clear="removeSelectFilter(header.filterCol)"
                  :placeholder="header.text"
                  :items="header.items"
                  class="filter-item small-input-icon"
                  v-model="filter_items[header.filterCol]"
                  :appendOuter="header.sortIcon"
                  @click:append-outer="changeSort(header.filterCol, header.filterType, header.disableSort)"
                />
              </v-col>
            </v-row>
          </span>
          <amp-button text="فیلتر" type="submit" class="d-none" />
        </v-form>
      </th>

      <th class="text-center" v-if="moreTD"></th>

      <th class="center-div pl-2" v-if="filter_show">
        <v-btn elevation="0" v-if="!no_filter" title="فیلتر" color="bg_filter" small @click="getData()">
          <v-icon dark> filter_alt </v-icon>
        </v-btn>
        <v-btn elevation="0" small title="جدید" color="light_purple" v-if="createUrl" @click="$router.push(createUrl)">
          <v-icon size="30" dark> add </v-icon>
        </v-btn>
        <v-btn elevation="0" small title="جدید" color="light_purple" v-if="createShowFun" @click="createFun">
          <v-icon size="30" dark> add </v-icon>
        </v-btn>

        <v-flex v-if="actions.length > 0">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon dark>more_vert</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(action, index) in actions" :key="index" @click="action.fun()">
                <v-list-item-title>
                  {{ action.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-flex>
      </th>
    </tr>
  </thead>
</template>

<script>
import { actions } from '~/store/auth'
const Jmoment = require('jalali-moment')
export default {
  props: {
    no_refresh: {
      type: Boolean,
    },
    no_filter: {
      type: Boolean,
    },
    no_filter_actions: {
      type: Boolean,
    },
    createUrl: {
      type: String,
    },
    excel: {
      type: Boolean,
      require: false,
    },
    pdf: {
      type: Boolean,
      require: false,
    },
    storeState: {
      type: Object,
    },
    createShowFun: {
      type: Boolean,
      default: false,
    },
    createFun: {
      type: Function,
      default: () => {},
    },
    value: {
      require: true,
    },
    local: {
      type: Boolean,
    },
    headers: {
      type: Array,
      required: true,
    },
    moreTD: {
      type: Boolean,
    },
  },
  data: () => ({
    filter_items: {},
    between: {},
    first_b: {},
    second_b: {},
    operator: {},
    type: {},
    tableHeader: [],
    opMenu: {},
    date_menu: [
      { text: 'برابر شود با', icon: 'checklist', fun: 'equal_filter' },
      { text: 'برابر نشود با', icon: 'rule', fun: 'notEqual' },
      { text: 'بزرگتر از', icon: 'search', fun: 'greater_than' },
      { text: 'کوچک تر از', icon: 'radio_button_checked', fun: 'less_than' },
    ],
    integer_menu: [
      {
        fun: 'equal_filter',
        icon: 'checklist',
        text: ' برابر باشد با',
      },
      {
        fun: 'notEqual',
        icon: 'rule',
        text: ' برابر نباشد با',
      },
      { text: 'بزرگتر از', icon: 'search', fun: 'greater_than' },
      { text: 'کوچک تر از', icon: 'radio_button_checked', fun: 'less_than' },
      { fun: 'ignore', icon: 'close', text: 'حذف فیلتر' },
    ],
    string_menu: [
      { text: 'شامل شود', icon: 'search', fun: 'includedString' },
      {
        fun: 'startWith_string',
        icon: 'format_indent_decrease',
        text: 'شروع شود با',
      },
      {
        fun: 'endWith_string',
        icon: 'format_indent_increase',
        text: 'پایان یابد با',
      },
      {
        fun: 'equal_filter',
        icon: 'checklist',
        text: ' برابر باشد با',
      },
      {
        fun: 'notEqual',
        icon: 'rule',
        text: ' برابر نباشد با',
      },
      { fun: 'ignore', icon: 'close', text: 'حذف فیلتر' },
    ],
  }),
  mounted() {
    this.between = { ...this.$store.state.dataTable.between.between }
    this.second_b = {
      ...this.$store.state.dataTable.between.second_b,
    }
    this.first_b = {
      ...this.$store.state.dataTable.between.first_b,
    }
    // ------------
    this.tableHeader = this.headers
    this.setOperatorAtFirst()
    if (this.$router.currentRoute.path != this.$store.state.dataTable.tabel_key) {
      this.$store.dispatch('dataTable/getFilters', {})
      this.$store.dispatch('dataTable/getBetween', {
        between: {},
        first_b: {},
        second_b: {},
      })
      this.$store.dispatch('dataTable/getPageInfo', {
        orderBy: true,
        page: 1,
        paginate: true,
        paginate_num: 50,
        sortBy: '',
      })
    } else {
      let test = this.$store.state.dataTable.filters
      if (this.$store.state.dataTable.filters) {
        for (const key in test) {
          this.filter_items[key] = test[key].value
        }
      }
    }

  },
  computed: {
    actions() {
      let items = []
      if (this.excel) {
        items.push({
          text: 'اکسل',
          fun: () => {
            let type = 'excel'
            this.$emit('Excel', type)
          },
        })
      }
      if (this.pdf) {
        items.push({
          text: 'PDF',
          fun: () => {
            let type = 'pdf'
            this.$emit('exportpdf', type)
          },
        })
      }

      return items.map((x) => {
        let disab_fun = () => {
          return false
        }
        if (x.disab_fun) {
          disab_fun = x.disab_fun
        }
        return {
          ...x,
          disab_fun,
        }
      })
    },
    filter_show(){
      if (this.no_filter_actions ) {
        return false
      }else{
        return true
      }
    }
  },
  watch: {
    headers() {
      this.tableHeader = this.headers
      this.setOperatorAtFirst()
    },
  },
  methods: {
    setOperatorAtFirst() {
      this.headers.forEach((element) => {
        if (element.filterCol != undefined) {
          if (element.filterType == 'date' || element.filterType == 'integer') {
            this.operator[element.filterCol] = 'equal'
          } else {
            this.operator[element.filterCol] = 'included'
          }
        }
      })
    },
    getData() {
      let filter = {}
      let filter_offline = {}
      if (Object.keys(this.between).length > 0) {
        let keys = Object.keys(this.between)
        keys.forEach((key) => {
          // ----between----تبدیل به شمسی
          let fi = this.$toJalali(this.first_b[key], 'YYYY/MM/DD', 'YYYY-MM-DD')
          let se = this.$toJalali(this.second_b[key], 'YYYY/MM/DD', 'YYYY-MM-DD')
          // --------
          filter[key] = {
            value: [fi, se],
            from: fi,
            to:  se,
            op: 'between',
          }
        })
        let betweenInfo = {
          between: this.between,
          first_b: this.first_b,
          second_b: this.second_b,
        }
        this.$store.dispatch('dataTable/getBetween', JSON.parse(JSON.stringify(betweenInfo)))
      }
      for (let key in this.filter_items) {
        for (let opKey in this.operator) {
          let value = this.filter_items[key]
          if (!this.$checkNotNull(value)) {
            continue
          }
          if (this.operator[opKey] == 'equal') {
            if (opKey == key) {
              let item = this.headers.find((x) => x.filterCol == key)
              if (item && item.filterType && item.filterType == 'date') {
                filter[key] = {
                  value: [value + ' 00:00:00', value + ' 23:59:59'],
                  from: value + ' 00:00:00',
                  to:  value + ' 23:59:59',
                  op: 'between',
                }
              } else {
                filter[key] = {
                  value,
                  op: '=',
                }
              }
            }
          }

          if (this.operator[opKey] == 'notEqual') {
            if (opKey == key) {
              filter[key] = {
                value,
                op: '!=',
              }
            }
          }
          if (this.operator[opKey] == 'endWith') {
            if (opKey == key) {
              filter[key] = {
                value: value + '%',
                op: 'LIKE',
              }
            }
          }
          if (this.operator[opKey] == 'startWith') {
            if (opKey == key) {
              filter[key] = {
                value: '%' + value,
                op: 'start',
              }
            }
          }
          if (this.operator[opKey] == 'notinclude') {
            if (opKey == key) {
              filter[key] = {
                value,
                op: '!=',
              }
            }
          }
          if (this.operator[opKey] == 'included') {
            if (opKey == key) {
              filter[key] = {
                value,
                op: 'LIKE',
              }
            }
          }

          if (this.operator[opKey] == 'lessThan') {
            if (opKey == key) {
              filter[key] = {
                value,
                op: '<',
              }
            }
          }
          if (this.operator[opKey] == 'greaterThan') {
            if (opKey == key) {
              filter[key] = {
                value,
                op: '>',
              }
            }
          }
        }
      }
      this.$store.dispatch('dataTable/getFilters', JSON.parse(JSON.stringify(filter)))
      this.$emit('allFilterItems')
      filter = {}

    },
    operatorsCall(header, op) {
      let headers = JSON.parse(JSON.stringify(this.tableHeader))
      headers.forEach((element) => {
        if (element.text == header.text) {
          switch (op) {
            case 'equal_filter':
              this.operator[element.filterCol] = 'equal'
              this.type[element.filterCol] = element.filterType
              element.icon = 'checklist'
              if (element.filterType == 'date') {
                this.between = {}
              }
              break
            case 'ignore':
              this.operator[element.filterCol] = ''
              this.filter_items[element.filterCol] = ''
              if (element.filterType == 'string') {
                this.operator[element.filterCol] = 'included'
                element.icon = 'search-outline'
              } else if (element.filterType == 'date') {
                this.operator[element.filterCol] = ''
                this.$store.dispatch('dataTable/getBetween', {
                  between: {},
                  first_b: {},
                  second_b: {},
                })
                this.first_b = {}
                this.second_b = {}
                this.between = {}
                element.icon = 'event_note'
              } else {
                element.icon = 'checklist'
                this.operator[element.filterCol] = 'equal'
              }
              break
            case 'between':
              this.operator[element.filterCol] = 'between'
              this.type[element.filterCol] = element.filterType
              this.between[element.filterCol] = true
              break
            case 'greater_than':
              this.operator[element.filterCol] = 'greaterThan'
              this.type[element.filterCol] = element.filterType
              element.icon = 'search'
              if (element.filterType == 'date') {
                this.between = {}
              }
              break
            case 'less_than':
              this.operator[element.filterCol] = 'lessThan'
              this.type[element.filterCol] = element.filterType
              element.icon = 'radio_button_checked'
              if (element.filterType == 'date') {
                this.between = {}
              }
              break
            case 'includedString':
              this.operator[element.filterCol] = 'included'
              this.type[element.filterCol] = element.filterType
              element.icon = 'search'
              break
            case 'notinclude_string':
              this.operator[element.filterCol] = 'notinclude'
              this.type[element.filterCol] = element.filterType
              element.icon = 'search_off'
              break
            case 'startWith_string':
              this.operator[element.filterCol] = 'startWith'
              this.type[element.filterCol] = element.filterType
              element.icon = 'format_indent_increase'
              break
            case 'notEqual':
              this.operator[element.filterCol] = 'notEqual'
              this.type[element.filterCol] = element.filterType
              element.icon = 'rule'
              if (element.filterType == 'date') {
                this.between = {}
              }
              break
            case 'endWith_string':
              this.operator[element.filterCol] = 'endWith'
              this.type[element.filterCol] = element.filterType
              element.icon = 'format_indent_decrease'
              break
          }
        }
      })

      this.tableHeader = [...headers]
    },
    changeSort(value, type, disableSort) {
      this.$emit('changeSortEmit', {
        value: value,
        type: type,
        disableSort: disableSort,
      })
    },
    removeFilter() {
      this.filter_items = {}
      this.getData()
    },
    removeSelectFilter(value) {
      delete this.filter_items[value]
      this.getData()
    },
    isObjEmpty(obj) {
      return Object.values(obj).length === 0 && obj.constructor === Object;
    },
  },
}
</script>
<style>
.table_input {
  min-width: 170px;
}
.nowrap-overflow {
  flex-wrap: nowrap;
}
.small-input-icon > .v-input__prepend-outer {
  margin-left: 0 !important;
}
.small-input-icon > .v-input__append-outer {
  margin-right: 0 !important;
}
.bg_filter{
  background-color: #ffffff00 !important;
}
</style>

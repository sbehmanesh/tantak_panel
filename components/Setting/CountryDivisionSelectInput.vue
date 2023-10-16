<template>
  <div v-if="end_render">
    <amp-labale :text="text" :required="required" />
    <v-autocomplete
      chips
      dense
      eager
      outlined
      :text="text"
      :rules="ruleItem"
      item-value="value"
      v-model="inp_value"
      :multiple="multiple"
      item-text="search_text"
      :items="$store.state.setting.city"
    >
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
            {{ data.item.text }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ data.item.sub_title }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  props: {
    value: { require: true },
    multiple: { type: Boolean, default: false },
    rules: { require: false, default: 'require' },
    text: { require: false, default: 'انتخاب شهر' },
  },
  data: () => ({
    ruleItem: [],
    inp_value: '',
    required: false,
    end_render: false,
  }),
  watch: {
    value() {
      this.setValue()
    },
    inp_value() {
      this.$emit('input', this.inp_value)
    },
  },
  beforeMount() {
    this.setValue()
    this.$store.dispatch('setting/getCityServer')
  },
  mounted() {
    this.setRules()
    this.end_render = true
  },
  methods: {
    setValue() {
      if (this.multiple) {
        this.inp_value = [...this.value]
      } else {
        this.inp_value = this.value
      }
    },
    setRules() {
      this.ruleItem = []
      let inpRules = this.$inpRules()
      if (typeof this.rules == 'string') {
        this.rules.split(',').forEach((element) => {
          if (typeof inpRules[element] != 'undefined') {
            if (element == 'require' || element == 'min_1') {
              this.required = true
            }
            this.ruleItem.push(inpRules[element])
          }
        })
      } else if (typeof this.rules == 'function') {
        this.ruleItem.push(this.rules)
      }
    },
  },
}
</script>

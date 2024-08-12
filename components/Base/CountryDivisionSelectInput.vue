<template>
  <div v-if="end_render" class="px-3">
    <amp-labale :text="text" :required="required" />
    <v-autocomplete
      chips
      dense
      eager
      outlined
      :text="text"
      :level="level"
      :rules="ruleItem"
      item-value="value"
      v-model="inp_value"
      :multiple="multiple"
      :readonly="readonly"
      item-text="search_text"
      :items="items_divisions"
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
    readonly: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    rules: { require: false, default: "" },
    defult_value: { require: false, default: "" },
    text: { require: false, default: "انتخاب شهر" },
    level: { require: false, default: "city_village" },
  },
  data: () => ({
    ruleItem: [],
    items_divisions: [],
    inp_value: "",
    required: false,
    end_render: false,
  }),
  watch: {
    inp_value() {
      this.$emit("input", this.inp_value);
    },
    value() {
      this.setValue();
    },

    level() {
      this.items_divisions = this.$store.state.setting.basic_info.country_divisions[
        this.level
      ];
    },
  },
  beforeMount() {
    this.setValue();
  },
  mounted() {
    this.setRules();
    this.setItemDivitions();
    this.end_render = true;
  },
  methods: {
    setValue() {
      if (this.multiple) {
        this.inp_value = [...this.value];
      } else {
        this.inp_value = this.value;
      }
    },
    setRules() {
      this.ruleItem = [];
      let inpRules = this.$inpRules();
      if (typeof this.rules == "string") {
        this.rules.split(",").forEach((element) => {
          if (typeof inpRules[element] != "undefined") {
            if (element == "require" || element == "min_1") {
              this.required = true;
            }
            this.ruleItem.push(inpRules[element]);
          }
        });
      } else if (typeof this.rules == "function") {
        this.ruleItem.push(this.rules);
      }
    },
    setItemDivitions() {
      setTimeout(() => {
        let items = [];
        let user_division = this.$store.state.auth.user.country_division_id;
        items = [...this.$store.state.setting.basic_info.country_divisions[this.level]];
        if (Boolean(this.$store.state.auth.user.country_division_id)) {
          for (let index = 0; index < items.length; index++) {
            const x = items[index];
            if (Boolean(x.parent_id) && x.parent_id == user_division) {
              this.items_divisions.push(x);
            }
          }
        }
        if (this.items_divisions.length == 0) {
          this.items_divisions = items;
        }
      }, 1000);
    },
  },
};
</script>

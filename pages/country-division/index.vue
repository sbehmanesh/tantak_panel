<template>
  <v-row>
    <v-col cols="12" md="12" class="center-div">
      <v-chip
        dark
        class="ma-2"
        color="btn_color"
        v-for="(item, index) in division_state"
        :key="index"
        @click="setFilters(item.value)"
        :outlined="item.outline"
      >
        {{ item.text }}
      </v-chip>
    </v-col>
    <v-col cols="12" md="12">
      <BaseTable
        url="/shop/country-division"
        :headers="headers"
        :filters="filters"
        createUrl="/country-division/insert"
        :autoLoad="false"
        autoUpdate="/country-division"
        autoDelete="/country-division/delete"
      />
    </v-col>
  </v-row>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    title: "شهر و استان",
    division_state: [],
    filters: {}
  }),
  beforeMount() {
    this.setItemsChip();
    this.headers = [
      {
        text: "نام",
        value: "name"
      },
      {
        text: "سطح",
        filterType: "select",
        filterable: false,
        disableSort: true,
        value: "level",
        items: this.$store.state.static.country_division
      },
      {
        text: "والد",
        filterCol: "cd2_name",
        value: body => {
          if (body.cd2_name) {
            return body.cd2_name;
          } else {
            return "-";
          }
        }
      }
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    setFilters(data) {
      this.division_state.forEach(element => {
        if (element.value == data) {
          element.outline = true
        } else {
          element.outline = false
        }
      });
      if (data) {
        this.filters = {
          level: {
            op: "=",
            value: data
          }
        };
      } else {
        this.filters = {};
      }
    },
    setItemsChip() {
      let items = [...this.$store.state.static.country_division];
      items.forEach(ele => {
        ele.outline = false;
        this.division_state.push(ele);
      });
      this.division_state.unshift({
        text: "همه",
        value: "",
        outline: true
      });
    }
  }
};
</script>

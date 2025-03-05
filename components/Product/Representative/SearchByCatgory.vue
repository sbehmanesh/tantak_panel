<template>
  <v-row class="align-center">
    <v-col cols="8" md="5">
      <amp-autocomplete text="جستجو محصولات" v-model="search" :items="list" />
    </v-col>
    <v-col cols="8" md="5">
      <amp-autocomplete text="نوع" v-model="type" :items="options_type" />
    </v-col>
    <v-col cols="4" md="2">
      <amp-button
        text="مشاهده همه"
        height="38"
        block
        color="blue-grey "
        @click="seeAll"
        class="ma-1"
        :loading="loading"
        :disabled="loading"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {},
  data: () => ({
    loading: false,
    list: [],
    type: "all",
    options_type: [
      { text: "پیکج و محصول", value: "all" },
      { text: " فقط محصول", value: "ProductVariationCombination" },
      { text: " فقط پکیج ", value: "Package" },
    ],
    search: "",
  }),
  mounted() {
    this.getLits();
  },
  watch: {
    search() {
      this.$emit("productId", this.search);
    },
    type() {
      this.$emit("type", this.type);
    },
  },
  methods: {
    getLits() {
      
      this.loading = true;
      this.$reqApi("sale-agency-stock/base-product", {
        row_number: 3000,
        sale_agency_id: this.$store.state.auth.user.sale_agency_id,
      })
        .then((res) => {
          let data = [];
          let items = [];
          data = res.model.data;

          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.list = items;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    seeAll() {
      this.search = "";
      this.type = "all";
      this.$emit("seeAll")
    },
  },
};
</script>

<style></style>

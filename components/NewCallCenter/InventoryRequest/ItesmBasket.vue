<template>
  <v-row>
    <div v-for="(item, index) in items" :key="index" >
      <v-alert
        text
        dense
        border="left"
        prominent
        color="primary darken-1"
        icon="shopping_basket"
      >
        <v-row class="align-center">
          <v-col cols="3" class="text-end">
            <h1 class="mr-3">
              {{ index + 1 }} - {{ item.variation1.product.name }}
            </h1>
          </v-col>
          <v-col cols="4" class="text-center">
            <h1>
      {{ item.information }}
            </h1>
          </v-col>
          <v-col cols="3" md="2" class="text-center">
            <v-row class="d-flex justify-center">
              <v-btn text @click="addNumber(item, true, 'list')" x-small>
                <h1 class="font_18 mx-1 mt-1 primary--text">+</h1>
              </v-btn>
              <h1 class="font_14 primary--text mx-1">
                {{ item.number }}
              </h1>
              <v-btn
                :disabled="item.number == 1"
                @click="addNumber(item, false, 'list')"
                text
                x-small
              >
                <h1 class="font_20 primary--text mx-1">-</h1>
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="3" class="text-start">
            <v-btn @click="deletVar(index)" text icon>
              <v-icon color="primary darken-1"> cancel </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </div>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },
    basketId: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      card_title: "",
      items: [],
    };
  },
  mounted() {
     
  },
  methods: {
    loadItems() {
      this.$reqApi("product-request/show", { id: this.basketId })
        .then((res) => {
          let date = res.data.items;
          this.items = date;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

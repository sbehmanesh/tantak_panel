<template>
  <v-row>
    <v-col
      v-if="list_items.length != 0"
      cols="12"
      v-for="(x, i) in list_items"
      :key="i"
    >
      <v-card
        class="elevation-1 pa-1 d-flex align-center"
        outlined
        width="100%"
        v-if="x.section_name == 'ProductVariationCombination'"
      >
        <v-avatar size="45" class="mx-2">
          <img :src="$getImage(x.product_var.variation1.product.main_image)" />
        </v-avatar>
        <v-col cols="12" md="6">
          <h1>
            {{ x.product_var.variation1.product.name }}
            <br />
            <small class="mx-1 grey--text">
              قیمت محصول :{{$price(x.product_var.price)  }} ریال
            </small>
            <br />

            <small
              class="grey--text"
              v-if="Boolean(x.product_var.variation1.colors)"
            >
              {{ x.product_var.variation1.variation_type.value }}
              {{ x.product_var.variation1.colors }}
            </small>
            <small class="grey--text" v-else>
              {{ x.product_var.variation1.variation_type.value }}
              {{ x.product_var.variation1.value }}
            </small>
            <small class="mx-1 grey--text">
              {{ x.product_var.variation2.variation_type.value }}
              {{ x.product_var.variation2.value }}
            </small>
            <small class="mx-1 grey--text">
              {{ x.product_var.variation3.variation_type.value }}
              {{ x.product_var.variation3.value }}
            </small>
          </h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="3">
          <amp-input
            class="mt-6"
            v-model="x.count"
            cClass="ltr-item"
            rules="require,number"
          />
        </v-col>


      </v-card>

      <v-card
        class="elevation-1 pa-1 d-flex align-center"
        outlined
        width="100%"
        v-else
      >
        <v-avatar size="45" class="mx-2">
          <img :src="$getImage(x.package.log)" />
        </v-avatar>
        <v-col cols="12" md="6">
          <h1>
            {{ x.package.name }}
            <br />

            <small class="mx-1 grey--text">
              شماره پکیج :{{ x.package.package_number }}
            </small>
            <br />
            <small class="mx-1 grey--text">
              قیمت پکیج :{{$price(x.package.price)  }} ریال
            </small>
            <br />

            <small class="mx-1 grey--text">
              {{ x.package.description }}
            </small>
          </h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="3">
          <amp-input
            class="mt-6"
            v-model="x.count"
            cClass="ltr-item"
            rules="require,number"
          />
        </v-col>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    information: {
      default: {},
      require: false,
    },
  },
  data: () => ({
    list_items: [],
    customer: {},
  }),

  mounted() {
    this.listItems();
  },
  methods: {
    submit() {
      this.$emit("customer", this.customer);
      this.$emit("nextStep");
    },
    listItems() {
      let array = [];
  
      if (Object.keys(this.information).length > 0) {
        let i = 0;
    
    

        do {
          let id = this.information.selected_item[i];
          console.log("id", id);

          i++;
          array.push(this.information.list.find((x) => x.id == id)) ;
        } while (i < this.information.selected_item.length );
      }
      console.log("array??? ", array);

      this.list_items = array;
    },

  },
};
</script>
<style scoped>
.clicabel :hover {
  color: rgb(240, 70, 70);
  border-bottom: 1px solid rgb(240, 70, 70);
  cursor: pointer;
}
</style>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="780">
      <v-card style="overflow: hidden;">
        <v-card-title class="primary d-flex justify-center py-5">
      
          <span class="white--text font_20">
            {{ card_title }}
          </span>
          <v-icon color="white" large class="mr-1"> add_shopping_cart </v-icon>
 
        </v-card-title>
        <v-card-text>
          <SelectVariation
            v-if="dialog"
            :basketId="basketId"
            @submit="InsertItem"
            ref="selectVar"
          />
        </v-card-text>
        <v-card-actions>
          <v-row class="d-flex justify-center pa-3"   v-if="this.$store.state.auth.action.indexOf('product_requests/update') > -1">
            <amp-button
              text="انصراف"
              @click="closeDialog"
              color="red"
              class="ma-2"
            />
            <amp-button
              text="تایید"
              @click="getItems"
              color="success darken-1" 
              class="ma-2"
            />
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import SelectVariation from "@/components/NewCallCenter/InventoryRequest/SelectVariation.vue";

export default {
  components: { SelectVariation },
  props: {
    dialog: {
      require: false,
      default: false,
    },
    request: {
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
      card_title: "",
      products: [],
    };
  },
  beforeMount() {
    switch (this.request) {
      case true:
        this.card_title = "درخواست موجودی ";
        break;

      default:
        this.card_title = "ویرایش موجودی";
        break;
    }
  },
  methods: {
    getItems() {
      this.$refs.selectVar.callSubmit();
    },
    InsertItem() {
      this.$emit("reload");
      this.$emit("closeDialog");
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>

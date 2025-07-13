<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="680">
      <v-card class="pa-0" style="overflow: hidden !important">
        <v-col cols="12" class="text-start">
          <v-toolbar color="blue-grey" dark>
            <v-col cols="12" class="d-flex align-center">
              <span class="font_18">رسید های بارگذاری شده</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog">
                <v-icon>close</v-icon>
              </v-btn>
            </v-col>
          </v-toolbar>
        </v-col>
        <v-row class="d-flex justify-center pa-5">
          <v-col
            class="text-center"
            cols="12"
            md="4"
            v-for="(x, i) in files"
            :key="i"
          >
            <v-card class="pa-0 elevation-3" outlined >
              <v-img cover height="120" :src="$getImage(x)"></v-img>
              <v-btn
              class="rounded-0"
                @click="getImage(x)"
                block
                dark
                color="blue-grey lighten-1"
              >
                <span> مشاهده تصویر </span>
                <v-icon class="mr-2">downloading</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: { default: false, require: false },
    images: { default: () => [], require: false },
  },
  data() {
    return {};
  },
  computed: {
    files() {
      return this.images;
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    getImage(img) {
      window.open(this.$getImage(img));
    },
  },
};
</script>

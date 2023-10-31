<template>
  <v-card class="pa-2 ma-2">
    <v-row>
      <v-col cols="12" md="12" v-if="items_gallry.length == 0">
        <v-row>
          <v-col cols="12" md="12">
            <v-col cols="12" md="12" class="center-div">
              <v-card class="elevation-0 pa-2">
                <v-img width="50" height="50" src="/image/no_image.png" />
              </v-card>
            </v-col>
            <v-col cols="12" md="12" class="center-div gry--text">
              تصویری انتخاب نشده است
            </v-col>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="12" v-else>
        <v-row>
          <v-col
            cols="12"
            md="3"
            v-for="(item, index) in items_gallry"
            :key="index"
          >
            <v-img
              class="elevation-3 rounded"
              width="200"
              height="200"
              :src="$getImage(item)"
              @click='removeImage(item)'
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="12">
        <v-divider></v-divider>
        <v-card class="elevation-0">
          <AmpUploadFile v-model="path_items" :multiple="true" />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    items: { type: Array },
    index:{default:null}
  },
  data() {
    return {
      path_items: [],
      items_gallry: []
    };
  },
  beforeMount() {
    if (this.items) {
      this.items.map(x => {
        this.items_gallry.push(x.path);
      });
    }
  },
  watch: {
    path_items() {
      this.path_items.map(x => {
        this.items_gallry.push(x);
      });
      let alt_image = [];
      this.items_gallry.map(x => {
        alt_image.push({
          alt: "product image",
          path: x
        });
      });
      this.$emit("SeGallry", [alt_image , this.index]);
    }
  },
  methods: {
    removeImage(id){
      let clone_gallry = []

      this.items_gallry.filter((x)=> {
        if(x != id){
          clone_gallry.push(x)
        }
      })
      this.items_gallry = clone_gallry
      this.path_items = []
    }
  },
};
</script>

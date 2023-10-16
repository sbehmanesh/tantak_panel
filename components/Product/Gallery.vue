<template>
  <v-dialog v-model="gallery_dialog" persistent>
    <v-card min-height="500">
      <v-card-title class="d-flex justify-space-between"> گالری تصاویر </v-card-title>

      <v-card-text class="min-h row my-5">
        <v-row>
          <v-col v-for="(img, index) in gallery_array" :key="img + index" class="d-flex child-flex" cols="2">
            <v-hover v-slot="{ hover }">
              <div class="pa-1 ma-1 text-center border">
                <v-img :src="$getImage(img)" aspect-ratio="1" class="grey lighten-2 img" height="">
                  <v-expand-transition>
                    <div
                      v-if="hover"
                      class="d-flex transition-fast-in-fast-out v-card--reveal text-h2 white--text"
                      style="height: 100%"
                    >
                      <v-btn @click="remove(img)" fab small color="error" class="test float-left">
                        <v-icon> close </v-icon>
                      </v-btn>
                    </div>
                  </v-expand-transition>
                </v-img>
              </div>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row dense>
          <v-col cols="12" md="4" />
          <v-col cols="12" md="4" class="text-center">
            <amp-upload-file suggested_size="1000px ✘ 450px" :show_title="false" v-model="image" multiple />
          </v-col>
          <v-col cols="12" md="4" />
          <v-col cols="12" md="12">
            <v-divider />
          </v-col>
          <v-col cols="12" md="12" class="text-center">
            <amp-button
              large
              icon="done"
              class="my-1"
              @click="insertGallery"
              color="success"
              :loading="loading"
              text="ثبت تصاویر"
            />
            <amp-button large icon="redo" class="my-1" color="warning" text="بستن" @click="openDialog" />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import AmpButton from '../Base/AmpButton.vue'
export default {
  components: { AmpButton },
  props: {
    gallery_imgs: { type: Array },
    value: { type: Boolean, required: true },
    edit: { type: Boolean, required: false },
  },
  data: () => ({
    loading: false,
    gallery_dialog: false,
    image: '',
    gallery_array: [],
  }),
  watch: {
    image() {
      this.gallery_array = []
      for (let i = 0; i < this.image.length; i++) {
        this.gallery_array.push(this.image[i])
      }
    },
    value() {
      this.openDialog()
    },
    gallery_imgs() {
      if (this.gallery_imgs) {
        if (this.edit) {
          this.gallery_array = []
          for (let i = 0; i < this.gallery_imgs.length; i++) {
            if (typeof this.gallery_imgs[i] == 'object') {
              this.gallery_array.push(this.gallery_imgs[i].path)
            }
          }
        } else {
          this.gallery_array = this.gallery_imgs
        }
      }
    },
  },
  mounted() {
    if (this.gallery_imgs) {
      if (this.edit) {
        for (let i = 0; i < this.gallery_imgs.length; i++) {
          if (typeof this.gallery_imgs[i] == 'object') {
            this.gallery_array.push(this.gallery_imgs[i].path)
          }
        }
      } else {
        this.gallery_array = this.gallery_imgs
      }
    }
  },
  methods: {
    remove(img) {
      let index = this.gallery_array.indexOf(img)
      this.gallery_array.splice(index, 1)
    },
    openDialog() {
      this.gallery_dialog = !this.gallery_dialog
    },
    insertGallery() {
      this.$emit('insertGallery', this.gallery_array)
      this.openDialog()
    },
  },
}
</script>

<style scoped>
.min-h {
  min-height: 340px;
}
.border {
  border: 1px solid grey;
  height: 190px;
}
.img {
  width: 198px;
  height: 180px;
  object-fit: contain;
}
</style>

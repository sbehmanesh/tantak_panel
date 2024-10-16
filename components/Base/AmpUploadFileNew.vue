<template>
  <div class="px-3">
    <amp-labale :text="title" v-if="label" />
     <v-btn outlined color="#837b7b"  block @click="openDialog()" height="40" >
      <strong v-if="!label">{{ title }}</strong>
      <strong v-else>
بارگذاری
   
      </strong>
      <v-icon size="20" class="mx-2">attach_file</v-icon>

     </v-btn>
    <v-dialog persistent v-model="dialog" width="800">
      <v-card>
        <v-toolbar dense dark color="primary">
          <v-btn icon class="hidden-xs-only">
            <v-icon>attach_file</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pt-4">
          <div class="dragbox">
            <input type="file" class="input-file" :accept="checkAcceptType" @change="selectFile($event)" />
            <p>
              <span>برای بارگذاری فایل</span><br />
              <span>کلیک کنید یا فایل را بکشید و رها کنید</span>
            </p>
          </div>
          <div class="mt-4">
            <v-row dense v-for="(item, index) in items" :key="index">
              <v-col cols="2">
                <v-img width="60" height="60" v-if="item.icon == 'image'" :src="$getImage(item.path)" />
                <v-icon v-else size="40" :class="item.iconClass">
                  {{ item.icon }}
                </v-icon>
              </v-col>
              <v-col cols="10">
                <div v-if="item.progress >= 100" class="text-left">
                  <amp-button text="نمایش" color="primary" @click="selectItem(item)" />
                  <amp-button text="حذف" color="error" @click="selectItem(item)" />
                </div>
                <div v-else class="center-div h-max">
                  <v-progress-linear dark striped height="25" item.progress v-model="item.progress">
                    <strong>{{ item.progress }}%</strong>
                  </v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <div class="center-div pa-2">
          <amp-button text="ثبت" class="mx-2" color="success" @click="submit()" :loading="loading" />
          <amp-button text="بستن" color="warning" @click="closeDialog()" />
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogShowItem.show" max-width="400">
      <v-card v-if="dialogShowItem.item" class="pa-4">
        <v-card-text class="text-center">
          <v-flex v-if="dialogShowItem.item.icon == 'image'">
            <v-img max-width="400" :src="$getImage(dialogShowItem.item.path)" />
          </v-flex>
          <v-flex v-else-if="dialogShowItem.item.icon == 'movie'">
            <video width="370px" controls>
              <source :src="$getImage(dialogShowItem.item.path)" />
            </video>
          </v-flex>
          <v-flex v-else-if="dialogShowItem.item.icon == 'music_video'">
            <audio controls>
              <source :src="$getImage(dialogShowItem.item.path)" type="audio/mpeg" />
            </audio>
          </v-flex>
          <v-flex v-else>
            <v-icon size="100" :class="[dialogShowItem.item.itemClass]">
              {{ dialogShowItem.item.icpn }}
            </v-icon>
          </v-flex>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn dark color="error darken-1" @click="deleteItem(dialogShowItem.item)"> حذف </v-btn>
          <v-spacer></v-spacer>
          <a
            target="_blank"
            :href="$getImage(dialogShowItem.item.path, false)"
            class="v-btn v-btn--contained theme--dark v-size--default darken-1 warning"
          >
            باز کردن
          </a>
          <v-btn dark color="green darken-1" @click="dialogShowItemClose()"> بستن </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: { default: 'بارگذاری تصویر' },
    checkAcceptType: { default: 'image/*' },
    multiple: { type: Boolean, default: false },
    label: { type: Boolean, default: true },
    value: { type: String | Array, require: true },
    reSize:{type:Boolean , default:false}
  },
  data: () => ({
    loading: false,
    dialog: false,
    items: [],
    dialogShowItem: {
      item: null,
      show: false,
    },
  }),
  watch: {
    value() {
      this.initData()
    },
    dialog() {
      this.initData()
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    selectFile(event) {
      if (!(event && (event.target || event.dataTransfer))) {
        return
      }
      var files = event.target.files || event.dataTransfer.files
      if (files.length == 0) {
        return
      }
      this.loading = true
      let item = this.pathToObject()
      if (this.multiple) {
        this.items = [item, ...this.items]
      } else {
        this.items = [item]
      }
      let config = {
        onUploadProgress: (progressEvent) => {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.updateItem(item.id, progress, false)
        },
      }
      let formData = new FormData()
      formData.append('file', files[0])
      formData.append('not_resize', this.reSize)
      this.$reqApi('/upload/insert', formData, config)
        .then((response) => {
          this.updateItem(item.id, 100, true, response.path)
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    updateItem(id, progress, active, path = '') {
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].id == id) {
          this.items[index].active = active
          this.items[index].progress = progress
          if (path) {
            let item = this.pathToObject(path, 100)
            this.items[index].path = path
            this.items[index].icon = item.icon
            this.items[index].iconClass = item.iconClass
          }
        }
      }
    },
    submit() {
      let items = this.items.filter((x) => x.active).map((x) => x.path)
      if (this.multiple) {
        this.$emit('input', items)
      } else if (items.length > 0) {
        this.$emit('input', items[0])
      } else {
        this.$emit('input', '')
      }
      this.closeDialog()
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    initData() {
      let items = []
      if (typeof this.value == 'string' && this.value.length > 0) {
        items = [this.value]
      } else if (Array.isArray(this.value)) {
        items = [...this.value]
      }
      this.items = items.map((x) => this.pathToObject(x, 100, true))
    },
    getId() {
      let data = this.$moment().format('YYYY_MM_DD_HH:mm:ss.SSS')
      let rand = parseInt(Math.random() * 1000)
      return `${data}${rand}`
    },
    pathToObject(path = '', progress = 0, active = false) {
      let list = {
        id: this.getId(),
        path,
        active,
        progress,
        icon: 'backup',
        iconClass: 'purple white--text',
      }
      let type = path.split('.')
      type = type[type.length - 1]
      if (['png', 'jpg', 'gif', 'jpeg', 'svg'].indexOf(type) > -1) {
        list.icon = 'image'
        list.iconClass = 'blue white--text'
      } else if (['mp4', 'm4v', 'avi', 'mkv', '3gp'].indexOf(type) > -1) {
        list.icon = 'movie'
        list.iconClass = 'amber white--text'
      } else if (['mp3', 'mpeg'].indexOf(type) > -1) {
        list.icon = 'music_video'
        list.iconClass = 'red white--text'
      } else {
        list.icon = 'file_copy'
        list.iconClass = 'purple white--text'
      }
      return list
    },
    selectItem(item) {
      this.dialogShowItem.item = item
      this.dialogShowItem.show = true
    },
    dialogShowItemClose() {
      this.dialogShowItem.show = false
    },
    deleteItem(item) {
      this.items = this.items.filter((x) => x.id != item.id)
      this.dialogShowItemClose()
    },
  },
}
</script>

<style scoped>
.dragbox {
  background: #ebebeb;
  padding: 10px 10px;
  height: 112px;
  position: relative;
  cursor: pointer;
  border-radius: 7px;
  border: 1px dashed #666;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
}

.dragbox:hover {
  background: '#eee';
}

.dragbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 15px 0;
}
.width_80 {
  width: 80px !important;
  max-width: 80px !important;
}
.width_80 > img {
  width: 80px;
  height: 80px;
}
</style>

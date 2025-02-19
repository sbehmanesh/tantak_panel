<template>
  <v-dialog
    v-model="open"
    transition="dialog-top-transition"
    persistent
    content-class="meet-dialog ma-0"
  >
    <div
      :class="
        $vuetify.breakpoint.mdAndUp ? 'fix_btn_call_desktop' : 'fix_btn_call'
      "
    >
    </div>

    <div id="meet"></div>
  </v-dialog>
</template>
<script>
export default {
  props: {
    jwt: {
      type: String,
      require: true,
    },
    roomName: {
      type: String,
      require: true,
    },
  },
  data: () => {
    return {
      open: true,
      chat_id: '',
      url: '',
      intervalls: '',
    }
  },
  watch: {
    jwt() {
      if (this.jwt != '') {
        this.open = true
        this.startCall()
      }
    },
  },
  destroyed() {
    clearInterval(this.intervalls)
  },
  mounted() {
    if (this.jwt != '') {
      this.open = true
      this.startCall()
    }
  },
  methods: {
    startCall() {
      const domain = 'vcall.aramin.ir'
      let height = window.innerHeight
      let width = window.innerWidth
      const options = {
        roomName: this.roomName,
        configOverwrite: {
          disableDeepLinking: true,
          defaultLogoUrl: 'image/recieve-rect.svg',
          fileRecordingsEnabled : false,
          localRecording : {},
          fileRecordingsServiceSharingEnabled: false,
          
          'localRecording.disable' : false,
          // localRecordingDisableSelfRecording : false,
          // 'localRecording.sharingEnabled' : false,
          toolbarButtons: [
            'camera',
            'chat',
            'closedcaptions',
            'desktop',
            'dock-iframe',
            'download',
            'embedmeeting',
            'etherpad',
            'feedback',
            'filmstrip',
            'fullscreen',
            'hangup',
            'help',
            'highlight',
            'invite',
            'linktosalesforce',
            'livestreaming',
            'microphone',
            'noisesuppression',
            'participants-pane',
            'profile',
            'raisehand',
            // 'recording',
            'security',
            'select-background',
            'settings',
            'shareaudio',
            'sharedvideo',
            'shortcuts',
            'stats',
            'tileview',
            'toggle-camera',
            'undock-iframe',
            'videoquality',
          ],
        },
        width: width,
        height: height,
        parentNode: document.querySelector('#meet'),
        lang: 'fa',
        jwt: this.jwt,
      }
      const api = new JitsiMeetExternalAPI(domain, options)

      // setTimeout(() => {
      // }, 500);
      // frames.document.querySelector('.watermark').style.display = 'none'
      api.addListener('videoConferenceLeft', (data) => {
        window.close()
        // this.$store.dispatch('chat/setNewMeet', '')
        // this.$store.dispatch('chat/setMeetAlert', '')
        api.dispose()
      })
    },
    // reCall(){
    //   this.loading = true
    //   this.$reqApi('/message/ring-vcall', { chat_id: this.chat_id })
    //     .then(async (response) => {
    //       this.loading = false
    //     })
    //     .catch(async (error) => {
    //       this.loading = false
    //     })
    // }
    permissionNotification() {
      return new Promise((res, rej) => {
        if (!('Notification' in window)) {
          rej()
        } else if (Notification.permission === 'granted') {
          res()
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission()
            .then((permission) => {
              if (permission === 'granted') {
                res()
                return
              }
              rej()
            })
            .catch((error) => rej())
        }
      })
    },
  },
}
</script>
<style>
.meet-dialog {
  padding: 0 !important;
  max-height: 100% !important;
  overflow: hidden;
}
.leftwatermark {
  display: none !important;
}
.wterkmark {
  display: none !important;
}
.fix_btn_call {
  position: fixed;
  width: 100%;
  max-width: 400px;
}
.fix_btn_call_desktop {
  position: fixed;
  width: 100%;
  max-width: 960px;
}
</style>

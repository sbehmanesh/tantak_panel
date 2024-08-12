<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="250" >
        
      <v-card class="pa-4">
    <v-col cols="12">
        <h1>
            برقراری تماس
        </h1>
    </v-col>
        <v-card-text
          @click="callTo('phone')"
          class="elevation-2 my-3 mt-6 call-card"
        >
          <v-row class="align-center py-2">
            <h1 class="font_12">تماس از طریق شماره همراه</h1>
            <v-spacer></v-spacer>

            <v-icon color="green darken-1 " size="20"> call </v-icon>
          </v-row>
        </v-card-text>

        <v-card-text
          @click="callTo('port')"
          class="elevation-2 my-3 mt-6 call-card"
        >
          <v-row class="align-center py-2">
            <h1 class="font_12">تماس از طریق  ویپ</h1>
            <v-spacer></v-spacer>
            <v-icon color="green darken-1" size="20"> dialpad </v-icon>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="d-flex justify-center ">
            <v-btn class="my-1" color="red darken-1" text @click="dialog = false">
              انصراف
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },
    username: {
      require: false,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    callTo(type) {
      let call_to = type;

      this.$reqApi("message/issabel-request-call", {
        username: this.username,
        type_call: call_to,
      })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    
      
    },
  },
};
</script>
<style scoped>
.call-card:hover {
  background-color: #635d5a28 !important;
  transition: all 0.3s ease !important;
  cursor: pointer;
}
</style>

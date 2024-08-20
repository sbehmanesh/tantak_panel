<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="300">
      <v-card class="pa-2 called" style="overflow: hidden">
        <v-col cols="12">
          <v-row cols="12" class="mb-3 align-center mt-1">
            <h1 class="font_12 mx-1">برقراری تماس با </h1>

            <h1 class="ltr-item font_12" >( {{ $showUsername(username) }} )</h1>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          :disabled="loading"
          @click="callTo('phone')"
          class="elevation-2 call-card"
          v-if="!loading"
        >
          <v-row class="align-center ma-1">
            <h1 class="font_12">تماس از طریق شماره همراه</h1>
            <v-spacer></v-spacer>
            <v-icon color="green darken-1 " size="20"> call </v-icon>
          </v-row>
        </v-col>

        <v-col
          v-if="!loading"
          cols="12"
          @click="callTo('port')"
          class="elevation-2 my-3 mt-6 call-card"
        >
          <v-row class="align-center ma-1">
            <h1 class="font_12">تماس از طریق ویپ</h1>
            <v-spacer></v-spacer>
            <v-icon color="green darken-1" size="20"> dialpad </v-icon>
          </v-row>
        </v-col>
        <v-row v-if="loading" class="d-flex justify-center">
          <v-col cols="12"></v-col>
          <v-progress-circular
            size="65"
            width="5"
            indeterminate
            color="green darken-2 "
          >
            <v-icon color="green darken-2"> settings_phone </v-icon>
          </v-progress-circular>
          <v-col cols="12" class="text-center mb-4">
            <small class="mt-3 green--text"> درحال برقراری تماس </small>
          </v-col>
          <v-col cols="12"></v-col>
        </v-row>
        <v-card-actions v-if="!loading">
          <v-row class="d-flex justify-center mt-2">
            <v-btn
              class="my-1"
              color="red darken-1"
              text
              @click="closeDialog()"
            >
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
    return {
      loading: false,
    };
  },
  watch: {
    loading() {
      if (this.loading) {
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      }
    },
  },
  methods: {
    callTo(type) {
      this.loading = true;
      let call_to = type;
      this.$reqApi("message/issabel-request-call", {
        username: this.username,
        type_call: call_to,
      })
        .then((res) => {
          setTimeout(() => {
            this.$toast.success("تماس با موفقیت برقرار شد");
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.call-card:hover {
  background-color: rgb(236, 236, 236);
  transition: all 0.3s ease !important;
  cursor: pointer;
  box-shadow: 2px 2px 2px #0000008a !important;
}
</style>

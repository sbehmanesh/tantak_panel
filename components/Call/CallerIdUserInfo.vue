<template>
  <div class="text-cenetr">
    <v-row>
      <v-col cols="12" md="12" class="text-end">

        <h1>
          <small class="grey--text"> تماس گیرنده </small>
          <small v-if="!unKnownUser" class="mx-1">
            {{ call.first_name }} {{ call.last_name }}
          </small>
          <small class="mx-1" v-else-if="!Boolean(temp_name)">ناشناس </small>
          <small v-else> {{ temp_name }}</small>
          <br />
          <small>
            {{ call.username }}
            <v-icon size="15px"> call </v-icon>
          </small>
          <br />
          <small class="grey--text"> مبدأ تماس از </small>
          <small>
            {{ call.issabel_server_name }}
            ترانک {{ call.trunk }}
          </small>
        </h1>
        <br v-if="unKnownUser" />
        <v-btn
        v-if="unKnownUser"
          block
          outlined
          small
          text
          color="blue-grey"
          @click="showAddUserDialog"
        >
          <h1>
            <small> ذخیره شماره </small>
            <v-icon size="15"> person_add </v-icon>
          </h1>
        </v-btn>
      </v-col>
    </v-row>

    <CallerIdAddUserDialog
      v-if="add_user_dialog.show"
      v-model="add_user_dialog.show"
      :user-id="call.id"
      @closeDialog="closeAddUserDialog"
      @updateName="updateName($event)"
    />
  </div>
</template>

<script>
import AmpAutocomplete from "../Base/AmpAutocomplete.vue";
import AmpButton from "../Base/AmpButton.vue";
import CallerIdAddUserDialog from "~/components/Call/CallerIdAddUserDialog.vue";

export default {
  components: { AmpAutocomplete, AmpButton, CallerIdAddUserDialog },
  props: {
    call: {
      type: Object,
      require: true,
    },
  },
  computed: {
    unKnownUser() {
      if (this.call.first_name || this.call.last_name || this.temp_name) {
        return false;
      } else {
        return true;
      }
    },
    checkAccess() {
      let actions = this.$store.state.auth.action;
      return actions.indexOf("fire_insurance_landing_setting/root") > -1;
    },
  },
  watch: {
    "$store.state.ws.call_info": {
      handler(val) {
        this.temp_name = "";
      },
      deep: true,
    },
  },

  data: () => ({
    loading: false,
    valid: false,
    add_user_dialog: { show: false, item: null },
    // برای نمایش موقت نام کاربر هنگامی که شماره وجود ندارد و توسط کاربر ساخته می شود.
    temp_name: "",
  }),

  beforeMount() {},
  beforeDestroy() {},
  mounted() {},

  methods: {
    showAddUserDialog() {
      this.add_user_dialog.item = this.call;
      this.add_user_dialog.show = true;
    },
    closeAddUserDialog() {
      this.add_user_dialog.show = false;
      this.add_user_dialog.item = null;
    },
    updateName(event) {
      this.temp_name = event.first_name + " " + event.last_name;
    },
  },
};
</script>
<style scoped></style>

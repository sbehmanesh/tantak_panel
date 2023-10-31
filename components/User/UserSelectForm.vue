<template>
  <div :class="clear ? 'd-flex justify-center align-center' : ''">
    <amp-input
      readonly
      :text="text"
      :rules="rules"
      class="pointer"
      append-icon="edit"
      v-model="inp_value_name"
      @click:append="openDialog()"
    />
    <div v-if="clear">
      <v-btn small @click="emptyInpValue()" class="elevation-0 white mt-2"><v-icon>close</v-icon></v-btn>
    </div>
    <v-dialog
      fullscreen
      hide-overlay
      v-model="user_dialog"
      transition="dialog-bottom-transition"
    >
      <v-toolbar dark color="secondary">
        <v-btn icon dark @click="closeDialog()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ text }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card class="pa-7">
        <UserSelect
          :multi="multi"
          :show-url="url"
          v-model="items"
          @closeDialog="closeDialog()"
          :rootBody="root_body"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserSelect from "~/components/User/UserSelect";
export default {
  components: { UserSelect },
  props: {
    roleId: { type: Array, require: true },
    multi: { type: Boolean, default: false },
    value: { require: true, default: () => [] },
    rules: { require: false, default: "" },
    text: { require: false, default: "انتخاب کاربر" },
    url: { require: false, default: "/user/searchByRole" },
    clear: { require: false, default: false },
    notIn: { require: false, default: false },
  },
  data: () => ({
    loading: false,
    items: [],
    user_dialog: false,
    inp_value_name: "",
  }),
  computed: {
    root_body() {
      if (this.roleId) {
        if (this.roleId.length > 0) {
          if (this.notIn) {
            return {
              role_id: this.roleId,
              not_in: true,
            };
          } else {
            return { role_id: this.roleId };
          }
        }
      }
      return null;
    },
  },
  watch: {
    value() {
      if (this.items.length == 0) {
        this.items = this.value;
      }
    },
    items() {
      this.$emit("input", this.items);
      this.$emit("getData", this.items);
      this.inp_value_name = this.items.map((x) => `${x.first_name} ${x.last_name}`).join(' | ')
    },
  },
  beforeMount() {
    this.items = [...this.value];
  },
  methods: {
    openDialog() {
      this.user_dialog = true;
    },
    closeDialog() {
      this.user_dialog = false;
    },
    emptyInpValue() {
      this.inp_value_name = null;
      this.$emit("clearUserSelect", this.inp_value_name);
    },
  },
};
</script>

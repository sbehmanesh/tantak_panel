<template>
  <v-container fluid>
    <v-row dense v-if="user">
      <v-col cols="4"> </v-col>
      <v-col cols="1" class="text-center">
        <img :src="avatar(user)" width="60" />
      </v-col>
      <v-col cols="3" class="mt-5 pointer" @click="goToProfile(user.id)">
        <span class="font_bold">
          {{ user.first_name }} {{ user.last_name }} ( {{ user.username }} )
        </span>
      </v-col>
      <v-col cols="12" md="12">
        <v-divider />
      </v-col>
      <v-col cols="12" v-for="item in items" :key="item.id">
        <v-row dense class="py-3">
          <v-col cols="12" md="6" v-if="item.user_id == user.id" />
          <v-col cols="12" md="6">
            <v-card class="mx-2" color="#ff69ccbd">
              <v-card-title>
                <img :src="avatar(item)" width="50" />
                <span class="font_14 pr-2">
                  {{ item.first_name }} {{ item.last_name }}
                </span>
              </v-card-title>
              <v-card-text>
                <div v-html="item.text" class="white-space_pre-line"></div>
              </v-card-text>
              <v-card-actions class="w-max">

                <template v-if="item.user_id != user.id" >
                  <v-icon color="error" @click="deleteMessage(item)"
                    >delete</v-icon
                  >
                  <v-icon color="success" @click="editMessage(item)"
                    >edit</v-icon
                  >
                </template>
                <v-spacer />
                <div class="ltr-item w-max">
                  <v-icon size="18">calendar_today</v-icon>
                  {{ $toJalali(item.created_at) }}
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" v-if="item.user_id != user.id" />
        </v-row>
      </v-col>
    </v-row>
    <v-row dense class="center-div pa-4" v-if="loading">
      <v-progress-circular
        :size="50"
        indeterminate
        color="success"
      ></v-progress-circular>
    </v-row>
    <AmpDelete
      :id="delete_dialog.item"
      @deleteItem="removeItem"
      v-model="delete_dialog.show"
      deleteUrl="/ticket-message/delete"
    />
    <v-dialog width="800" v-model="edit_dialog.show">
      <v-card v-if="edit_dialog.show" class="pa-4">
        <v-form
          v-model="valid_edit"
          :disabled="loading_edit"
          @submit.prevent="submit()"
        >
          <amp-editor
            :rows="8"
            rules="require"
            v-model="edit_dialog.item.text"
          ></amp-editor>
          <div class="pa-3">
            <amp-button
              text="بستن"
              icon="close"
              color="error"
              @click="closeDialog()"
              :disabled="loading_edit"
            />
            <amp-button
              icon="edit"
              text="ویرایش"
              type="submit"
              color="success"
              :loading="loading_edit"
              :disabled="!valid_edit || loading_edit"
            />
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AmpDelete from "~/components/Base/AmpDelete.vue";
export default {
  components: { AmpDelete },
  props: { modelId: { default: null } },
  data: () => ({
    loading: true,
    valid_edit: false,
    loading_edit: false,
    user: {},
    items: [],
    wallet: "",
    edit_dialog: { show: false, item: null },
    delete_dialog: { show: false, item: null },
  }),
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$reqApi("/ticket-message", {
        ticket_id: this.modelId,
        row_number: 500,
      })
        .then((response) => {
          this.user = response.user;
          this.items = response.model.model.data
          this.loading = false;
        })
        .catch((error) => {
          this.$router.push('/ticket')
          
          this.loading = false;
        });
    },
    getUser() {
      this.loading = true;
      this.$reqApi("/user/show", { id: this.user.id })
        .then((response) => {
          this.wallet = response.wallet;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    submit() {
      this.loading_edit = true;
      this.$reqApi("/ticket-message/update", this.edit_dialog.item)
        .then((response) => {
          this.loadData();
          this.closeDialog();
          this.loading_edit = false;
        })
        .catch((error) => {
          this.loading_edit = false;
        });
    },
    avatar(user) {
      if (user && typeof user.avatar == "string") {
        return this.$getImage(user.avatar);
      }
      return "/image/login.png";
    },
    goToProfile(id) {
      window.open("/#/driver/profile/" + id);
    },
    deleteMessage(item) {
      this.delete_dialog.item = item.id;
      this.delete_dialog.show = true;
    },
    editMessage(item) {
      this.loading_edit = false;
      this.edit_dialog.item = item;
      this.edit_dialog.show = true;
    },
    removeItem() {
      this.loadData();
      this.closeDialog();
    },
    closeDialog() {
      this.edit_dialog.show = false;
      this.delete_dialog.show = false;
    },
  },
};
</script>
<style scoped>
.background_card{
  background-color: blueviolet;
}
</style>

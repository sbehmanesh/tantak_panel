<template>
  <div>
    <v-form v-model="valid" @submit.prevent="insertTicket()" class="px-3 pb-4">
      <v-row>
        <v-col cols="12" md="4">
          <UserSelectForm
            rules="require"
            v-model="users"
            :role-id="['5246f14d-1906-4e34-a412-8fb689d20f23']"
          />
        </v-col>
        <v-col cols="12" md="4">
          <amp-input text="موضوع" v-model="title" rules="require" />
        </v-col>
        <v-col cols="12" md="4">
          <amp-select
            text="دسته بندی"
            :items="ticket_group_items"
            v-model="ticket_group_id"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3"></v-col>
        <v-col cols="12" md="6">
          <amp-textarea
            text="متن درخواست"
            v-model="form.text"
            rules="require"
          />
        </v-col>
      </v-row>

      <v-col cols="12" md="12" class="text-center">
        <amp-button
          large
          icon="redo"
          class="my-1"
          color="error"
          text="انصراف"
          @click="back"
        />
        <amp-button
          large
          icon="done"
          class="my-1"
          type="submit"
          color="success"
          :loading="loading"
          :disabled="!valid || loading"
          text="ثبت"
        />
      </v-col>
    </v-form>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: { UserSelectForm },
  data() {
    return {
      valid: false,
      loading: false,
      users: [],
      title: "",
      ticket_group_id: "",
      form: {
        text: "",
      },
      ticket_group_items: [],
    };
  },
  mounted() {
    this.loadTicketGroup();
  },
  methods: {
    loadTicketGroup() {
      this.$reqApi("/ticket-group")
        .then((res) => {
          res.model.data.map((x) => {
            this.ticket_group_items.push({ text: x.name, value: x.id });
          });
        })
        .catch((err) => {
          return err;
        });
    },
    insertTicket() {
      if (this.ticket_group_id && this.users.length > 0) {
        this.loading = true;
        this.$reqApi("/ticket/insert", {
          user_id: this.users[0].id,
          title: this.title,
          ticket_group_id: this.ticket_group_id,
        })
          .then((response) => {
            this.loading = true;
            this.form.ticket_id = response.id;
            this.$reqApi("/ticket-message/insert", this.form)
              .then((response) => {
                this.$toast.success("پیغام با موفقیت ارسال شد");
                this.form.text = "";
                this.title = "";
                this.ticket_group_id = "";
                this.loading = false;
                this.$router.push(`/ticket/${this.form.ticket_id}`);
              })
              .catch((error) => {
                this.form.text = "";
                this.loading = false;
              });
          })
          .catch((error) => {
            this.loading = false;
          });
      } else {
        this.$toast.error("لطفا دسته بندی را انتخاب کنید");
      }
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

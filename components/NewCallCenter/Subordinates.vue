<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-alert type="warning" text outlined>
          در صورت انتخاب کارشناس انتقال دیتا بیین کارشناس های انتخاب شده جابه جا
          میشود
        </v-alert>
      </v-col>
      <v-col cols="6">
        <UserSelectForm
          text="سرپرست فعلی"
          v-model="seupervisor"
          url="user/list-employee"
          rules="require"
        />
      </v-col>
      <v-col cols="6">
        <amp-autocomplete
          :disabled="seupervisor.length < 0 && loading"
          text="کارشناس فعلی"
          v-model="operator"
          :items="operator_items"
          rules="require"
        />
      </v-col>
      <v-col cols="6">
        <UserSelectForm
          :disabled="seupervisor.length < 0 && loading"
          text="سرپرست جدید"
          v-model="new_supervisor"
          url="user/list-employee"
          rules="require"
        />
      </v-col>
      <v-col cols="6">
        <amp-autocomplete
          :disabled="new_supervisor.length < 0 && loading"
          text="کارشناس جدید"
          v-model="new_operator"
          :items="new_operator_items"
          rules="require"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  data: () => ({
    loading: false,
    seupervisor: [],
    new_supervisor: [],
    operator_items: [],
    new_operator_items: [],
    operator: "",
    new_operator: "",
    form: {},
    //      url=""
  }),

  watch: {
    seupervisor: {
      deep: true,
      handler() {
        if (this.seupervisor.length > 0) {
          this.setSubordinates("old", this.seupervisor[0].id);
        }
      },
    },
    new_supervisor: {
      deep: true,
      handler() {
        if (this.new_supervisor.length > 0) {
          this.setSubordinates("new", this.new_supervisor[0].id);
        }
      },
    },
  },
  methods: {
    setSubordinates(key, id) {
      this.loading = true;
      this.$reqApi("user/list-operator", { supervisor_id: id })
        .then((res) => {
          let sub_users = [];
          for (let i = 0; i < res.length; i++) {
            const x = res[i];
            let name =
              Boolean(x.first_name) && Boolean(x.last_name)
                ? `${x.first_name} ${x.last_name} | ${x.username}`
                : x.username;
            sub_users.push({
              text: name,
              value: x.id,
            });
          }
          console.log("items ==> ", sub_users);
          if (key == "old") {
            this.operator_items = sub_users;
            console.log("this.operator ==> ", this.operator);
          } else {
            this.new_operator_items = sub_users;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>

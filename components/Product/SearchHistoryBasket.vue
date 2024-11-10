<template>
  <div class="mt-3">
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="12">
        <v-autocomplete
          :filter="advanceSearch"
          clearable
          outlined
          autofocus
          dense
          prepend-inner-icon="outgoing_mail"
          v-model="sender"
          :items="sender_list"
          label=" ارجاع دهنده"
          placeholder="نام یا شماره همراه مورد نظر را وارد کنید"
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>
                <h1>
                  {{ data.item.text }}
                </h1>
              </v-list-item-title>
              <v-list-item-subtitle>
                <h1>
                  <small>
                    {{ data.item.username }}
                  </small>
                </h1>
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>

        <v-autocomplete
          clearable
          :filter="advanceSearch"
          v-model="gater"
          :items="geter_list"
          prepend-inner-icon="mark_email_read"
          dense
          outlined
          label="گیرنده"
          placeholder="نام یا شماره همراه مورد نظر را وارد کنید"
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>
                <h1>
                  {{ data.item.text }}
                </h1>
              </v-list-item-title>
              <v-list-item-subtitle>
                <h1>
                  <small>
                    {{ data.item.username }}
                  </small>
                </h1>
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>

        <v-autocomplete
          outlined
          clearable
          v-model="factor_number"
          :items="factor_number_list"
          prepend-inner-icon="description"
          dense
          placeholder=" شماره فاکتور مورد نظر را وارد کنید ..."
          label="شماره فاکتور"
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>
                <h1>
                  {{ data.item.text }}
                </h1>
              </v-list-item-title>
              <v-list-item-subtitle>
                <h1>
                  <small>
                    {{ data.item.user }}
                  </small>
                </h1>
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <amp-button
          block
          @click="setFilters"
          :disabled="!Boolean(sender) && !Boolean(factor_number) && !Boolean(gater)"
          text="جستوجو"
          height="38"
          color="green darken-1"
        />
      </v-col>
      <v-col cols="12" md="12"> </v-col>

      <v-row class="d-flex justify-center mb-1">
        <v-col cols="12">
          <v-divider></v-divider>
          <v-divider></v-divider>
          <v-divider></v-divider>
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <amp-button
        @click="myActivity"
        text="فعالیت های من"
        height="38"
        color="teal darken-1"
        type="submit"
        icon="event_note"
        class="ma-1"
      />
      <amp-button
        @click="clearAll"
        text="مشاهده همه"
        height="38"
        color="teal darken-1"
        type="submit"
        icon="filter_alt_off"
        class="ma-1"
      />
    </v-row>
  </div>
</template>
<script>
import { log } from "@chenfengyuan/vue-qrcode";

export default {
  props: {
    totalData: {
      default: [],
      type: Array,
    },
  },
  data() {
    return {
      searchInput: "",
      factor_number: "",
      sender: "",
      gater: "",
      user_login_id: "",
    };
  },
  mounted() {
    this.user_login_id = this.$store.state.auth.user.id;
  },
  computed: {
    sender_list() {
      let items = [];
      let data = this.totalData;
      let final_data = [];

      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        let text = "";
        if (Boolean(x.sender_username)) {
          if (Boolean(x.sender_first_name) && Boolean(x.sender_last_name)) {
            text = `${x.sender_first_name} ${x.sender_last_name}`;
          } else {
            text = "--";
          }
          items.push({
            username: x.sender_username,
            text: text,
            value: x.send_user_id,
          });
        }
      }
      return items;
    },
    geter_list() {
      let items = [];
      let data = this.totalData;

      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        let text = "";
        if (Boolean(x.geter_username)) {
          if (Boolean(x.geter_first_name) && Boolean(x.geter_last_name)) {
            text = `${x.geter_first_name} ${x.geter_last_name}`;
          } else {
            text = "--";
          }
          items.push({
            username: x.geter_username,
            text: text,
            value: x.get_user_id,
          });
        }
      }

      return items;
    },
    factor_number_list() {
      let items = [];
      let data = this.totalData;

      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        let step = this.$getItemEnum(
          this.$store.state.static.step_status_baskets,
          x.step
        );
        items.push({
          text: x.factor_number,
          user: ` ${step}`,
          value: x.factor_number,
        });
      }

      return items;
    },
  },

  methods: {
    setFilters() {
      let filters = {};
      if (Boolean(this.factor_number)) {
        filters["factor_number"] = {
          op: "=",
          value: this.factor_number,
        };
      }
      if (Boolean(this.sender)) {
        filters["send_user_id"] = {
          op: "=",
          value: this.sender,
        };
      }
      if (Boolean(this.gater)) {
        filters["get_user_id"] = {
          op: "=",
          value: this.gater,
        };
      }
      this.$emit("setFilters", filters);
    },
    clearAll() {
      this.gater = "";
      this.sender = "";
      this.factor_number = "";
      this.$emit("setFilters", {});
    },
    myActivity() {
      this.gater = "";
      this.sender = "";
      this.factor_number = "";

      let filters = {
        send_user_id: {
          op: "=",
          value: this.user_login_id,
        },
      };

      this.$emit("setFilters", filters);
    },

    advanceSearch(items, search, item) {
      return (
        Boolean(items.text.indexOf(search) > -1) ||
        Boolean(items.username.indexOf(search) > -1)
      );
    },
  },
};
</script>

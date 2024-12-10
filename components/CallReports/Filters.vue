<template>
  <div
    prominent
    outlined
    icon="search"
    class="elevation-0 pa-5"
    :disabled="loadingItems"
  >
    <v-row class="text-center justify-center">
      <v-col class="d-flex" cols="12" md="5">
        <amp-input
          v-model="src"
          cClass="ltr-item"
          text="مبدا تماس"
          prepend-inner-icon="phone_callback"
          placeholder=" شماره مورد نظر را وارد کنید"
        />
        <amp-input
          v-model="dst"
          cClass="ltr-item"
          text="مقصد تماس"
          prepend-inner-icon="call"
          placeholder=" مقصد مورد نظر را وارد کنید"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="d-flex" cols="12" md="5">
        <amp-jdate text="زمان ثبت تماس از" v-model="from" />
        <amp-jdate text="تا تاریخ" v-model="to" />
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" md="2">
        <amp-button
          @click="search"
          text="جستوجو"
          height="38"
          color="primary"
          type="submit"
          icon="search"
          class="mt-8"
          :disabled="loadingItems"
        />
      </v-col>

      <v-col cols="12" md="12" v-if="searchResult.length > 0">
        <v-card class="px-4 elevation-0">
          <v-col cols="12" class="mb-5 text-end">
            <v-banner single-line>
              <h1 class="font_18">گزارش عمل کرد کل</h1>
              <h1 class="grey--text">
                <small> تماس های ورودی (از سمت تنتاک) </small>
                <small>
                  و همجنین تماس های خروجی تماس هایی است که ار سمت کاربرانی غیر
                  پرسنل تنتاک گرفته شده</small
                >
              </h1>
            </v-banner>
          </v-col>
          <v-row class="mx-1">
            <v-col
              cols="12"
              md="3"
              v-for="(i, index) in statistics"
              :key="index"
              class="ma-0 pa-0"
              @click="setStatusFilter(i.value, i.items)"
            >
              <v-card
                height="100"
                :disabled="loadingItems"
                outlined
                class="elevation-3 ma-2 pl-3 align-center rounded-0 d-flex card-style2 text-end"
                :class="selected == i.value ? ' elevation-4 ' : ''"
              >
                <v-card
                  height="100%"
                  width="3"
                  class="line-class line-class-hover elevation-0"
                  :class="selected == i.value ? 'selected-card' : ''"
                />
                <div
                  class="phone-calss pa-3 align-center phone-calss-hover mr-2"
                  :class="selected == i.value ? 'selected-card' : ''"
                >
                  <v-icon color="white" size="20" class="">
                    {{ i.icon }}
                  </v-icon>
                </div>

                <h1 class="mr-2">
                  <small class="font_13">
                    {{ i.text }}
                  </small>
                  <br />

                  <small v-if="Boolean(i.time)">
                    <v-icon size="19" color="grey"> timer </v-icon>
                    {{ i.time }}
                  </small>
                  <small v-else>
                    <v-icon size="19" color="grey"> timer </v-icon>
                    00:00:00
                  </small>
                </h1>

                <v-spacer></v-spacer>

                <v-progress-circular
                  v-if="loadingItems"
                  :width="3"
                  color="grey"
                  :size="15"
                  indeterminate
                ></v-progress-circular>
                <div v-else class="d-flex">
                  <v-icon color="grey"> trending_down </v-icon>

                  <h1 class="grey--text font_15">
                    {{ $price(i.count) }}
                  </h1>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    loadingItems: {
      default: false,
      type: Boolean,
    },
    searchResult: {
      default: [],
      type: Array,
    },
  },
  data: () => ({
    status_call: [
      {
        text: "همه تماس ها",
        value: "all",
        icon: "filter_alt_off",
        time: "",
      },
      {
        text: "  تماس های ورودی به خروجی",
        value: "incoming_to_out_calls",
        icon: "phone_callback",
        time: "",
      },
      {
        text: "  تماس های خروجی به ورودی",
        value: "out_to_incoming_calls",
        icon: "phone_forwarded",
        time: "",
      },

      {
        text: "تماس های داخلی (وردی به ورودی)",
        value: "incoming_to_incoming_calls",
        icon: "wifi_protected_setup",
        time: "",
      },

      {
        text: "تماس های پاسخ داده شده",
        value: "answered_calls",
        icon: "phone_in_talk",
        time: "",
      },
      {
        text: "تماس های بی پاسخ  ",
        value: "missed_calls",
        icon: "phone_missed",
        time: "",
      },

      // { text: "پاسخ داده شده", value: "ANSWERED", icon: "call"      time:"" },
      { text: "ازدست رفته", value: "MISSED", icon: "ring_volume" },
      { text: "قطع شده در IVR", value: "s", icon: "pending" },
      // { text: "ناموفق", value: "FAILED", icon: "phone_disabled" },
    ],
    status: "",
    loading: true,
    switch1: true,
    switch2: false,
    from: "",
    to: "",
    search_dst: "",
    dst: "",
    src: "",
    selected: "",
    total_dst: [],
    user_list_internal: [],
    all_users: [],
  }),
  computed: {
    statistics() {
      let items = [];

      let data = JSON.parse(JSON.stringify(this.searchResult));
      for (let i = 0; i < this.status_call.length; i++) {
        const element = this.status_call[i];

        // ******************************************************************************
        if (element.value == "all") {
          let array = data;
          element["count"] = array.length;
          element["items"] = array;
          if (array.length > 0) {
            this.callTimeCalculation(array, 0);
          }
        }
        // ******************************************************************************
        else if (element.value == "incoming_to_out_calls") {
          let array = data.filter((x) => x.cnum < 10000 && x.dst > 10000);
          element["count"] = array.length;
          element["items"] = array;
          if (array.length > 0) {
            this.callTimeCalculation(array, 1);
          }
        }

        // ******************************************************************************
        else if (element.value == "out_to_incoming_calls") {
          let array = data.filter((x) => x.cnum > 10000 && x.dst < 10000);
          element["items"] = array;
          element["count"] = array.length;
          if (array.length > 0) {
            this.callTimeCalculation(array, 2);
          }
        }

        // ******************************************************************************
        else if (element.value == "incoming_to_incoming_calls") {
          let array = data.filter((x) => x.cnum < 10000 && x.dst < 10000);
          element["count"] = array.length;
          element["items"] = array;
          if (array.length > 0) {
            this.callTimeCalculation(array, 3);
          }
        }
        // ******************************************************************************
        else if (element.value == "answered_calls") {
          let array = data.filter((x) => x.billsec != "00:00");
          element["count"] = array.length;
          element["items"] = array;
          if (array.length > 0) {
            this.callTimeCalculation(array, 4);
          }
        }
        // ******************************************************************************
        else if (element.value == "missed_calls") {
          let array = data.filter((x) => x.billsec == "00:00");
          element["count"] = array.length;
          element["items"] = array;
          if (array.length > 0) {
            this.callTimeCalculation(array, 5);
          }
        }

        // ******************************************************************************
        else {
          let array = data.filter((x) => x.disposition == element.value);
          element["count"] = array.length;
          element["items"] = array;
        }
        let total_secend = 0;
        for (let index = 0; index < data.length; index++) {
          const x = data[index];
          if (x.disposition == element.value) {
            let [minutes, secend] = x.billsec.split(":").map(Number);
            total_secend += minutes * 60 + secend;
            if (total_secend > 0) {
              let hours = Math.floor(total_secend / 3600);
              let remainder = total_secend % 3600;
              let minutes = Math.floor(remainder / 60);
              let secs = remainder % 60;
              element.time = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
            }
          }
        }

        items.push(element);
      }

      return items;
    },
  },

  watch: {
    search_dst() {
      if (Boolean(this.search_dst)) {
        let find = this.user_list_internal.find(
          (x) => x.value == this.search_dst
        );

        if (Boolean(find)) {
          this.dst = find.internal_port;
        }
      }
    },
    switch1() {
      this.switch1 != this.switch2;
    },
  },
  mounted() {
    this.getineralList();
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.loading = true;
      let data = [];
      let items = [];
      let internal = [];
      let all_user = [];

      this.$reqApi("/user", { row_number: 5000 })
        .then((res) => {
          data = res.model.data;
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            let name = "";
            if (Boolean(x.first_name) && Boolean(x.last_name)) {
              name = `${x.first_name} ${x.last_name}`;
            } else {
              name = x.username;
            }
            if (Boolean(x.internal_port)) {
              internal.push({
                text: name,
                username: x.username,
                internal_port: x.internal_port,
                sub_title: ` داخلی : ${x.internal_port}`,
                value: x.id,
              });
            } else {
              all_user.push({
                text: name,
                sub_title: x.username,
                value: x.username,
              });
            }
          }
          this.user_list_internal = internal;
          this.all_users = all_user;
          let total_data = [...internal, ...all_user];
          this.$emit("totalUser", total_data);
          this.$emit("personal", internal);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    getineralList() {
      this.loading = true;
      let data = [];
      let items = [];
      this.$reqApi("/internal")
        .then((res) => {
          data = res.model.data;
          for (let i = 0; i < data.length; i++) {
            const x = data[i];
            items.push({
              text: x.server_name,
              sub_title: `${x.start_port}/${x.end_port}`,
              value: x.id,
            });
          }
          this.total_dst = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    advanceSearch(items, search) {
      return (
        Boolean(items.text.indexOf(search) > -1) ||
        Boolean(items.sub_title.indexOf(search) > -1)
      );
    },
    search() {
      let filter = {};
      let phone = "";
      if (Boolean(this.dst)) {
        if (this.dst.length == 11) {
          phone = `9${this.dst}`;
        } else {
          phone = this.dst;
        }
        filter["dst"] = phone;
      }
      if (Boolean(this.from)) {
        filter["from"] = this.from;
      }
      if (Boolean(this.src)) {
        filter["src"] = this.src;
      }
      if (Boolean(this.to)) {
        filter["to"] = this.to;
      }
      this.$emit("setFilter", filter);
      this.selected = "";
    },
    setStatusFilter(value, items) {
      this.selected = value;
      this.$emit("setStatusFilter", [value, items]);
    },
    callTimeCalculation(data, key) {
      let total_secend = 0;

      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        let [minutes, secend] = x.billsec.split(":").map(Number);
        total_secend += minutes * 60 + secend;
        if (total_secend > 0) {
          let hours = Math.floor(total_secend / 3600);
          let remainder = total_secend % 3600;
          let minutes = Math.floor(remainder / 60);
          let secs = remainder % 60;
          this.status_call[key].time = `${hours
            .toString()
            .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
        }
      }
    },
  },
};
</script>
<style scoped>
.card-style {
  border-radius: 7px;
  border: 1px solid #00000034;
}
.card-style2 {
  border-radius: 8px !important;
  filter: hue-rotate(3.142rad);
  filter: grayscale(0.7);


}
.card-style2:hover {
  color: #000000bb;
  cursor: pointer;
  transform: scale3d(1.02, 1.02, 1.02);
  transition: all 0.4s ease !important;
  filter: opacity(1);

}

.selected-card {
  background: linear-gradient(to top, #4582c783, #245bc2ad, #000000) !important;
}

.phone-calss {
  background: linear-gradient(to top, #4582c7a2, #2e68d4ad, #03405c) !important;
  border-radius: 10px !important;
}
.card-style2:hover .phone-calss-hover {
  background: linear-gradient(to top, #4582c780, #4284fdad, #03405c) !important;
  transition: all 0.8s ease !important;
}

.card-style2:hover .line-class-hover {
  background: linear-gradient(to top, #4582c783, #245bc2ad, #000000) !important;
}
.card-text-style {
  border: 1px solid rgba(0, 0, 0, 0.116);
  border-radius: 5px !important;
  background: #ff5e0070;
}
</style>

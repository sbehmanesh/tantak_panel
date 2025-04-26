<template>
  <div
    prominent
    outlined
    icon="search"
    class="elevation-0 pa-5"
    :disabled="loadingItems"
  >
    <v-row class="text-center justify-center">
      <v-col cols="6" :md="!show_input_number ? 2 : 4">
        <amp-select
          text="نوع گزارش"
          :items="call_type_items"
          @input="call_types"
          firstSelect
        />
      </v-col>
      <v-col v-if="!show_input_number" class="d-flex justify-content-center" cols="12" md="4">
        <amp-input
          v-model="cnum"
          cClass="ltr-item"
          text="مبدا تماس"
          prepend-inner-icon="phone_callback"
          placeholder=" شماره مورد نظر را وارد کنید"
          rules="require"
        />
        <amp-input
          v-model="dst"
          cClass="ltr-item"
          text="مقصد تماس"
          prepend-inner-icon="call"
          placeholder=" مقصد مورد نظر را وارد کنید"
          rules="require"
        />
      </v-col>
      <v-col cols="6" :md="!show_input_number ? 2 : 4">
        <amp-select
          text="دسته بندی بر اساس تاریخ"
          :items="date_items"
          @input="is_date"
          rules="require"
          firstSelect
        />
      </v-col>
      <v-col v-if="show_date_picker" class="d-flex justify-content-center" cols="12" md="3">
        <amp-jdate text="زمان ثبت تماس از" v-model="from" />
        <amp-jdate text="تا تاریخ" v-model="to" />
      </v-col>
      <v-col cols="12" :md="show_input_number ? 2 : 4">
        <amp-button
          @click="search"
          text="جستجو"
          height="38"
          color="primary"
          type="submit"
          icon="search"
          class="mt-8"
          :disabled="loadingItems"
        />
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
    call_type: null,
    show_date_picker: false,
    show_input_number: false,
    date_items: [                                      // تعریف فیلتر بر اساس تاریخ برای کاربر
      { text: "خیر", value: false },
      { text: "بله", value: true },
    ],
    default_type: { text: "همه", value: "all" },
    call_type_items: [                                          // تعریف نوع تماس برای کاربر
      { text: "همه", value: "all" },
      { text: " داخلی به داخلی", value: "port_to_port" },
      { text: " داخلی به خارجی", value: "port_to_phone" },
      { text: " خارجی به خارجی", value: "phone_to_phone" },
      { text: " خارجی به داخلی", value: "phone_to_port" },
    ],
    loading: true,
    from: "",
    to: "",
    dst: "",
    cnum: "",
    selected: "",
  }),
  methods: {
    call_types(selected_type) {
      // نوع تماس رو چک میکنیم و براساس اون فیلتر ها و ui رو کنترل میکنیم
      this.call_type = selected_type;
      if (selected_type == "all") {
        this.show_input_number = true;
      } else {
        this.show_input_number = false;
      }
    },
    is_date(selected_is_date) {
      //چک میکنیم که کاربر ایا گزینه فیلتر با تاریخ رو انتخاب کرده یا نه و براساس اون دیتا رو پر و ارسال میکنیم
      this.show_date_picker = selected_is_date;
      if (!selected_is_date) {
        this.from = "";
        this.to = "";
      }
    },
    search() {
      const filter = {};
      if (this.call_type && this.call_type !== "all") {
        filter.type = this.call_type;
        if (this.dst) {
          filter.getter = this.dst;
        }
        if (this.cnum) {
          filter.caller = this.cnum;
        }
      } else if (this.call_type === "all") {
        filter.type = "all";
      }
      if (this.show_date_picker) {
        filter.with_date = true;

        if (this.from) {
          filter.start_at = this.from;
        }

        if (this.to) {
          filter.end_at = this.to;
        }
      } else {
        filter.with_date = false;
        delete filter.start_at;
        delete filter.end_at;
      }
      this.$emit("setFilter", filter);
      this.selected = "";
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

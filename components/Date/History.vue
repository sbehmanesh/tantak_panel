<template>
  <div class="d-flex my-4 mt-7 ml-2 mr-4">
    <div
      :class="
        is_mobile
          ? 'd-flex align-center flex-column mr-12'
          : 'd-flex align-center'
      "
    >
      <span> انتخاب بازه زمانی از </span>
      <amp-jdate v-model="date_score_of" :max="now" />
      <span> تا </span>
      <amp-jdate v-model="date_score_to" :max="now" />
      <amp-button
        class="mt-1"
        text="جستجو بازه زمانی"
        @click="selecDate()"
        :loading="loading"
        :disabled="!Boolean(date_score_to)"
      />
    </div>
  </div>
</template>

<script>
let jmoment = require("moment");
export default {
  data() {
    return {
      filters: "",
      date_score_of: "",
      date_score_to: "",
      now: "",
      loading: false,
    };
  },
  computed: {
    is_mobile() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },
  },
  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
    this.date_score_of = jmoment(
      this.$moment(this.now).subtract(30, "days")
    ).format("YYYY-MM-DD");
    this.date_score_to = jmoment().format("YYYY-MM-DD");
  },
  methods: {
    selecDate() {
      this.loading = true;
      this.filters = {
        created_at: {
          op: "between",
          from: this.date_score_of + " 00:00:00",
          to: this.date_score_to + " 23:59:59",
        },
      };
      setTimeout(() => {
        this.loading = false;
      }, 700);
      this.$emit("setTime", this.filters);
    },
  },
};
</script>

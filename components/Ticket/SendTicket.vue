<template>
  <v-form v-model="valid" :disabled="loading" @submit.prevent="submit()">
    <v-row dense>
      <v-col cols="12" md="12" class="pb-4">
        <v-divider />
      </v-col>
      <v-col cols="10">
        <amp-textarea
          text="متن"
          :rows="5"
          rules="require"
          :show_lable="false"
          v-model="form.text"
        ></amp-textarea>
      </v-col>
      <v-col cols="2" class="pl-4 text-center">
        <amp-button
          large
          text="ارسال"
          type="submit"
          color="success"
          :loading="btn_loading"
          :disabled="!valid || loading"
        />
      </v-col>
      <v-col
        :cols="is_mobile ? '12' : '10'"
        :class="
          is_mobile
            ? 'px-3 my-5 center-div d-flex flex-wrap'
            : 'px-3 mb-3 center-div'
        "
      >
        <v-chip
          class="ma-2 green--text"
          v-for="(i, item) in items_dafult_answer"
          outlined
          :key="item"
          color="green"
          @click="setAnswetToBox(i.text)"
        >
          {{ i.title }}
        </v-chip>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: { modelId: { default: null } },
  data: () => ({
    valid: false,
    loading: true,
    items_dafult_answer: [],
    btn_loading: false,
    form: {
      text: "با سلام و روز بخیر.",
      ticket_id: "",
    },
  }),
  computed: {
    is_mobile() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },
  },
  mounted() {
    this.loading = true;
    this.form.ticket_id = this.modelId;
    this.items_dafult_answer =
      this.$store.state.setting.default_question_answer;
    this.loading = false;
  },
  methods: {
    submit() {
      this.loading = true;
      this.btn_loading = true;
      let form = { ...this.form };
      let form_text = `
            <span style="font-size:15px">
                ${form.text}  
            </span>
              `;
      form.text = form_text;
      this.$reqApi("/ticket-message/insert", form)
        .then((response) => {
          this.form.text = "";
          this.$toast.success("اطلاعات ثبت شد");
          this.sendData();
          this.loading = false;
          this.btn_loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.btn_loading = false;
        });
    },
    sendData() {
      this.$emit("getData", true);
    },
    setAnswetToBox(data) {
      this.form.text = "با سلام و روز بخیر .";
      this.form.text = this.form.text + data;
    },
  },
  sendData() {
    this.$emit("getData", true);
  },
  setAnswetToBox(data) {
    this.form.text = data;
  },
};
</script>

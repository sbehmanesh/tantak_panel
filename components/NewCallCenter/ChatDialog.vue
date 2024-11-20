<template>
  <div>
    <v-dialog persistent v-model="dialog" width="750">
      <v-card class="pa-5 card-style-main" :disabled="loading">
        <v-row single-line class="pa-4 d-flex alin-center">
          <h1>پیام های تاریخچه</h1>
          <v-spacer></v-spacer>
          <v-btn icon text @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-row>
        <v-row class="justify-center align-center">
          <v-col cols="12" md="6">
            <amp-input
              text="شماره فاکتور مورد نظر را وارد کنید"
              rules="require,number"
              v-model="factor_number"
              cClass="ltr-item"
            />
          </v-col>
          <amp-button
            text="تایید"
            height="38"
            color="teal darken-2"
            @click="callApi"
            class="ma-1"
            :loading="loading"
            :disabled="loading || !factor_number"
          />
        </v-row>
        <div v-if="!loading && Boolean(factor_number)">
          <v-timeline color="white" dense>
            <v-timeline-item v-for="(x, i) in result_search" :key="i" dense>
              <template v-slot:icon>
                <div class="icon-calss">
                  <v-icon x-large color="white"> account_circle </v-icon>
                </div>
              </template>
              <v-card class="elevation-3 pa-3">
                <span>
                  ارسال کننده :‌
                  {{ x.sender_first_name }} {{ x.sender_last_name }}
                </span>
                <span
                  v-if="Boolean(x.geter_first_name)"
                  class="font_13 grey--text"
                >
                  گیرنده :‌
                  {{ x.geter_first_name }} {{ x.geter_last_name }}
                </span>

                <v-banner>
                  <v-col cols="12" class="ma-0 pa-0">
                    <v-card outlined class="pr-2 py-3 grey lighten-4">
                      <span class="my-2">
                        {{ x.message }}
                      </span>
                    </v-card>
                  </v-col>
                </v-banner>
                <div class="d-flex align-center mt-1">
                  <small>
                    <v-icon color="grey" size="12">
                      fiber_manual_record
                    </v-icon>
                    {{ x.text }}
                  </small>
                  <v-spacer></v-spacer>
                  <h1 class="font_12">
                    {{ $toJalali(x.created_at) }}
                  </h1>
                </div>
              </v-card>
            </v-timeline-item>
          </v-timeline>
          <div class="my-12 text-center" v-if="result_search.length == 0 && !start_search">
            <v-icon color="grey lighten-1" size="45"> feedback </v-icon>
            <br>
            <span class="font_16 grey--text">برای شماره فاکتور مورد نظر پیامی ثبت نشده</span>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: {
      default: false,
    },
    url: {
      default: "",
      type: String,
    },
  },

  data: () => ({
    result_search: [],
    extra_btn: [],
    factor_number: "",
    loading: false,
    start_search: true,
  }),
  mounted() {},

  methods: {
    callApi() {
      this.loading = true;
      let filters = {
        factor_number: {
          op: "=",
          value: this.factor_number,
        },
      };
      this.$reqApi(this.url, {
        filters: filters,
        row_number: 3000,
      })
        .then((res) => {
          let items = res.model.data.sort((a, b) => {
            a.created_at - b.created_at;
          });
          this.result_search = items;
          this.loading = false;
          this.start_search = false;
        })
        .catch((err) => {
          this.loading = false;
          
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoed>
.icon-calss {
  border-radius: 100%;
  background: linear-gradient(
    to top,
    #da450a81,
    rgb(240, 130, 80),
    #a83601
  ) !important;
}

.card-style-main {
  background-color: #fdfdfd !important;
}
.theme--light.v-timeline::before {
  background: rgba(255, 255, 255, 0) !important;
}
</style>

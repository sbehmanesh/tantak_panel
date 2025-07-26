<template>
  <v-row class="d-flex align-center justify-center pa-5">
    <v-col cols="12" md="4" v-for="(x, i) in metabse_list" :key="i">
      <v-card
      outlined
        class="pa-1 text-center elevation-8 grey lighten-4"
        
      >
        <v-col cols="12" class="text-center my-2 mb-6">
          <v-toolbar  dark class="pa-5 d-flex align-center" color="blue-grey">
            <v-icon
              class="white lighten-1"
              style="border-radius: 100%"
              size="80"
              color="blue-grey darken-1"
            >
              stacked_bar_chart
            </v-icon>
            <v-spacer></v-spacer>
            <div class="text-end mr-3">
              <span class="font_16">
                
                {{ x.title }}
              </span>
              <br />
              <strong class="font_12 white--text">
                نوع گزارش :‌ {{ x.type }}</strong
              >
            </div>
          </v-toolbar>
        </v-col>

        <v-row class="d-flex align-top justify-center">
          <div class="text-center mb-3">
            <!-- <h1 class="font_18">
              {{ x.title }}
            </h1> -->
          </div>

          <v-col cols="12" class="mb-3">
            <v-btn width="250" @click="handleClick(x)" outlined color="blue-grey"
              ><strong class="font_15"> مشاهده گزارش </strong>
              <v-icon> whatshot </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-dialog width="380" v-if="open_dialog" v-model="open_dialog" persistent>
      <v-card class="pa-5 pt-0">
        <v-banner class="text-center">
          <h1 class="font_13">گزارش گیری متابیس</h1>
          <small> پر کردن تمامی موارد اجباری است </small>
        </v-banner>
        <v-form v-model="valid">
          <v-col cols="12">
            <amp-input
              v-for="(x, i) in body"
              :key="i"
              :text="x.fa_name"
              v-model="form[x.en_name]"
              rules="require"
            />
          </v-col>
          <v-row>
            <v-col cols="12" class="text-center">
              <AmpButton
                height="35"
                text="تایید"
                color="blue-grey"
                class="ma-1"
                @click="getIfrem"
                :disabled="!valid"
              />
              <AmpButton
                height="35"
                text="انصراف"
                color="error"
                class="ma-1"
                @click="closeDialog"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
    <v-col cols="12">
      <MetabaseLogs
        :no-select="true"
        :url-metabase="metabase_url"
        :item="select_item"
      />
    </v-col>
  </v-row>
</template>

<script>
import MetabaseLogs from "@/components/Cartabl/MetabaseLogs.vue";
export default {
  components: { MetabaseLogs },
  data: () => ({
    headers: [],
    valid: false,
    metabse_list: [],
    body: [],
    form: {},
    select_item: {},
    open_dialog: "",
    metabase_url: null,
    title: "گزارشات متابیس من",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.getMetabaseList();
  },
  methods: {
    handleClick(x){
      this.form["id"] = x.id;
      if (x.request_body.length == 0) {
        this.getIfrem()
      }else{
        this.open_dialog = true;
        this.body = x.request_body;
        this.select_item = x;
      }
    },
    getMetabaseList() {
      this.$reqApi("metabase")
        .then((res) => {
          this.metabse_list = res.model.data;
        })
        .catch((err) => {});
    },
    getLog(item) {
      this.open_dialog = true;
      this.form["id"] = item.id;
      this.body = item.request_body;
      this.select_item = item;
    },
    async getIfrem() {
      let form = { ...this.form };
      const result = await this.$reqApi("metabase/get-my-iframe-url", form);
      this.metabase_url = result;
      this.open_dialog = false;
    },
    closeDialog() {
      this.open_dialog = false;
      this.form = {};
      this.select_item = {};
      this.metabase_url = null;
    },
  },
};
</script>

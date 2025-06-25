<template>
  <v-row class="d-flex justify-center mt-10">
    <v-col cols="12" md="5">
      <div class="mr-3 mb-1">
        <h1 class="font_20 mb-1">داشبورد متابیس</h1>
        <span class="grey--text font_12">
          نمایش اطلاعات تحلیلی و آماری از طریق سیستم متابیس
        </span>
      </div>
      <template v-if="!error && !Boolean(urlMetabase) && !noSelect">
        <amp-select
          :disabled="Boolean(loading)"
          v-if="dashboards.length > 1"
          v-model="select_dashbord"
          :items="dashboards"
          label="انتخاب داشبورد"
        />
      </template>
    </v-col>
    <v-col cols="12" v-if="Boolean(select_dashbord) || Boolean(urlMetabase)">
      <v-card class="show-card pa-8">
     
        <iframe
          :src="
            Boolean(this.urlMetabase) ? this.urlMetabase : current_dashboardUrl
          "
          class="metabase-iframe"
          frameborder="0"
          @load="iframeLoaded"
        ></iframe>
      </v-card>
    </v-col>
    <v-col cols="12">
      <div v-if="loading" class="loading-state">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <span class="mt-4">در حال بارگذاری داشبورد...</span>
      </div>

      <div class="error-state" v-else-if="error">
        <v-alert
          outlined
          text
          type="error"
          prominent
          class="d-flex align-center"
        >
          خطا در بارگذاری داشبورد

          <v-btn
            small
            outlined
            @click="initDashboard"
            color="blue-grey"
            class="mr-5"
          >
            <small> تلاش مجدد </small>
          </v-btn>
        </v-alert>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    urlMetabase: {
      default: false,
      require: false,
    },
    noSelect: {
      default: false,
      require: false,
    },
  },
  data() {
    return {
      dashboards: [],
      loading: false,
      error: null,
      select_dashbord: null,
      metabase_url: "https://metabase.tantak.ir",
      token_expiry: 15, // مدت اعتبار توکن (دقیقه)
    };
  },

  computed: {
    current_dashboardUrl() {
      if (this.dashboards.length > 0) {
        let current_dashboardUrl = this.dashboards.find(
          (x) => x.value == this.select_dashbord
        );
        return current_dashboardUrl.iframeUrl;
      }
      return "";
    },
  },

  mounted() {
    if (Boolean(this.urlMetabase)) {
      this.newSetDashbord();
    } else {
      this.initDashboard();
    }
  },

  methods: {
    async initDashboard() {
      try {
        this.loading = true;
        this.error = null;
        await this.getKeySetting();
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        this.error = error;
      }
    },

    async getKeySetting() {
      this.loading = true;
      this.error = null;

      try {
        const res = await this.$reqApi("/setting", {
          filters: { op: "=", key: "metabase" },
          row_number: 30000,
        });

        const data = res.model.data;
        this.dashboards = await this.setDashbords(data);
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
    async setDashbords(data) {
      const result = await Promise.all(
        data.map(async ({ value_2, value }) => {
          const get_token = this.$metabase.getToken.bind(this.$metabase);
          return {
            text: value,
            value: +value_2,
            iframeUrl: `${this.metabase_url}/embed/dashboard/${await get_token(
              value_2,
              this.token_expiry
            )}`,
          };
        })
      );
      return result;
    },
    // async newSetDashbord() {
    //   const result = this.urlMetabase;
    //   return result;
    // },
    iframeLoaded() {
      this.$emit("loaded");
      this.$toast.success("اتصال به  متابیس  موفقیت آمیز بود");
    },
  },
};
</script>

<style scoped>
.metabase-container {
  padding: 20px;
  height: 100%;
}

.metabase-iframe {
  width: 100%;
  height: calc(90vh - 150px);
  border: 3px solid rgba(201, 201, 201, 0.767);

  background: transparent;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  font-size: 18px;
  color: var(--v-primary-base);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>

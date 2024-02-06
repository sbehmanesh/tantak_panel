<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <v-col cols="12" md="3">
        <amp-autocomplete
          text="سطح"
          rules="require"
          :items="$store.state.static.country_division"
          v-model="form.level"
        ></amp-autocomplete>
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="
          form.level == 'township' ||
          form.level == 'district' ||
          form.level == 'city' ||
          form.level == 'rural_district' ||
          form.level == 'village'
        "
      >
        <amp-autocomplete
          text="والد"
          v-model="form.parent_id"
          v-if="state"
          :items="state_filtered"
          rules="require"
        ></amp-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input text="ترتیب نمایش" v-model="form.sort"></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input text="نام" v-model="form.name" rules="require" />
      </v-col>
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="انصراف"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        text="تایید"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loader"
        :loading="loader"
      ></amp-button>
    </v-row>
  </v-form>
</template>

<script>
import { watch } from "vue";
export default {
  props: {
    modelId: {
      require: false,
      default: false
    }
  },
  data() {
    return {
      valid: true,
      loader: false,
      parent_items: [],
      state: [],
      state_filtered: [],
      form: {
        sort: 0,
        name: "",
        level: "",
        parent_id: ""
      }
    };
  },
  watch: {
    "form.level"() {
      this.state_filtered = this.state;
      let type_filter = "province";
      switch (this.form.level) {
        case "province":
          type_filter = "";
          break;
        case "township":
          type_filter = "province";
          break;
        case "district":
          type_filter = "township";
          break;
        case "city":
          type_filter = "district";
          break;
        case "rural_district":
          type_filter = "city";
          break;
        case "village":
          type_filter = "rural_district";
          break;
        default:
          break;
      }
      this.state_filtered = this.state.filter(x => {
        if (x.level == type_filter) {
          return true;
        }
      });
    }
  },
  beforeMount() {
    this.setLevelState();
  },
  mounted() {
    if (Boolean(this.modelId)) {
      setTimeout(() => {
        this.loadData();
      }, 300);
    }
  },
  methods: {
    submit() {
      this.loader = true;
      let form = { ...this.form };
      let url = this.modelId
        ? "country-division/update"
        : "country-division/insert";
      this.$reqApi(url, form)
        .then(res => {
          this.loader = false;
          this.back();
        })
        .catch(err => {
          this.loader = false;
        });
    },
    loadState() {
      return new Promise((response, rej) => {
        this.$reqApi("/shop/country-division", { row_number: 3000000 })
          .then(res => {
            response(res.model.data);
          })
          .catch(err => {
            return err;
          });
      });
    },
    setLevelState() {
      this.loadState()
        .then(res => {
          res.forEach(element => {
            this.state.push({
              text: element.name,
              value: element.id,
              parent_id: element.parent_id,
              level: element.level,
              cd2_level: element.cd2_level
            });
          });
        })
        .catch(err => {
          return err;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi("country-division/show", { id: this.modelId })
        .then(res => {
          this.form.name = res.model.name;
          this.form.level = res.model.level;
          this.form.sort = res.model.sort;
          this.form.parent_id = res.model.parent_id;
          this.form.id = res.model.id;
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
        });
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/country-division");
      }
    }
  }
};
</script>

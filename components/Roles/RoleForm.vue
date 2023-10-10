<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <v-col cols="12" md="12">
        <amp-input text="عنوان" v-model="form.name" rules="require"></amp-input>
      </v-col>
      <v-col cols="12" md="6" v-for="(item, i) in action" :key="i">
        <v-card class="h-max pa-4">
          <v-card-title class="d-flex justify-lg-space-between">
            <span class="font_16"> {{ item.name }} </span>
            <amp-help :text="item.description" v-if="item.description" />
          </v-card-title>
          <v-divider></v-divider>
          <div class="d-flex flex-wrap">
            <v-checkbox
              class="ml-8"
              v-for="(child, j) in item.childs"
              :key="j"
              v-model="form.action_id"
              :label="child.name"
              :value="child.id"
            />
          </div>
        </v-card>
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
        :text="modelId ? 'ویرایش' : 'افزودن'"
        type="submit"
        icon="done"
        class="ma-1"
        :loading="loader"
      ></amp-button>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: {
      require: false,
      default: false
    },
    updateUrl: { default: "role/update" },
    createUrl: { default: "role/insert" },
    showUrl: { default: "role/show" }
  },
  data() {
    return {
      valid: true,
      loader: false,
      panel: [],
      form: {
        name: "",
        action_id: [],
        sort: "1",
        id: ""
      }
    };
  },
  computed: {
    action() {
      let items = this.$store.state.setting.actions.filter((x) => x.parent == null)
        .map(item => {
          let childs = this.$store.state.setting.actions.filter(
            x => x.parent == item.id
          );
          childs = [item, ...childs];
          return { ...item, childs };
        });

      if (this.panel.length == 0) {
        this.panel = items.map((x, i) => i);
      }
      return items;
    }
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.loader = true;
      let form = { ...this.form };
      let url = this.modelId ? this.updateUrl : this.createUrl;
      this.$reqApi(url, form)
        .then(response => {
          this.loader = false;
          this.back();
        })
        .catch(err => {
          this.loader = false;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(response => {
          this.form.id = this.modelId;
          this.form.name = response.model.name;
          this.setActions(response.model.actions)
          console.log( 'setAction', response.model.actions)
          console.log( 'col', response.model)
          this.loader = false;
        })
        .catch(error => {
          this.loader = false;
        });
    },
    setActions(data){
      data.forEach(element => {
        this.form.action_id.push(element.id)
      });
    },
    back() {
      this.$router.back();
    }
  }
};
</script>

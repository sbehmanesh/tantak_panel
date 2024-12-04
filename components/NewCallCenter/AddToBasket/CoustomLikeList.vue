<template>
  <v-expansion-panels>
    <v-expansion-panel class="expan-style">
      <v-expansion-panel-header> موزد علاقه ها </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row class="align-center justify-end ma-2">
          <v-col cols="12" md="4" v-for="(x, i) in list" :key="i">
            <v-card
              class="d-flex justify-space-between align-center pa-2 elevation-1 card-style"
              outlined
            >
              <div>
                <h1>
                  {{ x.package.name }}

                  <br />
                  <small> قیمت پکیج {{ $price(x.package.price) }} </small>
                  <br />

                  <small> شماره پکیج {{ x.package.package_number }}</small>
                </h1>
              </div>

              <amp-like :item="x" :liked="x.status == 'valid' ? true : false" />
            </v-card>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    item: {
      require: false,
      default: false,
    },
  },
  data: () => ({
    list: [],
  }),
  beforeMount() {
    this.getList();
  },
  methods: {
    getList() {
      this.$reqApi("like")
        .then((res) => {
          this.list = res.model.data;
          let items = [];
          for (let i = 0; i < res.model.data.length; i++) {
            const x = res.model.data[i];
            if (Boolean(x.package_id)) {
              x["value"] = x.package_id;
              x["type"] = "Package";
            }
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style scoped>
.icon-style {
}
.icon-style:hover {
  cursor: pointer;
}
.expan-style {
  border-radius: 8px;
  border: 1px solid rgba(27, 27, 27, 0.123);
}
.card-style {
  opacity: 0.68;
}
.card-style:hover {
  transform: translate3d(0ch, 0.1in, 0.1em);
  opacity: 1;
  transition: all 0.8s ease;
}
</style>

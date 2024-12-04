<template>
  <div>
    <BaseTable
      :BTNactions="btn_actions"
      :headers="headers"
      localData
      :dataArray="tabel_items"
    />
    <PendingInvitory
      v-if="details_dialog"
      @closeDialog="details_dialog = false"
      @refresh="getItems"
      :dialog="details_dialog"
      :agency-id="agency_id"
    />
  </div>
</template>

<script>
import PendingInvitory from "@/components/Product/PendingInvitory.vue";
export default {
  components: { PendingInvitory },
  data: () => ({
    headers: [],
    agency_id: "",
    btn_actions: [],
    tabel_items: [],
    title: "محصولات منتظر تایید",
    loading: false,
    details_dialog: false,
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.getItems();
    this.headers = [
      {
        text: "تصویر",
        value: "img",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      {
        text: "نام نمابندگی",
        value: "name",
      },
      {
        text: "کد نمابندگی",
        value: "code",
      },

      {
        text: "شعبه اصلی",
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.agency_main) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "جزییات",
        color: "btn_color",
        fun: (body) => {
          this.agency_id = body.id;
          this.details_dialog = true;
        },
      },

    ];
  },
  methods: {
    getItems() {
      this.loading = true;
      this.$reqApi("pending-inventory")
        .then((response) => {
          let items = [];
          for (let i = 0; i < response.model.length; i++) {
            let item = {};
            const x = response.model[i];
            item = { ...x.sale_agency };
            items.push(item);
          }
          this.tabel_items = items;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  
  },
};
</script>

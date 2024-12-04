<template>
  <v-dialog v-model="dialog" persistent max-width="550">
    <v-card style="overflow: hidden !important" class="pa-4">
      <v-col cols="12" class="d-flex align-center">
        <h1 class="font_18">جزییات درخواست</h1>
        <v-spacer></v-spacer>

        <v-btn icon @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
      </v-col>
      <v-row v-if="!loading">
        <div class="d-flex">
          <v-chip
            dark
            label
            class="ma-2 px-3"
            color="blue-grey"
            v-for="item in items"
            :key="item.key"
            @click="tab = item.key"
            :outlined="tab != item.key"
          >
            {{ item.text }}
          </v-chip>
        </div>
        <v-col cols="12" md="12" v-for="(x, i) in products" :key="i">
          <v-card
            class="pa-2 elevation-1 rounded-0 card-style"
            outlined
            style="border-right: 2px solid orange"
          >
            <div class="d-flex align-center">
              <v-avatar size="60" class="mx-2">
                <img :src="$getImage(x.pro_var_com.product.main_image)" />
              </v-avatar>

              <div>
                <h1 class="blue-grey--text">
                  {{ x.pro_var_com.product.name }}
                  <small>
                    (
                    {{
                      $getItemEnum($store.state.static.inventory_type, x.type)
                    }}
                    )
                  </small>
                </h1>
                <h1>تعداد درخواست {{ x.number }}</h1>
                <h1>
                  {{
                    $getItemEnum($store.state.static.inventory_status, x.status)
                  }}
                </h1>

                <v-spacer></v-spacer>
                <h1>
                  نوع درخواست :‌
                  {{
                    $getItemEnum(
                      $store.state.static.inventory_type_request,
                      x.type_inventory
                    )
                  }}
                </h1>
              </div>
              <v-spacer></v-spacer>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" v-if="products.length != 0 && tab == 'wait'">
          <v-row class="justify-center">
            <v-btn
              text
              outlined
              @click="ChangeStatus(agencyId, 'done')"
              color="success"
              class="ma-2"
            >
              تایید درخواست
            </v-btn>
            <v-btn
              text
              outlined
              @click="ChangeStatus(agencyId, 'reject')"
              color="red darken-1"
              class="ma-2"
            >
              رد درخواست
            </v-btn>
          </v-row>
        </v-col>

        <v-col cols="12" v-if="products.length == 0">
          <v-alert
            color="orange lighten-5"
            elevation="1"
          >
            <h1>درخواستی با این نوع وضعیت وجود ندارد</h1>
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="align-center justify-center my-8" v-if="loading">
        <v-progress-circular
          v-if="loading"
          :width="5"
          color="grey"
          :size="30"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import Qrcode from "@/components/Qrcode/Qrcode.vue";
export default {
  components: {
    Qrcode,
  },
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },
    agencyId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      now: "",
      products: [],
      main_data: [],
      items: [
        { text: "منتظر تایید", key: "wait" },
        { text: "انجام شده", key: "done" },
        { text: "رد شده", key: "reject" },
      ],
      tab: "wait",
      loading: true,
    };
  },
  watch: {
    tab() {
      this.loading = true;
      let data = this.main_data;
      if (this.tab == "wait") {
        this.products = data.filter((x) => x.status == "wait");
      }
      if (this.tab == "done") {
        this.products = data.filter((x) => x.status == "done");
      }
      if (this.tab == "reject") {
        this.products = data.filter((x) => x.status == "reject");
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
  mounted() {


    this.loadDetails();
  },
  methods: {
    loadDetails() {
      this.$reqApi("pending-inventory/list-detail", {
        sale_agency_id: this.agencyId,
      })
        .then((res) => {
          this.main_data = res.model.data;
          this.products = this.main_data.filter((x) => x.status == "wait");

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    ChangeStatus(id, status) {
      this.loading = true;
      let form = {
        sale_agency_id: id,
        status: status,
      };
      this.$reqApi("pending-inventory/change-status", form)
        .then((res) => {
          this.$toast.success("تغییر وضعیت با موفقیت انجام شده");
          this.$emit("refresh")
          this.closeDialog()
          this.loading = false;
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
<style scoped>
.card-style {
  border: 1px solid #30303081 !important;
  transition: all 0.8s ease;
  opacity: 0.66;
}
.card-style:hover{
  transform: translate3d(0.2ch, 0.05in, 0.3em);
  opacity: 1;
  transition: all 0.8s ease;
}
strong {
  font-size: 18px;
}
h1 {
  font-size: 12px;
}
</style>

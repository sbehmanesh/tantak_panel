<template>
  <v-dialog v-model="walletDialog">
    <v-card class="white pa-3">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>تاریخچه کیف پول</span>
        <v-btn icon color="error" @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text clsas="pa-5">
        <v-row>
          <v-col cols="12" md="12"> </v-col>
          <v-col cols="12" md="12" class="pa-8">
            <template>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">تاریخ پرداخت</th>
                      <th class="text-center">مبلغ</th>
                      <th class="text-center">نوع پرداخت</th>
                      <th class="text-center">نوع کیف پول</th>
                      <th class="text-center">توضیحات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in walletData" :key="index">
                      <td dir="ltr">{{ $toJalali(item.created_at) }}</td>
                      <td><small>ریال</small>{{ $price(item.amount) }}</td>
                      <td>
                        {{ item.type == "remove" ? "کاهش" : "افزایش" }}
                      </td>
                      <td>
                        {{ item.kind == "cash" ? "نقدی" : "اعتباری" }}
                      </td>
                      <td>{{ item.description }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Dialog from "./Dialog.vue";

export default {
  components: {},
  props: {
    walletDialog: {
      default: false,
      required: false,
    },
    walletData: {
      default: false,
      required: false,
    },
  },
  data: () => ({}),
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style></style>

<template>
  <div v-if="overlay">
    <v-col cols="12">
      <v-overlay :dark="false">
        <v-card min-width="600" class="pa-6">
          <v-form v-model="valid">
            <amp-upload-file
              title="بارگذاری عکس چک"
              v-model="receipt_img"
              rules="require"
              class="my-3"
              Cclass="success"
            />
            <v-card-actions class="center-div">
              <amp-button
                text="تایید"
                color="success"
                @click="changeStatus()"
                :disabled="!valid"
                :loading="loading"
              />
              <amp-button
                text="انصراف"
                color="error"
                @click="overlay = false"
                :loading="loading"
              />
            </v-card-actions>
          </v-form>
        </v-card>
      </v-overlay>
    </v-col>
  </div>
</template>
<script>
export default {
  props: {
    overlay: {
      default: false,
      required: false,
    },
    getData: {
      default: false,
      required: false,
    },
    getItem: {
      default: false,
      required: false,
    },
  },
  data: () => ({
    loading: false,
    receipt_img: null,
  }),
  methods: {
    changeStatus() {
      this.loading = true;
      this.$reqApi("product-request/upload-receipt", {
        id: this.getData.id,
        payment_id: this.getItem.id,
        receipt_img: this.receipt_img,
      })
        .then((res) => {
          
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style></style>

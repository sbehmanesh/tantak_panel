<template>

  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2 d-flex justify-center">
      <v-col cols="12" md="8">
        <amp-select
          rules="require"
          text=" ارسال خرید برای"
          :items="for_buy_item"
          v-model="for_buy"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-jdate
          text="تاریخ ارسال"
          :is-number="true"
          rules="require"
          v-model="array_profile.send_at"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          rules="require"
          text="نام گیرنده  "
          v-model="array_profile.first_name"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          rules="require"
          text="نام خانوادگی "
          v-model="array_profile.last_name"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="شماره همراه"
          :isNumber="true"
          v-model="array_profile.phone_number"
          rules="require,phone"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          rules="require"
          text="بازه زمانی ارسال"
          v-model="array_profile.delivery_time_id"
          :items="time_send"
        />
      </v-col>

      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-col cols="12">
      <AddAddress
        @set_address="setNewAddress($event)"
        :dialog_add="dialog_add"
        :user_id="user_id"
        v-if="dialog_add.show"
      />

      <v-col cols="12" md="12" v-if="address.length > 0 || show_select_addres">
        <v-row>
          <v-col cols="10">
            <amp-select
              rules="require"
              text="آدرس گیرنده"
              v-model="array_profile.address_id"
              :items="address"
              :loading="loading"
            />
          </v-col>

          <v-col cols="2">
            <amp-button
              icon="add_location_alt"
              height="40"
              @click="dialog_add.show = true"
              color="orange darken-3 "
              class="ma-1 mt-8"
              text="افزودن آدرس "
              :loading="loading"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col class="text-center" cols="12" md="12" v-else>
        <v-btn text @click="dialog_add.show = true">
          <v-icon class="py-5" size="45"> add_location_alt </v-icon>
        </v-btn>
        <br />
        <small> برای کاربر آدرسی ثبت نشده </small>
      </v-col>
    </v-col>

    <v-row class="my-4 d-flex justify-center">
      <amp-button
        v-if="!hide_btn"
        icon="arrow_circle_right"
        height="40"
        @click="backStep"
        class="ma-1"
        color="red darken-2"
        text="برگشت "
      />
      <amp-button
        icon="done"
        height="40"
        @click="nextStep"
        color="green darken-3 "
        class="ma-1"
        text="تایید "
        :loading="loading"
        :disabled="loading || (!valid && !array_profile.address_id)"
      />
      <amp-button
        v-if="!hide_btn"
        icon="arrow_circle_left"
        height="40"
        @click="showBTN()"
        color="info darken-3 "
        class="ma-1"
        text="بعدی "
        :loading="loading"
      />
    </v-row>
  </v-form>
</template>

<script>
import AddAddress from "@/components/Product/AddAddress.vue";
export default {
  components: {
    AddAddress,
  },
  props: {
    basket_costumer_id: {
      require: false,
      default: false,
    },
    user_id: {
      require: false,
      default: false,
    },
    hide_btn: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      show_btn: false,
      show_select_addres: false,
      for_buy: "",
      dialog_add: { items: null, show: false },
      address: [],
      address_list: [],
      step: 1,
      time_send: [],
      for_buy_item: [
        { text: "خود کاربر ", value: "user" },
        { text: "دیگران", value: "other" },
      ],

      array_profile: {
        last_name: "",
        first_name: "",
        address_id: "",
        phone_number: "",
        send_at: "",
        delivery_time_id: "",
      },
    };
  },
  computed: {
    check_have_address() {
      let check = false;
      if (this.address.length > 0) {
        check = true;
      }
      return check;
    },
  },

  mounted() {
    this.getTime();
    this.getAddress();
  },
  watch: {

    show_select_addres() {
      if (this.show_select_addres) {
      }
    },
    for_buy() {
      if (this.for_buy == "user") {
        this.loadUserInfo();
      } else {
        this.array_profile.first_name = "";
        this.array_profile.last_name = "";
        this.array_profile.phone_number = "";
      }
    },
  },
  methods: {
    setNewAddress(event) {
      // this.address.unshift(event)
      if (Boolean(event)) {
        this.getAddress();
      }
    },
    submit() {
      this.loading = true;
      let form = {};
      form["basket_id"] = this.basket_costumer_id;
      form["for_buy"] = this.for_buy;

      form["array_profile"] = [this.array_profile];

      this.$reqApi("basket/set-form-send", form)
        .then((response) => {
          this.loading = false;
          this.$toast.success("اطلاعات با موفقیت ثبت شد");
          this.$emit("validForm", this.valid);
          this.$emit("load");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getTime() {
      this.loading = true;
      this.$reqApi("delivery-time")
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const element = response.model.data[index];
            let substrings = element.range_time.split(",");
            let numbers = substrings.map((substring) => Number(substring));
            items.push({
              text: " از " + numbers[0] + " تا " + numbers[1],
              value: element.id,
            });
          }

          this.time_send = items;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getAddress() {
      this.loading = true;
      let filters = {};
      filters = {
        user_id: {
          op: "=",
          value: this.user_id,
        },
      };

      this.$reqApi("/address", { filters: filters })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const element = response.model.data[index];
            items.push({
              text: ` استان  ${element.country_division.parent.name}   ,   ${element.country_division.name} ,    پستی ${element.postal_code} | آدرس :      ${element.address}
              `,
              value: element.id,
            });
          }
          this.address = items;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadUserInfo() {
      this.loading = true;
      this.$reqApi("/user/show", { id: this.user_id })
        .then(async (response) => {
          this.array_profile.phone_number = response.model.username;
          this.array_profile.last_name = response.model.last_name;
          this.array_profile.first_name = response.model.first_name;

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.redirectPage();
          this.loading = false;
        });
    },

    nextStep() {
      this.show_btn = true;
      this.submit();
    },
    showBTN() {
      this.$emit("nextStep");
    },
    backStep() {
      this.$emit("backStep");
    },

    showDialog() {
      this.dialog_add.show = true;
    },
  },
};
</script>

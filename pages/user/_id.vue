<template>
  <div>
    <div>
      <v-chip
        dark
        label
        class="ma-2"
        color="primary"
        v-for="(item, key) in items"
        :key="key"
        @click="selectItem(item)"
        :outlined="tab != item.value"
      >
        {{ item.text }}
      </v-chip>
      <v-divider />
    </div>
    <UserForm v-if="tab == 'edit'" :model-id="$route.params.id" />
    <AddressUser v-if="tab == 'address'" :model-id='$route.params.id' />
  </div>
</template>

<script>
import UserForm from "@/components/User/UserForm.vue";
import AddressUser from '@/components/User/AddressUser.vue'
export default {
  components: { UserForm , AddressUser},
  data: () => ({
    tab: "edit",
    items: [
      { text: "ویرایش اطلاعات", value: "edit" },
      { text: 'آدرس', value:'address'}
      ],
    title: "ثبت کاربر جدید"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    selectItem(item) {
      this.tab = item.value;
    }
  }
};
</script>

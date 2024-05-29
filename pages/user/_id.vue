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
    <Comment v-if="tab == 'comment'" :model-id='$route.params.id' />
    <Payment v-if="tab == 'payment'" :model-id='$route.params.id' />
    <Basket v-if="tab == 'Basket'" :model-id='$route.params.id' />
  </div>
</template>

<script>
import UserForm from "@/components/User/UserForm.vue";
import AddressUser from '@/components/User/AddressUser.vue'
import Payment from '@/components/User/Payment.vue'
import Comment from '@/components/User/Comment.vue'
import Basket from '@/components/User/Basket.vue'
export default {
  components: { UserForm , AddressUser , Comment  , Payment ,Basket},
  data: () => ({
    tab: "edit",
    items: [
      { text: "ویرایش اطلاعات", value: "edit" },
      { text: 'آدرس', value:'address'},
      { text: 'نظرات در مورد کاربر', value:'comment'},
      { text: 'پرداخت ها', value:'payment'},
      { text: 'سبد خرید', value:'Basket'}
      ],
    title: "ویرایش کاربر"
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

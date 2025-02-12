<template>
  <div>
    <BaseTable
      url="/contact"
      :headers="headers"
      autoDelete="/contact/delete"
      autoUpdate="/user/contacts"
      createUrl="/user/contacts/insert"
      :extraBtn="extra_btn"
      @getData="getContracts($event)"

    />
    <JoineContract v-if="dialog" :dialog="dialog" @closeDialog="dialog = false" :user-contacts='contacts' />
  </div>
</template>

<script>
import JoineContract from "@/components/User/JoineContract.vue"

export default {
components:{
  JoineContract
},
  data: () => ({
    headers: [],
    extra_btn: [],
    contacts: [],
  dialog:false,
    title: " مخاطبین دفترچه تلفن",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "نام مخاطب", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "شماره تماس", value: "phone_number" },
      {
        text: "دسته بندی",
        value: (body) => {
          if (Boolean(body.category)) {
            return body.category.value;
          }
        },
      },
    ];
    this.extra_btn = [
      {
        text: "افزودن به کاربران",
        icon: "group_add",
        color: "teal darken-2",
        fun: () => {
          this.dialog = true
        },
      },
    ];
  },
  methods:{
    getContracts(event){
    let items =[]
      for (let index = 0; index < event.model.data.length; index++) {
        const x = event.model.data[index];
        items.push({
          text:x.first_name + " " + x.last_name +  " | " + x.phone_number,
          value:x.phone_number
        })
      }
this.contacts= items
    }
  }
};
</script>

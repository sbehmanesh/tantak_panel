<template>
  <div>
    <ContactUsForm :model-id="$route.params.id" />
  </div>
</template>

<script>
import ContactUsForm from "@/components/Forms/ContactUsForm.vue";

export default {
  components: { ContactUsForm },
  data: () => ({
    title: "ویرایش فرم"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {}
};
</script>

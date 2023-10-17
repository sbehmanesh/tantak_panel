<template>
  <div>
    <CepresentationRequestForm :model-id="$route.params.id" />
  </div>
</template>

<script>
import CepresentationRequestForm from "@/components/Forms/CepresentationRequestForm.vue";

export default {
  components: { CepresentationRequestForm },
  data: () => ({
    title: "ویرایش فرم"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {}
};
</script>

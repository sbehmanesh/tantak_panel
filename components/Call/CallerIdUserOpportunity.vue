<template>
  <div>
    <v-col cols="12">
      <b> فرصت های کاربر </b>
      <div class="mt-3" v-for="(o, index) in opportunities" :key="index">
        {{ o.text }}
      </div>
      <div class="mt-4 mb-4" v-if="!opportunities.length">تاکنون فرصتی برای این مشتری ثبت نشده است.</div>
    </v-col>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    opportunities: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    loading: false,
    valid: false,
  }),
  watch: {},

  beforeMount() {},
  beforeDestroy() {},
  mounted() {},

  methods: {},
}
</script>
<style scoped>
</style>

<template>
  <div class="amp_section align-center">
    <div v-if="text" class="text_item">
      <v-flex class="pa-1 mr-1 warning rounded-circle d-inline-block" ></v-flex>
      <strong :class="fontSize" v-html="text"></strong>
    </div>
    <div xs12 md12 class="border_item"></div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
    },    fontSize: {
      type: String,
     default:"font_20"
    },
  },
}
</script>

<style scoped>
.amp_section {
  margin-top: 19px;
  margin-bottom: 16px;
}
.amp_section > .border_item {
  padding-top: 5px;
  border-bottom: 2px dotted #acacac;
}
.amp_section > .text_item {
  position: absolute;
  margin-top: -11px;
  background: #fff;
  padding-left: 5px;
}
</style>

<template>
  <div class="d-flex justify-space-between rtl-item">
    <div class="py-1">
      <span :class="[color, textClass, 'font_16']" v-html="text"> </span>
      <amp-help :text="helpText" v-if="helpText" />
    </div>
    <div v-if="required" class="pt-1">
      <span class="red--text font_16">*</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default:'',
      required: false,
    },
    color: {
      type: '',
      required: false,
    },
    tooltipWidth: {
      type: String,
      default: '350',
    },
    required: {
      type: Boolean,
      default: false,
    },
    helpText: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    textClass: {
      type: String,
      default: '',
    },
  },
}
</script>

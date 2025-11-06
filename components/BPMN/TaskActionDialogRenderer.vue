<template>
  <div>
    <div
      v-if="item.component === 'FormHtmlViewer'"
      class="pa-3 grey lighten-4 rounded"
      v-html="item.config?.content"
    />

    <amp-input
      v-else-if="item.component === 'FormInput'"
      v-model="model"
      :text="inputLabel"
      :rules="rules"
      :type="item.config?.type || 'text'"
      :placeholder="item.config?.placeholder || ''"
      :readonly="Boolean(item.config?.readonly)"
      :help-text="item.config?.helper || ''"
      :is-number="isNumberFormat"
      :is-float="isFloatFormat"
    />

    <amp-select
      v-else-if="item.component === 'FormSelectList'"
      v-model="model"
      :text="inputLabel"
      :rules="rules"
      :items="selectItems"
      :multiple="Boolean(item.config?.options?.allowMultiSelect)"
      :placeholder="item.config?.placeholder || 'انتخاب کنید'"
      :disabled="Boolean(item.config?.readonly)"
      :help_text="item.config?.helper || ''"
    />

    <amp-jdate
      v-else-if="item.component === 'FormDatePicker'"
      v-model="model"
      :text="inputLabel"
      :rules="rules"
      :placeholder="item.config?.placeholder || ''"
      :disabled="Boolean(item.config?.disabled)"
      :readonly="Boolean(item.config?.readonly)"
      :type="item.config?.type || 'date'"
    />

    <v-checkbox
      v-else-if="item.component === 'FormCheckbox'"
      v-model="model"
      :label="inputLabel"
      :disabled="Boolean(item.config?.disabled)"
      hide-details
    />

    <AmpUploadFileNew
      v-else-if="item.component === 'FileUpload'"
      v-model="model"
      :title="inputLabel"
      :multiple="Boolean(item.config?.multipleUpload)"
      :label="false"
    />

    <amp-textarea
      v-else-if="item.component === 'FormTextArea'"
      v-model="model"
      :text="inputLabel"
      :rules="rules"
      :rows="item.config?.rows || 3"
      :placeholder="item.config?.placeholder || ''"
      :readonly="Boolean(item.config?.readonly)"
      :help_text="item.config?.helper || ''"
    />

    <div v-else class="grey--text text--darken-1">
      نوع فیلد ناشناخته است:
      <code>{{ item.component }}</code>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskActionDialogRenderer',
  props: {
    item: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    rules: {
      type: String,
      default: '',
    },
  },
  computed: {
    fieldName() {
      return this.item?.config?.name || ''
    },
    hasModel() {
      return Boolean(this.fieldName)
    },
    model: {
      get() {
        if (!this.hasModel) {
          return null
        }
        return this.formData[this.fieldName]
      },
      set(value) {
        if (!this.hasModel) {
          return
        }
        this.$set(this.formData, this.fieldName, value)
      },
    },
    inputLabel() {
      return this.item?.config?.label || this.item?.label || this.fieldName
    },
    isNumberFormat() {
      return this.item?.config?.dataFormat === 'integer'
    },
    isFloatFormat() {
      return this.item?.config?.dataFormat === 'float'
    },
    selectItems() {
      const options = this.item?.config?.options
      if (!options) {
        return []
      }
      if (Array.isArray(options.optionsList)) {
        return options.optionsList.map((option) => ({
          text: option.content,
          value: option.value,
        }))
      }
      if (Array.isArray(options.selectedOptions)) {
        return options.selectedOptions.map((option) => ({
          text: option.content || option.label,
          value: option.value,
        }))
      }
      try {
        if (options.jsonData) {
          const parsed = JSON.parse(options.jsonData)
          if (Array.isArray(parsed)) {
            return parsed.map((option) => ({
              text: option.content || option.label,
              value: option.value,
            }))
          }
        }
      } catch (error) {
        console.warn('Invalid options jsonData', error)
      }
      return []
    },
  },
}
</script>

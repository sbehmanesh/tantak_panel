<template>
  <v-dialog v-model="dialogProxy" persistent max-width="720px">
    <v-card>
      <v-card-title>
        <span class="headline">انجام وظیفه: {{ task?.name || task?.element_name }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="taskForm" v-model="formValid">
          <v-container fluid>
            <v-row dense>
              <v-col
                v-for="item in formFields"
                :key="item.uuid || item.config?.name || item.label"
                :cols="getCols(item)"
              >
                <component-renderer
                  :item="item"
                  :form-data="formData"
                  :rules="mapValidationRules(item.config?.validation)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <amp-button text="انصراف" color="red" @click="handleCancel" />
        <template v-if="formButtons.length">
          <amp-button
            v-for="button in formButtons"
            :key="button.uuid || button.config?.event || button.label"
            :text="getButtonLabel(button)"
            :color="getButtonColor(button)"
            :loading="loading && isSubmitButton(button)"
            :disabled="(loading && isSubmitButton(button)) || (isSubmitButton(button) && !formValid)"
            @click="handleButtonClick(button)"
          />
        </template>
        <amp-button
          v-else
          text="تایید و ارسال"
          color="primary"
          :loading="loading"
          :disabled="loading || !formValid"
          @click="submit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ComponentRenderer from '~/components/BPMN/TaskActionDialogRenderer.vue'

export default {
  name: 'TaskActionDialog',
  components: {
    ComponentRenderer,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      default: null,
    },
    variables: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formValid: false,
    }
  },
  computed: {
    dialogProxy: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    formFields() {
      return this.variables.filter((item) => !this.isButton(item))
    },
    formButtons() {
      return this.variables.filter((item) => this.isButton(item))
    },
  },
  watch: {
    value(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    },
    variables: {
      immediate: true,
      handler(newVal) {
        if (!Array.isArray(newVal)) {
          return
        }
        newVal.forEach((item) => {
          const name = item?.config?.name
          if (!name || this.formData[name] !== undefined) {
            return
          }
          this.$set(this.formData, name, this.getDefaultValue(item))
        })
      },
    },
  },
  methods: {
    getCols(item) {
      return item?.config?.cols || 12
    },
    isButton(item) {
      return item?.component === 'FormButton'
    },
    isSubmitButton(item) {
      if (!item || !item.config) {
        return false
      }
      return item.config.defaultSubmit || item.config.event === 'submit' || item.config.event === 'complete'
    },
    getButtonLabel(item) {
      return item?.config?.label || item?.label || 'تایید'
    },
    getButtonColor(item) {
      const variant = item?.config?.variant
      if (!variant) {
        return 'primary'
      }
      const variantMap = {
        primary: 'primary',
        success: 'success',
        warning: 'warning',
        danger: 'error',
      }
      return variantMap[variant] || variant
    },
    handleCancel() {
      this.$emit('cancel')
      this.dialogProxy = false
    },
    submit() {
      if (this.validateForm()) {
        this.$emit('submit')
      }
    },
    handleButtonClick(button) {
      if (this.isSubmitButton(button)) {
        this.submit()
      } else {
        this.$emit('action', button)
      }
    },
    validateForm() {
      const form = this.$refs.taskForm
      if (form) {
        return form.validate()
      }
      return true
    },
    resetForm() {
      this.formValid = false
      const form = this.$refs.taskForm
      if (form) {
        form.resetValidation()
      }
    },
    mapValidationRules(validation) {
      if (!Array.isArray(validation) || validation.length === 0) {
        return ''
      }
      const rules = validation
        .map((rule) => {
          if (typeof rule === 'string') {
            return rule === 'required' ? 'require' : rule
          }
          if (rule && rule.value) {
            return rule.value === 'required' ? 'require' : rule.value
          }
          return null
        })
        .filter(Boolean)
      return rules.join(',')
    },
    getDefaultValue(item) {
      const component = item?.component
      const config = item?.config || {}
      if (component === 'FormCheckbox') {
        return Boolean(config.initiallyChecked)
      }
      if (component === 'FormSelectList') {
        return config.options?.allowMultiSelect ? [] : ''
      }
      if (component === 'FileUpload') {
        return config.multipleUpload ? [] : ''
      }
      return config.fieldValue ?? ''
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: 500;
}
</style>

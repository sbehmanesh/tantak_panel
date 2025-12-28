<template>
  <v-dialog v-model="dialogProxy" persistent max-width="720px">
    <v-card>
      <v-progress-linear v-if="submitting" color="primary" height="2" indeterminate />
      <v-card-title>
        <span class="headline">{{ task?.name || task?.element_name || '---' }}</span>
      </v-card-title>
      <v-card-text>
        <div v-if="!task">
          <v-alert type="info" dense outlined>
            برای مشاهده فرم، ابتدا یک وظیفه را انتخاب کنید.
          </v-alert>
        </div>
        <template v-else>
          <div v-if="loadingForm" class="py-8 text-center">
            <v-progress-circular indeterminate color="primary" size="40" />
            <div class="mt-2 grey--text text--darken-1">در حال بارگذاری فرم</div>
          </div>
          <v-alert v-else-if="fetchError" type="error" dense outlined>
            {{ fetchError }}
          </v-alert>
          <v-form
            v-else
            ref="taskForm"
            v-model="formValid"
            lazy-validation
          >
            <v-container fluid>
              <template v-if="formFields.length">
                <v-row dense>
                  <v-col
                    v-for="item in formFields"
                    :key="item.uuid || item.config?.name || item.label"
                    :cols="getCols(item)"
                  >
                    <component-renderer
                      :item="item"
                      :form-data="formValues"
                      :rules="mapValidationRules(item.config?.validation)"
                    />
                  </v-col>
                </v-row>
              </template>
              <div v-else class="text-center grey--text text--darken-1 py-4">
                فیلدی برای این فرم تعریف نشده است.
              </div>
            </v-container>
          </v-form>
        </template>
      </v-card-text>
      <v-card-actions v-if="isTaskOwner">
        <v-spacer />
        <amp-button text="خروج" color="red" :disabled="submitting" @click="handleCancel" />
        <template v-if="formButtons.length">
          <amp-button
            v-for="button in formButtons"
            :key="button.uuid || button.config?.event || button.label"
            :text="getButtonLabel(button)"
            :color="getButtonColor(button)"
            :loading="submitting && isSubmitButton(button)"
            :disabled="shouldDisableButton(button)"
            @click="handleButtonClick(button)"
          />
        </template>
        <amp-button
          v-else
          text="تایید و ارسال"
          color="primary"
          :loading="submitting"
          :disabled="defaultSubmitDisabled"
          @click="submit"
        />
      </v-card-actions>
      <v-card-actions v-if="!isTaskOwner">
        <v-spacer />
        <amp-button text="خروج" color="red" :disabled="submitting" @click="handleCancel" />
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
  },
  data() {
    return {
      formValid: false,
      loadingForm: false,
      submitting: false,
      screenItems: [],
      formValues: {},
      fetchError: null,
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
    isTaskOwner() {
      return false
    },
    formFields() {
      return this.screenItems.filter((item) => !this.isButton(item))
    },
    formButtons() {
      return this.screenItems.filter((item) => this.isButton(item))
    },
    hasTask() {
      return Boolean(this.task && this.task.id)
    },
    defaultSubmitDisabled() {
      return this.loadingForm || this.submitting || !this.formValid
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.initializeDialog()
      } else {
        this.resetDialog()
      }
    },
    task(newTask, oldTask) {
      if (!this.value) {
        return
      }
      if ((newTask && !oldTask) || (newTask?.id && newTask.id !== oldTask?.id)) {
        this.initializeDialog()
      }
    },
  },
  methods: {
    async initializeDialog() {
      if (!this.hasTask) {
        return
      }
      this.loadingForm = true
      this.fetchError = null
      this.screenItems = []
      this.formValues = {}
      this.resetFormState()
      try {
        const taskData = await this.$reqBpmn(
          `/tasks/${this.task.id}`,
          'get',
          {},
          {
            include: 'screen,data',
          }
        )
        const items = this.extractScreenItems(taskData?.screen?.config)
        this.screenItems = Array.isArray(items) ? items : []
        const initialData = taskData?.data || {}
        this.screenItems.forEach((item) => {
          const name = item?.config?.name
          if (!name) {
            return
          }
          const hasExistingValue = Object.prototype.hasOwnProperty.call(initialData, name)
          const value = hasExistingValue ? initialData[name] : undefined
          this.$set(this.formValues, name, this.normalizeFieldValue(value, item))
        })
      } catch (error) {
        this.fetchError = 'خطا در دریافت اطلاعات وظیفه'
        if (this.$toast && this.$toast.error) {
          this.$toast.error('خطا در دریافت اطلاعات وظیفه')
        }
        // eslint-disable-next-line no-console
        console.error('Error loading task details:', error)
      } finally {
        this.loadingForm = false
      }
    },
    extractScreenItems(screenConfig) {
      if (Array.isArray(screenConfig)) {
        if (screenConfig.length === 1 && Array.isArray(screenConfig[0]?.items)) {
          return screenConfig[0].items
        }
        return screenConfig
      }
      if (screenConfig && Array.isArray(screenConfig.items)) {
        return screenConfig.items
      }
      return []
    },
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
    shouldDisableButton(button) {
      if (this.loadingForm) {
        return true
      }
      if (this.isSubmitButton(button)) {
        return this.submitting || !this.formValid
      }
      return false
    },
    handleCancel() {
      this.$emit('cancel')
      this.dialogProxy = false
    },
    async submit() {
      if (!this.hasTask) {
        return
      }
      if (!this.validateForm()) {
        return
      }
      this.submitting = true
      try {
        await this.$reqBpmn(`/tasks/${this.task.id}`, 'put', {
          data: { ...this.formValues },
          status: 'COMPLETED',
        })
        if (this.$toast && this.$toast.success) {
          this.$toast.success('وظیفه با موفقیت انجام شد')
        }
        this.$emit('completed', { task: this.task })
        this.dialogProxy = false
      } catch (error) {
        if (this.$toast && this.$toast.error) {
          this.$toast.error('خطا در انجام وظیفه')
        }
        // eslint-disable-next-line no-console
        console.error('Error completing task:', error)
      } finally {
        this.submitting = false
      }
    },
    handleButtonClick(button) {
      if (this.isSubmitButton(button)) {
        console.log('button',button)
        return
        //this.$set(this.formValues, name, this.normalizeFieldValue(value, item))
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
    resetFormState() {
      this.formValid = false
      const form = this.$refs.taskForm
      if (form) {
        form.resetValidation()
      }
    },
    resetDialog() {
      this.resetFormState()
      this.loadingForm = false
      this.submitting = false
      this.fetchError = null
      this.screenItems = []
      this.formValues = {}
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
    normalizeFieldValue(value, item) {
      const component = item?.component
      const config = item?.config || {}
      if (component === 'FormCheckbox') {
        if (value === undefined || value === null || value === '') {
          return Boolean(config.initiallyChecked)
        }
        if (typeof value === 'string') {
          return ['true', '1', 'on', 'yes'].includes(value.toLowerCase())
        }
        if (typeof value === 'number') {
          return value === 1
        }
        return Boolean(value)
      }
      if (component === 'FormSelectList') {
        if (config.options?.allowMultiSelect) {
          if (Array.isArray(value)) {
            return value
          }
          if (value === undefined || value === null || value === '') {
            return []
          }
          return [value]
        }
        if (value === undefined || value === null) {
          return config.fieldValue ?? ''
        }
        return value
      }
      if (component === 'FileUpload') {
        if (config.multipleUpload) {
          if (Array.isArray(value)) {
            return value
          }
          if (!value) {
            return []
          }
          return [value]
        }
        if (value === undefined || value === null) {
          return config.fieldValue ?? ''
        }
        return value
      }
      if (value === undefined || value === null) {
        return config.fieldValue ?? ''
      }
      return value
    },
  },
}
</script>

<style scoped>
.headline {
  font-weight: 500;
}
</style>

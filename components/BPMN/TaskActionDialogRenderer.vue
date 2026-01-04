<template>
  <div>
    <div
      v-if="item.component === 'FormHtmlViewer'"
      class="pa-3 grey lighten-4 rounded"
      v-html="item.config?.content"
    />

    <template v-else-if="item.component === 'FormInput'">
      <TransactionOverview
        v-if="isTransactionsField"
        :label="inputLabel"
        :transactions="model"
      />

      <template v-else>
        <template v-if="fieldName.endsWith('basket_id')">
          <label class="mr-3">
            {{ inputLabel }}
          </label>
          <BasketItems 
            :basket_id="model" 
          />
        </template>

        <template v-else-if="fieldName.endsWith('tipax_register')">
          <TipaxDialog
            v-model="tipax_dialog"
            @submited="model = true"
            :basket-row="basket_model"
          />
          <amp-button
            text="ثبت در تیپاکس"
            color="green"
            :disabled="model == true"
            @click="openCloseTipaxDialog"
          />
        </template>

        <BpmnUserSelect
          v-else-if="fieldName.endsWith('user_id')"
          :rules="rules"
          v-model="model"
          url="user"
          :readonly="Boolean(item.config?.readonly)"
          :text="inputLabel"
          :role-id="[]"
        />
        <BpmnUserSelect
          v-else-if="fieldName.endsWith('user_bpmn_id')"
          :rules="rules"
          v-model="model"
          url="user"
          use-bpmn-id
          :readonly="Boolean(item.config?.readonly)"
          :text="inputLabel"
          :role-id="[]"
        />
        <CountryDivisionCityAutocomplete
          v-else-if="isCountryDivisionField"
          v-model="model"
          :text="inputLabel"
          :rules="rules"
          :placeholder="item.config?.placeholder || ''"
          :help_text="item.config?.helper || ''"
          :readonly="Boolean(item.config?.readonly)"
          :disabled="Boolean(item.config?.disabled || item.config?.readonly)"
        />
        <amp-input
          v-else
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
      </template>
    </template>

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
      v-else-if="item.component === 'FileUpload' || item.component === 'FormImage'"
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
import BasketItems from './BasketItems.vue'
import BpmnUserSelect from './BpmnUserSelect.vue'
import TransactionOverview from './TransactionOverview.vue'
import TipaxDialog from "~/components/BPMN/TipaxDialog.vue";
import CountryDivisionCityAutocomplete from './CountryDivisionCityAutocomplete.vue'

export default {
  name: 'TaskActionDialogRenderer',
  components: {
    TipaxDialog,
    BasketItems,
    BpmnUserSelect,
    TransactionOverview,
    CountryDivisionCityAutocomplete,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    allRequestData: {
      type: Object,
      required: true,
    },
    rules: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    basket_model: {
      data: {
        delivery_info: {
          id: null,
          address: null,
          postal_code: null,
          first_name: null,
          last_name: null,
          phone_number: null,
          phone_number: null,
          delivery_time: null,
          lat: null,
          long: null,
          country_division_id: null,
          floor: null,
          unit: null,
          no: null
        }
      }
    },
    tipax_dialog: false
  }),
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
    isCountryDivisionField() {
      return (
        this.item.component === 'FormInput' &&
        this.fieldName.endsWith('country_division_id')
      )
    },
    isTransactionsField() {
      return this.fieldName.endsWith('transactions')
    },
  },
  methods: {
    openCloseTipaxDialog() {
      this.tipax_dialog = !this.tipax_dialog
    }
  },
  mounted() {
    if(this.fieldName.endsWith('tipax_register')){
      this.$reqApi("user/limited-show", {id: this.allRequestData.customer_user_id})
      .then((response) => {
          const user = response.model
          this.basket_model = 
          {
            id: this.allRequestData.basket_id,
            data: {
              delivery_info: {
                lat: null,
                long: null,
                no: this.allRequestData.block,
                unit: this.allRequestData.unit,
                last_name: user.last_name,
                floor: this.allRequestData.floor,
                first_name: user.first_name,
                address: this.allRequestData.address,
                postal_code: this.allRequestData.postal_code,
                phone_number: this.allRequestData.phone_number,
                delivery_time: this.allRequestData.delivery_time,
                country_division_id: this.allRequestData.country_division_id,
              }
            }
          }
        }
      )
    }
  }
}
</script>

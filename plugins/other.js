import Vue from 'vue'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import 'vue-json-pretty/lib/styles.css';

import AmpHelp from '~/components/Base/AmpHelp.vue'
import AmpCard from '~/components/Base/AmpCard.vue'
import AmpTime from '~/components/Base/AmpTime.vue'
import AmpInput from '~/components/Base/AmpInput.vue'
import AmpTitle from '~/components/Base/AmpTitle.vue'
import AmpTags from '~/components/Base/AmpTags.vue'
import AmpJdate from '~/components/Base/AmpJdate.vue'
import AmpSelect from '~/components/Base/AmpSelect.vue'
import AmpButton from '~/components/Base/AmpButton.vue'
import AmpLabale from '~/components/Base/AmpLabale.vue'
import AmpDelete from '~/components/Base/AmpDelete.vue'
import AmpSection from '~/components/Base/AmpSection.vue'
import AmpTextarea from '~/components/Base/AmpTextarea.vue'
import AmpRadioGroup from '~/components/Base/AmpRadioGroup.vue'
import AmpUploadFile from '~/components/Base/AmpUploadFile.vue'
import AmpUploadFileNew from '~/components/Base/AmpUploadFileNew.vue'
import AmpAutocomplete from '~/components/Base/AmpAutocomplete.vue'
import AmpRatingCircle from '~/components/Base/AmpRatingCircle.vue'
import AmpNewDatePicker from "~/components/Base/AmpNewDatePicker.vue";
import AmpEditor from '~/components/Base/AmpEditor.vue'
import AmpJsonInput from '~/components/Base/AmpJsonInput.vue'
import AmpInlineUpload from "~/components/Base/AmpInlineUpload.vue";
import AmpCaptcha from '~/components/Base/AmpCaptcha'
import BaseTable from '~/components/DataTable/BaseTable'
import CoustomLile from '~/components/NewCallCenter/AddToBasket/CoustomLilke.vue'
import CoustomLikeList from '~/components/NewCallCenter/AddToBasket/CoustomLikeList.vue'

Vue.component('persian-date-picker', VuePersianDatetimePicker)

Vue.component('BaseTable',BaseTable)
Vue.component('AmpHelp', AmpHelp)
Vue.component('AmpCard', AmpCard)
Vue.component('AmpTime', AmpTime)
Vue.component('AmpTags', AmpTags)
Vue.component('AmpTitle', AmpTitle)
Vue.component('AmpInput', AmpInput)
Vue.component('AmpJdate', AmpJdate)
Vue.component('AmpSelect', AmpSelect)
Vue.component('AmpButton', AmpButton)
Vue.component('AmpLabale', AmpLabale)
Vue.component('AmpDelete', AmpDelete)
Vue.component('AmpEditor', AmpEditor)
Vue.component('AmpSection', AmpSection)
Vue.component('AmpTextarea', AmpTextarea)
Vue.component('AmpJsonInput', AmpJsonInput)
Vue.component('AmpRadioGroup', AmpRadioGroup)
Vue.component('AmpUploadFile', AmpUploadFile)
Vue.component('AmpUploadFileNew', AmpUploadFileNew)
Vue.component('AmpAutocomplete', AmpAutocomplete)
Vue.component('AmpRatingCircle', AmpRatingCircle)
Vue.component("amp-new-date-picker", AmpNewDatePicker)
Vue.component("amp-inline-upload", AmpInlineUpload)
Vue.component('AmpCaptcha', AmpCaptcha)
Vue.component('amp-like', CoustomLile)
Vue.component('amp-like-list', CoustomLikeList)
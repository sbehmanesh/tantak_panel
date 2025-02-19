<template>
  <v-dialog v-model="value" persistent width="85%">
    <v-card class="pa-2">
      <v-card-title>
        <span style="font-size: 19px"> لیست تماس </span>
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog()"> close </v-icon>
      </v-card-title>

      <v-row class="mx-6 my-3 justify-center">
        <v-col cols="12" md="3" class="cld-table">
          <span class="black--text">{{ 'تعداد کل تماس ها' }}</span
          >:
          <span class="mr-2">{{ report_info.total_call_number }} </span>
        </v-col>
        <v-col cols="12" md="3" class="us-table-pending cld-table">
          <span class="black--text">{{ 'تعداد تماس های پاسخ داده شده' }}</span
          >:
          <span class="mr-2">{{ report_info.total_answered_number }} </span>
        </v-col>
        <v-col cols="12" md="3" class="us-table-confirm cld-table">
          <span class="black--text">{{ 'تعداد تماس های بی پاسخ' }}</span
          >:
          <span class="mr-2">{{ report_info.total_not_answered_number }} </span>
        </v-col>
        <v-col cols="12" md="3" class="us-table-confirm cld-table">
          <span class="black--text">{{ 'تعداد تماس های برنامه ریزی شده' }}</span
          >:
          <span class="mr-2">{{ report_info.total_waiting_number }} </span>
        </v-col>
      </v-row>
      <BaseTable
        ref="autoCallLandingTable"
        :headers="headers"
        :BTNactions="btn_actions"
        :extraBtn="extra_btn"
        localData
        :dataArray="report_data"
        no_refresh
        footer
        :extraLoading="loading"
      />
      <v-row class="justify-center align-center py-5">
        <amp-button width="110" height="38" text="بعدی" color="primary" @click="changePage(1)" :disabled="loading" />
        <span class="mx-6">صفحه {{ form.body.page }}</span>
        <amp-button width="110" height="38" text="قبلی" color="primary" @click="changePage(-1)" :disabled="form.body.page < 1 || loading" />
      </v-row>

      <v-card v-if="server_loop" height="100%" min-width="100%" class="elevation-0 cld-export rounded-0">
        <v-card class="elevation-0 transparent">
          <v-card-title class="center-div">
            <v-row>
              <v-col cols="12" md="12">
                <v-card class="elevation-0 white">
                  <v-progress-linear dir="rtl" v-model="download_percent" height="25">
                    <strong class="white--text">{{ Math.ceil(download_percent) }}%</strong>
                  </v-progress-linear>
                </v-card>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <span class="font_19 center-div">در حال دریافت گزارش</span>
            <br />
            <span class="center-div"> این فرایند ممکن است زمان بر باشد </span>
            <br />
          </v-card-text>
        </v-card>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable.vue'
import UserSelectInlineForm from '~/components/User/UserSelectInlineForm.vue'

let jmoment = require('jalali-moment')

export default {
  components: { BaseTable, UserSelectInlineForm },
  props: {
    value: {
      type: Boolean,
      require: true,
    },
    item: {
      type: Object,
      require: true,
    },
  },
  data: () => ({
    report_url: '/mehrkav-voip/proxy',
    loading: false,
    valid: false,
    headers: [],
    btn_actions: [],
    extra_btn: [],
    form: {
      issabel_server_id: '',
      url: 'auto-call',
      method: 'post',
      body: {
        row_number: 50,
        page: 1,
        filters: {
          campaign_id: '',
        },
      },
    },
    report_data: null,
    report_info: {
      total_call_number: 0,
      total_answered_number: 0,
      total_not_answered_number: 0,
      total_waiting_number: 0,
    },
    issabel_items: [],
    // filter_dialog: false,
    // personel_range: null,
    //----
    count_req: 200,
    total_items: 0,
    server_loop: false,
    requesting: false,
    download_percent: 0,
  }),
  watch: {
    // value() {
    //   if (this.value && this.item) {
    //     this.form.issabel_server_id = this.item.issabel_server_id
    //     this.form.body.filters.campaign_id = { op: '=', value: this.item.id }
    //     this.form.body.page = 1
    //     this.getIsaabelCallReport()
    //   }
    // },
    // '$store.state.setting.issabel_item': {
    //   deep: true,
    //   handler() {
    //     this.setIssabelItems()
    //   },
    // },
  },
  // mounted() {
  //   this.setIssabelItems()
  // },
  beforeMount() {
    if (this.value && this.item) {
      this.form.issabel_server_id = this.item.issabel_server_id
      this.form.body.filters.campaign_id = { op: '=', value: this.item.id }
      this.form.body.page = 1

      this.getIsaabelCallReport()
    }

    this.headers = [
      {
        text: 'تاریخ تماس',
        disableSort: true,
        filterable: false,
        value: (body) => {
          if (body.created_at) {
            return jmoment(body.created_at, 'YYYY-MM-DD HH:mm:ss').format('jYYYY/jMM/jDD HH:mm')
          } else return ' --- '
        },
      },
      {
        text: 'شماره همراه',
        disableSort: true,
        filterable: false,
        value: 'phone',
      },
      {
        text: 'نام',
        disableSort: true,
        filterable: false,
        value: 'first_name',
      },
      {
        text: 'نام خانوادگی',
        disableSort: true,
        filterable: false,
        value: 'last_name',
      },
      {
        text: 'اطلاعات تکمیلی',
        disableSort: true,
        filterable: false,
        value: 'extra_info',
      },
      {
        text: 'وضعیت',
        filterType: 'select',
        disableSort: true,
        filterable: false,
        value: 'status',
        items: this.$store.state.static.voip_call_status,
      },
      {
        text: 'شروع تماس از',
        disableSort: true,
        filterable: false,
        value: (body) => {
          if (body.answered_at) {
            return jmoment(body.answered_at, 'YYYY-MM-DD HH:mm:ss').format('jYYYY/jMM/jDD HH:mm:ss')
          }
          return '-'
        },
      },
      {
        text: 'پایان تماس در',
        disableSort: true,
        filterable: false,
        value: (body) => {
          if (body.ended_at) {
            return jmoment(body.ended_at, 'YYYY-MM-DD HH:mm:ss').format('jYYYY/jMM/jDD HH:mm:ss')
          }
          return '-'
        },
      },

      {
        text: 'مدت زمان تماس',
        disableSort: true,
        filterable: false,
        value: (body) => this.calculateCallTime(body.answered_at, body.ended_at),
      },

      {
        text: 'نام IVR',
        disableSort: true,
        filterable: false,
        value: 'ivr_name',
      },
      {
        text: 'گزینه وارد شده',
        disableSort: true,
        filterable: false,
        value: 'ivr_code',
      },
      {
        text: 'زمان برنامه ریزی شده تماس',
        disableSort: true,
        filterable: false,
        value: (body) => {
          if (body.to_call_at) {
            return jmoment(body.to_call_at, 'YYYY-MM-DD HH:mm:ss').format('jYYYY/jMM/jDD HH:mm')
          }
        },
      },
      {
        text: 'تعداد تلاش مجدد',
        disableSort: true,
        filterable: false,
        value: 'try_numbers',
      },
    ]

    this.extra_btn = [
      {
        text: 'خروجی اکسل',
        color: 'primary',
        fun: () => {
          this.startServerLoop()
        },
      },
    ]
  },
  methods: {
    // setIssabelItems() {
    //   const issable_items = this.$store.state.setting.issabel_item
    //   let converted = []
    //   if (Array.isArray(issable_items) && issable_items.length > 0) {
    //     for (let i = 0; i < issable_items.length; i++) {
    //       const element = issable_items[i]
    //       converted.push({ text: element.text, value: element.value[0] })
    //     }
    //     this.issabel_items = converted
    //   }
    // },
    getIsaabelCallReport() {
      this.loading = true
      this.clearData()

      this.$reqApi(this.report_url, this.form)
        .then((response) => {
          let data = response.model
          if (Array.isArray(data) && data.length > 0) {
            this.report_data = data
          }

          for (const info in this.report_info) {
            if (response[info]) {
              this.report_info[info] = response[info]
            }
          }
          this.total_items = this.report_info.total_call_number
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    changePage(index) {
      this.form.body.page += index
      this.report_data = []
      this.getIsaabelCallReport()
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    calculateCallTime(answered_at, ended_at) {
      if (!answered_at || !ended_at) {
        return '-'
      }

      const answeredDate = new Date(answered_at)
      const endedDate = new Date(ended_at)

      const timeDifference = endedDate - answeredDate

      const secondsDifference = Math.floor(timeDifference / 1000)

      return secondsDifference + ' ثانیه'
    },
    clearData() {
      this.report_data = []
    },
    async startServerLoop() {
      this.server_loop = true
      this.requesting = true

      let counter = 0
      let gear_loop = false
      let page = 0
      let response = []

      let form = {
        issabel_server_id: this.form.issabel_server_id,
        url: 'auto-call',
        method: 'post',
        body: {
          row_number: this.count_req,
          page: 0,
          filters: {
            campaign_id: this.form.body.filters.campaign_id,
          },
        },
      }

      while (gear_loop == false) {
        counter = counter + this.count_req
        page = page + 1
        form.body.page = page

        let res = await this.requestToServer(form)
        if (res.model.data) {
          if (res.model.data.length < this.count_req) {
            gear_loop = true
          }
        } else {
          if (res.model.length < this.count_req) {
            gear_loop = true
          }
        }

        this.download_percent = ((counter / this.total_items) * 100).toFixed(3)
        if (counter == this.count_req) {
          if (res.model.data) {
            response.push(res.model.data)
          } else {
            response.push(res.model)
          }
        } else {
          if (res.model.data) {
            res.model.data.map((x) => {
              response[0].push(x)
            })
          } else {
            res.model.map((x) => {
              response[0].push(x)
            })
          }
        }

        if (gear_loop) {
          this.$exportCSV(this.headers, response[0])

          this.loading = false
          this.requesting = false
          this.server_loop = false
          this.download_percent = 0
          gear_loop = true
        }
      }
    },
    requestToServer(form) {
      return new Promise((res, rej) => {
        this.$reqApi(this.report_url, form)
          .then((response) => {
            res(response)
          })
          .catch(() => {
            this.loading = false
            this.server_loop = false
            this.requesting = false
            this.$toast.error('خطا در دریافت اطلاعات')
            rej()
          })
      })
    },
  },
}
</script>
<style scoped>
.contaer_box {
  border: 1px solid gray;
}
.contaer_box:hover {
  background: rgb(209, 209, 209);
}
.container_image {
  display: relative;
  overflow: hidden;
}
.cld-table {
  border: 1px solid gray;
}
.cld-table:hover {
  background: #d1d1d1c6;
}
.cld-export {
  position: absolute;
  display: flex;
  background: #ffffffb0 !important ;
  justify-content: center;
  align-items: center;
  z-index: 4;
  top: 0;
}
</style>

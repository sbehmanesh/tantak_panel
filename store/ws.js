export const state = () => ({
  caller_id: false,
  caller_phone: '',
  call_info: {},
  is_connect: false

})

export const mutations = {
  set_caller_id_status: function (state, data) {
  state.caller_id = {}

    // برای اینکه اگر چند تب داشته باشیم فقط یک نوتیفیکشن برای یک تماس داشته باشیم
    let name = 'ناشناس'
    if (data.data.first_name || data.data.first_name) {
      name = data.data.first_name + ' ' + data.data.first_name
    }
    state.caller_phone = data.data.username
    state.caller_id = data.status
    state.call_info = data.data
  },

  set_is_connect: function (state, data) {
    state.is_connect = data
  },

}

export const actions = {
  encode({ state, commit }, info) {
    if (info.channel == 'callerId') {
      commit('set_caller_id_status', { status: true, data: info.data })
    }
    else if (info.channel == 'pushNotification') {
      let options = {
        title: 'تماس جدید  ',
        message: info.data.message,
        path: '',
      }
      this.$showBrowserNotif(options)
    }
  },

  resetCallerId({ state, commit }, data) {
    commit('set_caller_id_status', { status: false, data: {} })
  },
  setConnest({ state, commit }, data) {
    commit('set_is_connect', data)
  },
}

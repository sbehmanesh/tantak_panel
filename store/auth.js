export const state = () => ({
  user: null,
  action: [],
  role_id: "",
  pg_user: null,
  panel_token: '',
  secondary_token: '',
  role: {
    is_user: false,
    is_other: true,
    is_admin: false,

    user_id: '5246f14d-1905-4e34-a412-8fb689d20f23',
    admin_id: '791d1b02-3660-4177-9051-eb7ae6b72def',
  },
})

export const mutations = {
  set_user: function (state, data) {
    state.user = data
  },
  set_action: function (state, data) {
    state.action = data
  },
  set_role_id: function (state, data) {
    state.role_id = data
  },
  set_pg_user: function (state, data) {
    state.pg_user = data
  },
  set_token: function (state, data) {
    if (Boolean(data.secondary_token) && Boolean(data.update)) {
      state.panel_token = data.token
      localStorage.removeItem('secondary_token')
    } else if (Boolean(data.secondary_token)) {
      state.panel_token = data.secondary_token
      localStorage.removeItem('secondary_token')
    } else {
      state.panel_token = data.token
      if (Boolean(data)) {
        localStorage.setItem('panel_token', data.token)
      } else {
        localStorage.removeItem('panel_token')
      }
    }
    localStorage.removeItem('secondary_token')
  },
  set_role: function (state, keys) {
    let role = { ...state.role }
    for (const key in role) {
      const element = role[key]
      if (typeof element == 'boolean') {
        role[key] = false
      }
    }
    for (let index = 0; index < keys.length; index++) {
      role[keys[index]] = true
    }
    state.role = { ...role }
  },
}

export const actions = {
  async nuxtServerInit({ state,commit, dispatch }, redirect = true) {
    return new Promise(async (res, rej) => {
      try {
        let token = localStorage.getItem('panel_token')
        let secondary_token = localStorage.getItem('secondary_token')
        if (token) {
          await commit('set_token', { token, secondary_token })
          await this.$reqApi(`/auth/user`, { getToken: true},{redirect:redirect })
            .then(async (response) => {
              await dispatch('setAction', response.user)
              await commit('set_user', response.user)
              await dispatch('setRole', response.user)
              await dispatch('setActions')
              // await dispatch('setMenuItem', response.user )
              // await dispatch('getDivisoin')
              if (response.Authorization) {
                await commit('set_token', { token: response.Authorization, secondary_token, update: true })
              }
              res()
            })
            .catch(async (error) => {
              if (redirect) {
                dispatch('error401')
              } else {
                rej()
              }
            })
        } else {
          if (redirect) {
            dispatch('error401')
          } else {
            rej()
          }
        }
      } catch (error) {
        if (redirect) {
          dispatch('error401')
        } else {
          rej()
        }
      }
    })
  },
  async login({ commit, dispatch }, { user, Authorization }) {
    commit('set_user', user)
    await dispatch('setAction', user)
    await dispatch('setRole', user)
    await commit('set_token', { token: Authorization })
    await dispatch('setActions')
    // await dispatch('getDivisoin')
    // await dispatch('setMenuItem', user)
  },
  async logout({ dispatch }) {
    this.$reqApi('/auth/logout').catch((error) => { })
    dispatch('error401')
  },
  async error401({ commit }) {
    await commit('set_action', [])
    await commit('set_user', null)
    await commit('set_token', { token: null })
    localStorage.clear('auth_token')
    window.location.href = '/#/auth/login'
  },
  async setAction({ commit }, user) {
    let role_id = ''
    let actions = []
    user.roles.forEach((element) => {
      role_id = element.id
      let action = element.actions.map((x) => x.alias)
      actions = [...actions, ...action]
    })
    await commit('set_action', actions)
    await commit('set_role_id', role_id)
  },
  async setRole({ commit, state }, user) {
    if (Boolean(user) && Boolean(user.roles) && Array.isArray(user.roles) && user.roles.length > 0) {
      let items = []
      for (let index = 0; index < user.roles.length; index++) {
        const role = user.roles[index]

        for (const key in state.role) {
          const element = state.role[key]
          if (typeof element == 'string' && element == role.id) {
            items.push('is_' + key.replace('_id', ''))
          }
        }
      }
      if (items.length > 0) {
        await commit('set_role', items)
      }
    } else {
      await commit('set_role', 'other')
    }
  },
  async setMenuItem({state,dispatch}, data){
    dispatch('setting/getMenuItemServer', data.menu,{root:true})
  },
  async setActions({dispatch}){
     dispatch('setting/getActionServer', '',{root:true})
  },
  async getDivisoin({state,dispatch}){
    dispatch('setting/setCountryDivision', '', {root:true})
  }
}

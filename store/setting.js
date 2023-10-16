
export const state = () => ({
    roles: [],
    branch_code: [],
    region: [],
    actions: [],
    menu_item: [],
    user_type: [],
    role_action: [],
    show_user_score: '',
    select_user_role: '',
    country_division: [],
    province: [],
    township: [],
    district: [],
    city: [],
    rural_district: [],
    village: [],
    public_setting: {},
    site_name: "",
    site_logo: "",
    type_plate: false,
})

export const mutations = {
    set_role: function (state, data) {
        state.roles = data
    },
    set_branch: function (state, data) {
        state.branch_code = data
    },
    set_region: function (state, data) {
        state.region = data
    },
    set_actions: function (state, data) {
        state.actions = data
    },
    set_user_type: function (state, data) {
        state.user_type = data
    },
    set_role_action: function (state, data) {
        state.role_action = data
    },
    set_counter_item: function (state, data) {
        state.conter_item = data
    },
    set_item_divison: function (state, data) {
        state.province = data.province
        state.township = data.township
        state.district = data.district
        state.city = data.city
        state.rural_district = data.rural_district
        state.village = data.village
        state.country_division = data
    },
    set_menu: function (state, data) {
        state.menu_item = data
    },
    set_public_setting: function (state, data) {
        data.value = JSON.parse(data.value)
        if (data.value.logo) {
            state.site_logo = data.value.logo
        } if (data.value.site_title) {
            state.site_name = data.value.site_title
        }
        state.public_setting = data
    },
    set_type_plate: function (state, data) {
        state.type_plate = data
    }
}

export const actions = {
    getPublicSetting({ commit }) {
        this.$reqApi('/setting', { filters: { key: 'main_setting' } })
            .then(async (response) => {
                if (response.model.data.length != 0) {
                    await commit('set_public_setting', response.model.data[0])
                }
            })
            .catch((error) => {
            })
    },

    getRoleServer({ commit }) {
        return new Promise((res, rej) => {
            this.$reqApi(`/role`, { row_number: 2000 })
                .then(async (response) => {
                    let roles = response.model.data.map(x => ({ ...x, text: x.name, value: x.id }))
                    await commit('set_role', roles)

                    res(roles)
                })
                .catch((error) => { res() })
        })
    },
    // getMenuItemServer({commit, state}){
    //     return new Promise((res, rej) => {
    //         if (Array.isArray(state.actions) && state.actions.length > 0) {
    //             res(state.actions)
    //         }
    //         this.$reqApi(`/menu-item/user-menu`, { row_number: 2000 })
    //             .then(async (response) => {
    //                 await commit('set_menu', response.model)
    //                 res(items)
    //             })
    //             .catch((error) => { res() })
    //     })
    // },
    getMenuItemServer({ commit }, menu) {
        commit('set_menu', menu)
    },
    getRoleByActionServer({ commit }, body) {
        return new Promise((res, rej) => {
            this.$reqApi(`/role/get-by-action`, body)
                .then(async (response) => {
                    let roles = response.model.map(x => ({ text: x.name, value: x.id }))
                    await commit('set_role_action', roles)
                    res(roles)
                })
                .catch((error) => { res() })
        })
    },
    getActionServer({ commit, state }) {
        return new Promise((res, rej) => {
            if (Array.isArray(state.actions) && state.actions.length > 0) {
                res(state.actions)
            }
            this.$reqApi(`/action`, { row_number: 2000 })
                .then(async (response) => {
                    await commit('set_actions', response.model.data)
                    res(items)
                })
                .catch((error) => { res() })
        })
    },
    setCountryDivision({ commit }) {
        this.$reqApi('/country-division', { row_number: 3000 }).then((res) => {
            let data = {
                province: res.model.data.filter((x) => x.level == 'province'),
                township: res.model.data.filter((x) => x.level == 'township'),
                district: res.model.data.filter((x) => x.level == 'district'),
                city: res.model.data.filter((x) => x.level == 'city'),
                rural_district: res.model.data.filter((x) => x.level == 'rural_district'),
                village: res.model.data.filter((x) => x.level == 'village'),
            }
            commit('set_item_divison', data)
        }).catch((err) => {
            return err
        })
    },
    reloadPlate({ state, commit }, type) {
        commit('set_type_plate', type)
    },
    setBranchCod({ commit }, data) {
        try {
            return new Promise((res, rej) => {
                this.$reqApi(`/branch`, { row_number: 2000 })
                    .then(async (response) => {

                        res(response.model.data)
                    })
                    .catch((error) => { res() })
            })
                .then(res => {
                    let branch = res.map(x => ({ ...x, text: [x.branch_code + " - " + x.name], value: x.id }))
                    commit('set_branch', branch)

                })
        } catch (error) {
        }

    },
    setgetRegion({ commit }, data) {
        try {
            return new Promise((res, rej) => {
                this.$reqApi(`/region`, { row_number: 2000 })
                    .then(async (response) => {

                        res(response.model.data)
                    })
                    .catch((error) => { res() })
            })
                .then(res => {
                    let region = res.map(x => ({ ...x, text: x.fa_name, value: x.id }))
                    commit('set_region', region)

                })
        } catch (error) {
        }

    },
}

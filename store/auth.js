export const state = () => ({
  user: null,
  action: [],
  role_id: "",
  pg_user: null,
  panel_token: "",
  secondary_token: "",
  role: {
    is_user: false,
    is_other: true,
    is_admin: false,
    is_supervasier: false,
    is_operator: false,
    is_adming_call_center_id: false,
    seal_manager: "1964bd45-1d8d-4666-9330-0955f8c2c4c6",
    cashier_id: "38d3025b-ed61-4d0d-815f-31c008eb33fc", //  صندوق دار
    user_id: "5246f14d-1906-4e34-a412-8fb689d20f23",
    warehouseman_id: "1deb3b9b-a4bb-46cd-8c20-592767aa1d22", //انبار گردان
    writers_id: "79b26146-1c0b-4562-b968-21d0e8b5a575",
    store_employee: "dbcbc932-552a-4f3b-ad81-5b3a5734b803", //کارمند انبار
    admin_id: "791d1b02-3610-4177-9051-eb7ae6b72def",
    admin_call_center_id: "495c61df-0a45-4d3d-9153-8fc614c65361",
    superviser_id: "9154bce8-a24c-4841-8d00-77bedf0ae90e",
    oprator_id: "b531a124-cc96-405b-aaab-3b5cc9526de2",
    fac_call_id: "920976fd-423f-413a-8dba-eead45af9dea",
    sale_manager: "7dd0a103-1dd1-4571-bb6b-d0f65101f5b0", //مدیر فروش
    coordinator_id: "b659c438-531d-4aab-93e0-58f5835c1cb2",
    financial_unit_id: "920976fd-423f-413a-8dba-eead45af9dea",
    supervisor_coordinator: "38d9a458-5aba-4274-a71f-877e2bf655d4",
    coordinating_manager: "7e6e5f8b-84db-48f5-bd93-7e38fcc30c2e",
    manager_financial_unit: "f013ea6f-78ed-44c5-ab38-6ed3ff9a4145",
    head_financial_unit: "d4d80c65-15fd-42e6-b578-594280168664",
    delivery_coordination_manager: "f910512c-d16e-49de-94e2-8e6082099a3e",
    delivery_coordination_supervisor: "c47efd40-041a-4ad6-8447-c38ad75adb8b",
    delivery_coordination: "e2bc62b1-ea70-494a-bb77-2efee98fa477",
    storekeeper: "7b69e2eb-8036-4d27-8b6a-a1e37928635e",
    agency_manager: "1964bd45-1d8d-4666-9330-0955f8c2c4c6",
    agency_employee: "bc5bde21-2126-4c7a-b979-12c9a0b73744",
    courier: "32b21551-05fe-42ad-a769-d1c633efd8e0",
    sales_manager: "3c22da53-9982-4634-81ce-293600e03d97",
    sales_expert: "acf183ec-4b47-4afb-8238-461df51fc4e6",
    superviser_centeral_stock: "023b91d1-392b-4f46-8921-94d87316ddb4",
    employee_centeral_stock: "dbcbc932-552a-4f3b-ad81-5b3a5734b803",
    fiscal_manager: "f013ea6f-78ed-44c5-ab38-6ed3ff9a4145",

    fiscal_supervisor: "d4d80c65-15fd-42e6-b578-594280168664",
    fiscal: "920976fd-423f-413a-8dba-eead45af9dea",

    sefir :"19418275-309c-440f-a067-c77368e2b785"
  },
});

export const mutations = {
  set_user: function (state, data) {
    state.user = data;
  },
  set_action: function (state, data) {
    state.action = data;
  },
  set_role_id: function (state, data) {
    state.role_id = data;
  },
  set_pg_user: function (state, data) {
    state.pg_user = data;
  },
  set_token: function (state, data) {
    if (Boolean(data.secondary_token) && Boolean(data.update)) {
      state.panel_token = data.token;
      localStorage.removeItem("secondary_token");
    } else if (Boolean(data.secondary_token)) {
      state.panel_token = data.secondary_token;
      localStorage.removeItem("secondary_token");
    } else {
      state.panel_token = data.token;
      if (Boolean(data)) {
        localStorage.setItem("panel_token", data.token);
      } else {
        localStorage.removeItem("panel_token");
      }
    }
    localStorage.removeItem("secondary_token");
  },
  set_role: function (state, keys) {
    let role = { ...state.role };
    for (const key in role) {
      const element = role[key];
      if (typeof element == "boolean") {
        role[key] = false;
      }
    }
    for (let index = 0; index < keys.length; index++) {
      role[keys[index]] = true;
    }
    state.role = { ...role };
  },
};

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }, redirect = true) {
    return new Promise(async (res, rej) => {
      try {
        let token = localStorage.getItem("panel_token");
        let secondary_token = localStorage.getItem("secondary_token");
        if (token) {
          await commit("set_token", { token, secondary_token });
          await this.$reqApi(
            `/auth/user`,
            { getToken: true },
            { redirect: redirect }
          )
            .then(async (response) => {
              await commit("set_user", response.user);
              await dispatch("setRole", response.user);
              await dispatch("setAction", response.user);
              // await dispatch("setActions");
              // await dispatch('setMenuItem', response.user )
              if (response.Authorization) {
                await commit("set_token", {
                  token: response.Authorization,
                  secondary_token,
                  update: true,
                });
              }
              res();
            })
            .catch(async (error) => {
              if (redirect) {
                dispatch("error401");
              } else {
                rej();
              }
            });
        } else {
          if (redirect) {
            dispatch("error401");
          } else {
            rej();
          }
        }
      } catch (error) {
        if (redirect) {
          dispatch("error401");
        } else {
          rej();
        }
      }
    });
  },
  async login({ commit, dispatch }, { user, Authorization }) {
    commit("set_user", user);
    await dispatch("setAction", user);
    await dispatch("setRole", user);
    await commit("set_token", { token: Authorization });
    // await dispatch("setActions");
    // await dispatch('setMenuItem', user)
  },
  async logout({ dispatch }) {
    this.$reqApi("/auth/logout").catch((error) => {});
    dispatch("error401");
  },
  async error401({ commit }) {
    await commit("set_action", []);
    await commit("set_user", null);
    await commit("set_token", { token: null });
    localStorage.clear("auth_token");
    window.location.href = "/#/auth/login";
  },
  async setAction({ commit }, user) {
    let role_id = "";
    let actions = [];
    user.roles.forEach((element) => {
      role_id = element.id;
      let action = element.actions.map((x) => x.alias);
      actions = [...actions, ...action];
    });
    await commit("set_action", actions);
    await commit("set_role_id", role_id);
  },
  async setRole({ commit, state }, user) {
    if (
      Boolean(user) &&
      Boolean(user.roles) &&
      Array.isArray(user.roles) &&
      user.roles.length > 0
    ) {
      let items = [];
      for (let index = 0; index < user.roles.length; index++) {
        const role = user.roles[index];

        for (const key in state.role) {
          const element = state.role[key];
          if (typeof element == "string" && element == role.id) {
            items.push("is_" + key.replace("_id", ""));
          }
        }
      }
      if (items.length > 0) {
        await commit("set_role", items);
      }
    } else {
      await commit("set_role", "other");
    }
  },
  async setMenuItem({ state, dispatch }, data) {
    dispatch("setting/getMenuItemServer", data.menu, { root: true });
  },
  async getBranchCode({ state, dispatch }) {
    try {
      await dispatch("setting/setBranchCod", {}, { root: true });
    } catch (error) {}
  },
  // async getRegion({ state, dispatch }) {
  //   try {
  //     await dispatch("setting/setgetRegion", {}, { root: true });
  //   } catch (error) {}
  // },
  // async setAction({ dispatch }) {
  //   dispatch("setting/getActionServer", "", { root: true });
  // },
  async getDivisoin({ state, dispatch }) {
    dispatch("setting/setCountryDivision", "", { root: true });
  },
};

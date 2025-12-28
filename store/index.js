let app_name = "پنل بانیان";
let app_name_bimch = "پنل ادمین  بانیان";
let logo_bimche = "/image/logo.png";

let time_interval = null;

export const state = () => ({
  live_time: "",
  server_time: "",
  app_name: "",
  logo: logo_bimche,
  page_title: app_name,
  file_url: "https://tantak-api.sav-test.ir/",
  server_url: "https://tantak-api.sav-test.ir/api/v1",
  ws_url:'wss://socket.tantak.ir/ws'
});

export const mutations = {
  set_app_name: function (state, data) {
    app_name = app_name_bimch;
    state.app_name = app_name_bimch;
  },
  set_title: function (state, data) {
    if (typeof data != "string" && data.length == 0) {
      data = app_name;
    }
    state.page_title = data;
  },
  set_logo: function (state, data) {
    state.logo = logo_bimche;
  },
  set_server_time: function (state, data) {
    state.server_time = data;
    let offset = new Date(data).getTime() - Date.now();
    this.$moment.now = () => {
      return offset + Date.now();
    };
  },
  set_live_time: function (state, data) {
    state.live_time = data;
  }
};

export const actions = {
  setPageTitle({ commit }, title) {
    if (title) {
      commit("set_title", title);
    }
  },
  setLogo({ commit }, type) {
    commit("set_logo", type);
  },
  setAppName({ commit }, name) {
    commit("set_app_name", name);
  },
  async setServerTime({ commit }, date) {
    await commit("set_server_time", date);

    if (time_interval) {
      clearInterval(time_interval);
    }
    setInterval(() => {
      commit("set_live_time", this.$moment());
    }, 1000);
  }
};

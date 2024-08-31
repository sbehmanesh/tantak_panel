export const state = () => ({
  count: 0,
  items: [],
  last_update: "",
});
export const mutations = {
  set_notification: function (state, data) {
    if (Array.isArray(data.items)) {
      state.items = data.items;
    }
    if (typeof data.count != "undefined" && !isNaN(data.count)) {
      state.count = data.count;
    }
  },
};
export const actions = {
  getNotif({ commit }) {
    let notif = { items: [], count: 0 };
    this.$reqApi("/notification/list").then((res) => {
      if (res.model.data) {
        notif.items = res.model.data;
        if (Array.isArray(notif.items) && notif.items.length > 0) {
          notif.items.forEach((elem) => {
            if (elem.seen_at == null) {
              notif.count++;
            }
          });
        }
        commit("set_notification", notif);
      }
    });
  },
  setSeenNotification({ state, commit }) {
    if (state.count == 0) {
      return
    }
    commit('set_notification', { count: 0 })
  }, 
};

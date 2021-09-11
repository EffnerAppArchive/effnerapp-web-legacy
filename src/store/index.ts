import {createStore} from 'vuex';

export default createStore({
  state: {
    registered: false,
    credentials: null,
    substitutions: null,
    class: null,
    data: null,
    mvvState: null,
    error: null,
    notificationsEnabled: false,
    firstLaunch: true,
    darkMode: false
  },
  mutations: {
    setCredentials(state, to) {
      state.credentials = to;
    },
    setSubstitutions(state, to) {
      state.substitutions = to;
    },
    setClass(state, to) {
      state.class = to;
    },
    setRegistered(state, to) {
      state.registered = to;
    },
    setData(state, to) {
      state.data = to;
    },
    setMVVState(state, to) {
      state.mvvState = to;
    },
    setError(state, to) {
      state.error = to;
    },
    setNotificationsEnabled(state, to) {
      state.notificationsEnabled = to;
    },
    setFirstLaunch(state, to) {
      state.firstLaunch = to;
    },
    setDarkMode(state, to) {
      state.darkMode = to;
    },
    reset(state) {
      state.credentials = null;
      state.registered = false;
      state.class = null;
      state.data = null;
      state.mvvState = null;
      state.error = null;
    }
  },
  getters: {
    getCredentials(state) {
      return state.credentials;
    },
    getSubstitutions(state) {
      return state.substitutions;
    },
    isRegistered(state) {
      return state.registered;
    },
    getClass(state) {
      return state.class;
    },
    getData(state) {
      return state.data;
    },
    getMVVState(state) {
      return state.mvvState;
    },
    getError(state) {
      return state.error;
    },
    getNotificationsEnabled(state) {
      return state.notificationsEnabled;
    },
    isFirstLaunch(state) {
      return state.firstLaunch;
    },
    getDarkMode(state) {
      return state.darkMode;
    }
  },
  actions: {
  },
  modules: {
  }
});

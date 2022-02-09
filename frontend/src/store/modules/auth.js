import axios from "@/utils/axios";
import router from "@/router";
import store from "@/store";

import {
  addToLocalStorageArray,
  addToLocalStorageObject,
  updateLocalStorageArray,
  removeLocalStorageTokens,
} from "@/store/helper";
import { operatorValues, matchErrors } from "@/utils/utils";

const state = {
  token: localStorage.getItem("token") || "",
  refresh: localStorage.getItem("refresh") || "",
  user: JSON.parse(localStorage.getItem("user")) || "",
  // accounts: JSON.parse(localStorage.getItem("accounts")) || "",
  base_url: process.env.VUE_APP_BASE_URL,
  authError: {
    loginError: null,
    signupError: null,
  },
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  user: (state) => state.user || "",
};

const actions = {
  // Login User Action
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "/auth/login",
        data: userInfo,
      }).then(
        (response) => {
          const token = response.data.token.accessToken;
          const refresh = response.data.token.refreshToken;
          const user = response.data.user;
          const accounts = response.data.accounts;

          const payload = {
            token,
            refresh,
            user,
            accounts,
          };
          localStorage.setItem("token", token);
          localStorage.setItem("refresh", refresh);
          localStorage.setItem("user", JSON.stringify(user));

          axios.defaults.headers.common["Authorization"] = "Bearer " + token;

          store.commit("services/set_accounts_data", accounts, { root: true });
          store.commit(
            "services/set_default_account",
            user.defaultMonoAccount,
            { root: true }
          );
          commit("auth_success", payload);
          router.push({ name: "Dashboard" });
          resolve(response);
        },
        (error) => {
          const err_message = error.response.data.message;
          commit("login_auth_error", err_message);
          removeLocalStorageTokens();
          reject(error);
        }
      );
    });
  },

  // Signup user Action
  signup({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      axios.post("auth/register", userInfo).then(
        (response) => {
          const token = response.data.token.accessToken;
          const refresh = response.data.token.refreshToken;
          const user = response.data.user;

          const payload = {
            token,
            refresh,
            user,
          };

          console.log(payload);

          const loginContinue = localStorage.getItem("loginContinue");

          localStorage.setItem("token", token);
          localStorage.setItem("refresh", refresh);
          localStorage.setItem("user", JSON.stringify(user));

          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          commit("auth_success", payload);

          if (loginContinue) {
            router.push(loginContinue);
          }

          router.push({ name: "Accounts" });
          resolve(response); // Let the calling function know that http is done. You may send some data back
        },
        (error) => {
          const err_message = operatorValues(matchErrors(error.response.data));
          commit("signup_auth_error", err_message);
          removeLocalStorageTokens();
          reject(error);
        }
      );
    });
  },

  async refreshToken({ commit }, token) {
    commit("auth_refresh_success", { token });
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      store.dispatch("services/deleteServiceData");
      commit("initiate_logout");
      resolve();
    });
  },
};

const mutations = {
  auth_success(state, payload) {
    state.authError["loginError"] = null;
    state.authError["signupError"] = null;
    state.token = payload["token"];
    state.refresh = payload["refresh"];
    state.user = payload["user"];
    // state.accounts = payload["accounts"];
  },

  login_auth_error(state, data) {
    state.authError["loginError"] = data;
  },

  signup_auth_error(state, data) {
    state.authError["signupError"] = data;
  },

  auth_refresh_success(state, payload) {
    state.token = payload["token"];
  },

  initiate_logout(state, payload) {
    state.user = {};
    state.refresh = "";
    state.token = "";

    setTimeout(function () {
      localStorage.removeItem("vuex");

      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      localStorage.removeItem("accounts");
      localStorage.clear();
      router.push({ name: "Login" });
    }, 10);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

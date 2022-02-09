import axios from "axios";
import router from "@/router";
import store from "@/store";
import { operatorValues } from "@/utils/utils";
import qs from "qs";

const state = {
  categories: [],
  accounts: [],
  defaultAccount: "",
};

const getters = {};

const actions = {
  getCategories({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        url: `categories`,
      }).then(
        (response) => {
          //   console.log(response.data.data);
          commit("load_categories_data", response.data.data);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  getTransactionByAccountId({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        url: `transactions/${id}`,
      }).then(
        (response) => {
          //   console.log(response.data.data);
          // commit("load_categories_data", response.data.data);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  addAccount({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: "accounts/add",
        data: data,
      }).then(
        (response) => {
          console.log("ADDED ACCOUNT DATA");
          commit("update_accounts_data", response.data.data);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  setDefaultAccount({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "PUT",
        url: "accounts/setDefault",
        data: data,
      }).then(
        (response) => {
          console.log("DEFAULT ACCOUNT HAS BEEN SET");
          // commit("update_accounts_data", response.data.data);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  categoriseTransaction({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "PUT",
        url: `transactions/categorize/${data.id}`,
        data: data,
        data: { category: data.category },
      }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  unlinkAccount({ commit }, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: `services/unlink`,
        data: data,
        data: { account: data },
      }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  //   getAccounts({ commit }, id) {
  //     return new Promise((resolve, reject) => {
  //       axios({
  //         method: "GET",
  //         url: `accounts`,
  //       }).then(
  //         (response) => {
  //           console.log(response.data.data);
  //           commit("load_accounts_data", response.data.data);
  //           resolve(response);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //     });
  //   },

  fetchAccountId({ commit }, token) {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: `services/account-id`,
        data: { code: token },
      }).then(
        (response) => {
          console.log("in services...");
          console.log(response.data);
          resolve(response);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  },

  //   getLogs({ commit }, id) {
  //     return new Promise((resolve, reject) => {
  //       axios({
  //         method: "GET",
  //         url: `logs`,
  //       }).then(
  //         (response) => {
  //           console.log(response.data.data);
  //           commit("load_logs_data", response.data.data);
  //           resolve(response);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //     });
  //   },

  //   getTransactions({ commit }, groupId) {
  //     return new Promise((resolve, reject) => {
  //       axios({
  //         method: "GET",
  //         url: `transactions/${groupId}`,
  //       }).then(
  //         (response) => {
  //           console.log(response.data.data);
  //           commit("load_transaction_data", response.data.data);
  //           resolve(response);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //     });
  //   },

  //   initiateDataSync({ commit }, accountId) {
  //     return new Promise((resolve, reject) => {
  //       axios({
  //         method: "GET",
  //         url: `services/sync/${accountId}`,
  //       }).then(
  //         (response) => {
  //           // console.log(response.data);
  //           resolve(response);
  //         },
  //         (error) => {
  //           reject(error);
  //         }
  //       );
  //     });
  //   },

  //   initiateReauthorisation({ commit }, accountId) {
  //     return new Promise((resolve, reject) => {
  //       axios({
  //         method: "GET",
  //         url: `services/reauth/${accountId}`,
  //       })
  //         .then((response) => {
  //           // console.log(response.data);
  //           resolve(response);
  //         })
  //         .catch((error) => {
  //           reject(error);
  //         });
  //     });
  //   },

  deleteServiceData({ commit }) {
    commit("reset_data");
  },
};

const mutations = {
  load_categories_data(state, data) {
    state.categories = data;
  },
  //   load_logs_data(state, data) {
  //     state.logs = data;
  //   },
  //   load_transaction_data(state, data) {
  //     state.transactions = data;
  //   },
  update_accounts_data(state, data) {
    state.accounts.push(data);
  },
  set_accounts_data(state, data) {
    state.accounts = data;
  },
  set_default_account(state, data) {
    state.defaultAccount = data;
  },

  //   update_account_reauth_status(state, accountId) {
  //     state.accounts = state.accounts.map((x) =>
  //       x.accountId === accountId ? { ...x, reauthRequired: true } : x
  //     );
  //   },
  //   set_shops(state, data) {
  //     state.shops = data;
  //   },
  //   clear_transaction_data(state) {
  //     state.transactions = [];
  //   },
  reset_data(state) {
    state.categories = [];
    state.accounts = [];
  },
  //   set_approved_shop(state, data){
  //     const slug = router.currentRoute.params.slug
  //     const shopIndex = state.shops.findIndex((obj => obj.sub_domain == slug))
  //     state.shops[shopIndex].is_active = true
  //   },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

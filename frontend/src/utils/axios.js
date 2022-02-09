import axios from "axios";
import router from "@/router";
import store from "@/store";

const token = localStorage.getItem("token") || "";

// axios.defaults.baseURL = 'http://127.0.0.1:8000/' // the prefix of the URL
// axios.defaults.baseURL = "http://127.0.0.1:3000/v1" // the prefix of the URL
// axios.defaults.baseURL = process.env.VUE_APP_ENV_URL // the prefix of the URL
axios.defaults.baseURL = "http://127.0.0.1:7000/v1"; // the prefix of the URL
axios.defaults.headers.get["Accept"] = "application/json"; // default header for all get request
axios.defaults.headers.post["Accept"] = "application/json"; // default header for all POST request
axios.defaults.headers.post["Content-Type"] = "application/json";

// axios.defaults.headers['Cache-Control'] = 'no-cache'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  // axios.defaults.headers.common["Authorization"] = token;
}

let isRefreshing = false;
let failedQueue = [];
const unwantedAccess = ["auth/login", "auth/signup"];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// axios.interceptors.response.use(function (response) {
//   return response;
// }, function (error) {

//   const originalRequest = error.config;

//   if (error.response.data.detail == "Token is invalid or expired") {
//     // localStorage.setItem('loginContinue', router.history._startLocation)
//     store.dispatch('auth/logout');
//   }

//   if (!error.response) {
//       alert("Please check your internet connection.");
//   }

//   if (error.response.status === 401 && unwantedAccess.includes(originalRequest.url)) { return Promise.reject(error); }
//   if (error.response.status === 401 && originalRequest.url === 'auth/refresh-token') {
//     if (router.history._startLocation != "auth/login") {
//       localStorage.setItem('loginContinue', router.history._startLocation)
//     }
//     store.dispatch('auth/logout');
//   }

//   if (error.response.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise(function(resolve, reject) {
//           failedQueue.push({resolve, reject})
//         }).then(token => {
//           originalRequest.headers['Authorization'] = 'Bearer ' + token;
//           return axios(originalRequest);
//         }).catch(err => {
//           return Promise.reject(err);
//         })
//       }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     const refreshToken = localStorage.getItem('refresh');
//     return new Promise(function (resolve, reject) {
//        axios.post('auth/refresh-token', { refresh: refreshToken })
//         .then(({data}) => {
//             localStorage.setItem('token', data.access);
//             axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
//             originalRequest.headers['Authorization'] = 'Bearer ' + data.access;
//             store.dispatch('auth/refreshToken', data.access);
//             processQueue(null, data.access);
//             resolve(axios(originalRequest));
//         })
//         .catch((err) => {
//             processQueue(err, null);
//             reject(err);
//         })
//         .finally((val) => {
//           isRefreshing = false;
//         })
//     })
//   }
//   return Promise.reject(error);
// });

export default axios;

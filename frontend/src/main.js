import Vue from "vue";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "@/utils/axios";
import "w3-css/w3.css";
// import Mono from 'vue-mono'
import moment from "moment";
import VModal from "vue-js-modal/dist/index.nocss.js";
import "vue-js-modal/dist/styles.css";
import VueIziToast from "vue-izitoast";
import "izitoast/dist/css/iziToast.css";

// FONT-AWESOME START
// Inject font-awesome start
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSpinner);
Vue.component("font-awesome-icon", FontAwesomeIcon);

import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

Vue.use(VueAxios, axios);
// Vue.use(Mono, { publicKey: process.env.VUE_APP_ENV_MONO_PUBLIC_KEY })
Vue.prototype.moment = moment;
Vue.use(VModal);
Vue.use(VueIziToast);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

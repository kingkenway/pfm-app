<template>
  <div id="nav" class="w3-bar w3-content w3-greenx" style="padding: 5px" v-if="isLoggedIn">

      <div class="">
        <router-link :to="{ name: 'Home' }" class="w3-bar-item">
            Monefy
        </router-link>
      </div>

      <div class="w3-right">
          <div class="w3-right-align" v-if="isLoggedIn">
              <router-link :to="{ name: 'profile' }" class="w3-bar-item">
                  Hi, {{user.email}}
              </router-link>
              <router-link :to="{ name: 'Logout' }" class="w3-bar-item item-nav w3-text-white w3-card w3-small">Logout</router-link>
          </div>

      </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import router from '@/router'
export default {
  name: 'Navbar',
  computed: mapGetters('auth', ['user', 'isLoggedIn']),
}
</script>

<style scoped>
.item-nav{
  background-color: black;
  color: #fff;
  margin: 0 3px 0 3px;
  border-radius: 5px;
}
#nav {
  /* padding: 15px; */
  color: white;
  /* margin-top: 30px; */
  /* background-color: #827ffe; */
}
#nav a {
  /* padding: 15px; */
  font-weight: bold;
  /* color: #2c3e50; */
  text-decoration: none;
}
/* #nav a:hover {
  border-bottom: 1px solid #ccc;
} */
#nav a.router-link-exact-active {
  /* text-decoration: underline; */
  /* color: #827ffe; */
}

/* .w3-bar-item{
    color: white;
} */

/*Filter styles*/
.saturate { filter: saturate(3); }
.grayscale { filter: grayscale(100%); }
.contrast { filter: contrast(160%); }
.brightness { filter: brightness(0.25); }
.blur { filter: blur(3px); }
.invert { filter: invert(100%); }
.sepia { filter: sepia(100%); }
.huerotate { filter: hue-rotate(180deg); }
.rss.opacity { filter: opacity(50%); }
</style>
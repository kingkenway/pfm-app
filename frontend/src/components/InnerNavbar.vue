<template>
  <div id="inner-nav" class="w3-paddingx" style="padding-left: 18px">
        <router-link :to="{ name: 'Dashboard' }" class="w3-bar-item">DASHBOARD</router-link>
        <router-link :to="{ name: 'Accounts' }" class="w3-bar-item">MY ACCOUNTS</router-link>
        <router-link :to="{ name: 'Settings' }" class="w3-bar-item">SETTINGS</router-link>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'InnerNavbar',
  computed: mapGetters('auth', ['user', 'isLoggedIn']),
}
</script>

<style>
#inner-nav {
  /* padding: 15px; */
  color: black;
  margin-top: 30px;
}
#inner-nav a {
  font-weight: bold;
  text-decoration: none;
  margin-right: 15px;
}

#inner-nav a.router-link-exact-active {
    border-bottom: 1px solid black;
}
</style>
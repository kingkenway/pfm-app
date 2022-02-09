<template>
  <div id="app"></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "Logout",
  methods: {
    ...mapActions('auth', ['logout']),
  },
  created: function () {
    this.logout()
  }
}
</script>